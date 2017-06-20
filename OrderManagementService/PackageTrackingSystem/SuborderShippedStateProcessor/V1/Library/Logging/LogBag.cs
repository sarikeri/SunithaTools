using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace Wag.Oms.SOS.Logging
{
    /// <summary>
    /// LogBag encapsulates a structured 'bag' of objects to log
    /// </summary>
    public class LogBag : Dictionary<Enum, object>, IComparer<LogBag.OrderedBag>
    {
        /// <summary>
        /// DEPRECATED. Use And() instead.
        /// Set a bag property signle value. an alias for the [] method. returns this for concatanated calling (logBag.SetValue().SetValue()...
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        [Obsolete("Use And(...) Instead", false)]
        public LogBag AddSetSingleValue(Enum key, object val)
        {
            return And(key, val);
        }

        /// <summary>
        /// Set a bag property signle value. an alias for the [] method. returns this for concatanated calling (logBag.SetValue().SetValue()...
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        public LogBag And(Enum key, object val)
        {
            this[key] = val;
            return this;
        }

        public LogBag AddSetMultipleValue(Enum key, object val)
        {
            throw new NotImplementedException();
            // TODOensure it is null or list; if list, add, if null, create list
            // ALSO make sure lists render correctly
            // needed for supporting multivalued single-named entity
        }

        public static LogBag CreateExceptionBag(Exception e)
        {
            var res = new LogBag();
            res[BaseLoggable.Exception] = e;
            return res;
        }

        /// <summary>
        /// Standard for fluent bag addition.
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public LogBag AddToBag(Exception e)
        {
            this[BaseLoggable.Exception] = e;
            return this;
        }

        private const string NullString = "NULL";

        /// <summary>
        /// this method allows generating the output of an empty logbag without actuaslly gebnerating an empty logbag. optimization only
        /// </summary>
        /// <returns></returns>
        protected static string NullOut()
        {
            return "{ }";
        }

        /// <summary>
        /// replace newlines and quotes with parsable equivalents
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        private static string QuotedNL = "\\NL";
        private static string UnquotedNL = Environment.NewLine;
        private static string UnquotedQuote = '"'.ToString();
        private static string QuotedQuote = "\\" + '"';
        public static string Canonize(string s)
        {
            return s.Replace(UnquotedNL, QuotedNL).Replace(UnquotedQuote, QuotedQuote);
        }

        public static string DeCanonize(string s)
        {
            if (s == null)
                return null;
            return s.Replace(QuotedNL, UnquotedNL).Replace(QuotedQuote, UnquotedQuote);
        }

        public struct OrderedBag
        {
            public Enum Key;
            public Type KeyType;
            public object Value;
            public int KeyValue;
        }

        // Used by ToString()
        public int Compare(OrderedBag x, OrderedBag y)
        {
            // If they are the same type then we can compare directly based on the enum integer value
            if (x.KeyType == y.KeyType)
            {
                return x.KeyValue - y.KeyValue;
            }

            // if the first param is BaseLoggable, then make it first
            if (x.KeyType == typeof(BaseLoggable))
            {
                return -1;
            }

            // if the second param is BaseLoggable, then make it first
            if (y.KeyType == typeof(BaseLoggable))
            {
                return 1;
            }

            return string.Compare(x.KeyType.Name, y.KeyType.Name, StringComparison.InvariantCulture);
        }

        /// <summary>
        /// Translate bag to JSON format
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            var bag = this;
            var sb = new StringBuilder();
            sb.Append("{ ");
            var first = true;

            var list = from p in bag
                                           select new OrderedBag() { Key = p.Key, Value = p.Value, KeyType = p.Key.GetType(), KeyValue = (int)Convert.ChangeType(p.Key, typeof(int)) };

            var orderedBy = list.OrderBy(l => l, this);

            foreach (var kvp in orderedBy)
            {
                if (!first)
                {
                    sb.Append(", ");
                }
                var keystr = kvp.Key.ToString();
                sb.Append(keystr);
                sb.Append(':');
                if (kvp.Value == null)
                {
                    sb.Append(NullString);
                }
                else
                {
                    sb.Append('"');
                    sb.Append(Canonize(kvp.Value.ToString()));
                    sb.Append('"');
                }

                first = false;
            }

            if (!first)
            {
                sb.Append(' ');
            }
            sb.Append("}");

            return sb.ToString();
        }

        public static string LogBagToString(LogBag l)
        {
            if (l == null)
            {
                return LogBag.NullOut();
            }
            return l.ToString();
        }

        /// <summary>
        /// Translate bag from log format (which is JSON format + comment text) to a bag and comment pair
        /// </summary>
        /// <param name="logLine"></param>
        /// <param name="bag"></param>
        /// <param name="comment"></param>
        public static void ParseLogLine(string logLine, out Dictionary<string, string> bag, out string comment)
        {
            bag = new Dictionary<string, string>();

            comment = null;
            // This method parses Logger-form log lines into logger format
            if (String.IsNullOrEmpty(logLine))
            {
                throw new Exception("Can't Parse empty");
            }
            if (logLine[0] != '{')
            {
                throw new Exception("Can't Parse empty");
            }
            // parse until a '}' is encountered outside quotes. ignore quoted quotes
            var pos = 1;
            for (; ; )
            {
                pos = EatWhiteSpace(logLine, pos);
                if (logLine[pos] == '}')
                {
                    // reached end
                    comment = logLine.Substring(pos + 2);
                    return;
                }
                var termEnd = AdvanceToChar(logLine, pos, ':', true);
                var term = logLine.Substring(pos, termEnd - pos);
                string termval = null;
                pos = termEnd + 1;
                // check for NULL
                // otherwise expect QUOTE
                if (logLine.Substring(pos, 4).Equals(LogBag.NullString))
                {
                    termval = null;
                    pos = pos + LogBag.NullString.Length;
                }
                else
                {
                    termval = ReadQuotedString(logLine, pos);
                    pos += termval.Length + 2;
                }
                // add to dictionary
                var klo = term;
                bag[klo] = LogBag.DeCanonize(termval);

                // find comma separator
                var newpos = AdvanceToCharBeforeChar(logLine, pos, ',', '}', false);
                if (newpos == -1)
                {
                    // this is checked PRE now, shouldn't run
                    // last one?
                    newpos = AdvanceToChar(logLine, pos, '}', true);
                    // todo skip 1 space?
                    comment = logLine.Substring(newpos + 2);
                    break;
                }
                else
                {
                    pos = newpos + 1;
                }
            }

        }

        public static void ParseLogLine(string logLine, List<Type> enums, out LogBag bag, out string comment)
        {
            bag = new LogBag();
            Dictionary<string, string> dictionary;

            ParseLogLine(logLine, out dictionary, out comment);

            if (enums == null)
            {
                enums = new List<Type>();
                enums.Add(typeof(BaseLoggable));
            }

            foreach (var kvp in dictionary)
            {
                Enum key = null;
                var count = 0;

                foreach (var t in enums)
                {
                    if (Enum.IsDefined(t, kvp.Key))
                    {
                        key = (Enum)Enum.Parse(t, kvp.Key);
                        count++;
                    }
                }

                if (count > 1)
                {
                    throw new Exception("more than one typed matched logline");
                }

                if (key == null || count == 0)
                {
                    throw new ArgumentOutOfRangeException("logLine - no type matched");
                }

                bag[key] = LogBag.DeCanonize(kvp.Value);
            }
        }

        public static bool IsMatchLineAll(string logLine, List<Type> enums, LogBag bag, string contains)
        {
            try
            {
                string s2;
                LogBag bag2; 
                ParseLogLine(logLine, enums, out bag2, out s2);
                if (!s2.Contains(contains))
                {
                    return false;
                }
                if (bag == null)
                {
                    bag = new LogBag();
                }
                return bag.IsMatchAll(bag2);
            }
            catch (Exception e)
            {
                // todo: how do we find errors?
                Debug.WriteLine("Logbag IsMatchLineAll failed due to " + e);
                return false;
            }
        }

        // does the otherbag contains ALL the elements in this bag with the same value
        public bool IsMatchAll(LogBag otherbag)
        {
            foreach (var kvp in this)
            {
                object v;
                otherbag.TryGetValue(kvp.Key, out v);
                if (!CompareAsStrings(v, kvp.Value))
                {
                    return false;
                }
            }

            return true;
        }

        static bool CompareAsStrings(object o1, object o2)
        {
            if (o1 == null && o2 == null)
            {
                return true;
            }
            if (o1 == null || o2 == null)
            {
                return false;
            }

            return (o1.ToString().CompareTo(o2.ToString()) == 0);

        }

        /// <summary>
        /// read a quote-delimited string, obeying quoted-quotes
        /// </summary>
        /// <param name="logLine"></param>
        /// <param name="pos"></param>
        /// <returns></returns>
        private static string ReadQuotedString(string logLine, int pos)
        {
            // TODO cmpstrinpos... use method
            if (logLine[pos] != LogBag.UnquotedQuote[0])
            {
                throw new Exception("Not quoted");
            }
            // keep reading until eol (error), quote end, quoted quote
            // return quoted quote still quoted?
            for (var i = pos + 1; ; i++)
            {
                if (i >= logLine.Length)
                {
                    throw new Exception("EOL reached before ending quote");
                }
                if (logLine[i] == UnquotedQuote[0])
                {
                    // check if quoted
                    // ASSUMES quotting is one char
                    if (logLine[i - 1] == QuotedQuote[0])
                    {
                        // do nothing
                    }
                    else
                        return logLine.Substring(pos + 1, i - pos - 1);
                }
            }

        }

        /// <summary>
        /// find the next occurance of a char in a string
        /// </summary>
        /// <param name="logLine"></param>
        /// <param name="pos"></param>
        /// <param name="p"></param>
        /// <param name="doThrow"></param>
        /// <returns></returns>
        private static int AdvanceToChar(string logLine, int pos, char p, bool doThrow)
        {
            for (var i = pos; i < logLine.Length; i++)
            {
                if (logLine[i] == p)
                    return i;
            }

            if (doThrow)
            {
                throw new Exception("char " + p + " not found");
            }
            else
            {
                return -1;
            }
        }

        private static int AdvanceToCharBeforeChar(string logLine, int pos, char p, char p2, bool doThrow)
        {
            for (var i = pos; i < logLine.Length; i++)
            {
                if (logLine[i] == p)
                {
                    return i;
                }
                if (logLine[i] == p2)
                {
                    if (doThrow)
                    {
                        throw new Exception("char " + p + " not found before " + p2);
                    }
                    else
                    {
                        return -1;
                    }

                }
            }

            if (doThrow)
            {
                throw new Exception("char " + p + " not found before " + p2);
            }
            else
            {
                return -1;
            }
        }

        // find the next occurance of a non-whitepsace in a string
        private static int EatWhiteSpace(string logLine, int pos)
        {
            for (var i = pos; i < logLine.Length; i++)
            {
                if (!Char.IsWhiteSpace(logLine[i]))
                    return i;
            }

            throw new Exception("whitespace not found");
        }
    }
}
