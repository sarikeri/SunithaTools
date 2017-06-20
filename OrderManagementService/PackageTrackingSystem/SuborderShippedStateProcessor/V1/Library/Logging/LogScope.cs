using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;


namespace Wag.Oms.SOS.Logging
{
    /// <summary>
    /// LogScope modifies the behavior of the current logging by maintaining a per-thread scope stack of 'which logbag elements should be appended to all logs now'
    /// NOTE: LogScope is designed to be used inside using(var ls = new LogScope(...)) {} ONLY
    /// Failure to use the using keyword (more specifically, failure to call the .dispose on both success and failure paths) may result in incorrect and confusing logging - DON'T
    /// </summary>
    public class LogScope : IDisposable
    {
        [ThreadStatic]
        // scopes maintains the per-thread stack of 'logs'
        // since it is managed per-thread, no locking is needed
        static Stack<LogScope> scopes = null;

        private static Stack<LogScope> GetScopes()
        {
            if (scopes == null)
                scopes = new Stack<LogScope>();

            return scopes;
        }

        /// <summary>
        /// report the depth in the current scopes. most likely for use in debugging logging itself
        /// </summary>
        /// <returns>depth</returns>
        public static int EffectiveScopeDepth()
        {
            return GetScopes().Count();
        }

        /// <summary>
        /// return effective logbag for use in logging
        /// </summary>
        /// <returns>null if no scope, a logbag of what to be added to log otherwise </returns>
        public static LogBag GetLogBagForTopScope()
        {
            if (GetScopes().Count == 0)
            {
                return null;
            }
            return GetScopes().Peek()._effective;
        }

        // generate a logbag from params for use with logging
        public static LogBag LogBagFromParamPairs(params object[] p)
        {
            var lb2 = new LogBag();
            if (p == null)
                return lb2;
            var i = 0;
            try
            {
                if (p.Length % 2 != 0)
                {
                    Logger.LogWithoutTransforms(LogLevel.Error, new LogBag(), "odd number of parameters in log call {0}", p.Length);
                    // but continue to log
                }
                // check even number ERROR log if not
                for (i = 0; i < p.Length / 2; i++)
                {
                    // todo make enum, fail NICELY without exception or if wrong type. cant throw since used in constuctor? or throw + catch?
                    var rval = (Enum)p[i * 2];
                    // todo remove cast to string 
                    var lval = (Object)p[i * 2 + 1];
                    lb2[rval] = lval;
                }
                return lb2;
            }
            catch (Exception e)
            {
                Logger.LogWithoutTransforms(LogLevel.Error, new LogBag().And(BaseLoggable.Exception, e), "error processing log parameters in log call pair position {0}", i);
                // swallow error, logging should not throw
                // log the best you have so far
                return lb2;
            }
        }

        static void PrintLb(LogBag lb2, string lbl, int depth)
        {
            var ind = "";
            for (var i = 0; i < depth; i++) { ind += "   "; }
            Console.WriteLine(ind + lbl + " LB " + lb2.GetHashCode() + " depth " + depth);
            foreach (var el in lb2)
            {
                Console.WriteLine(ind + el.Key + "=" + el.Value);
            }
        }

        /// <summary>
        /// merge the scope logbag with given logbag into a new bag. either can be null
        /// </summary>
        /// <param name="prev"></param>
        /// <param name="cur"></param>
        /// <param name="createNew">true if merge needed, false if only cur should be used</param>
        /// <returns>NEW merged logbag instance</returns>
        public static LogBag Merge(LogBag prev, LogBag cur, bool createNew)
        {
            // TODO: optimize: if either logbag is null/empty, (and possibly on createNew), do not create new logbag
            if (createNew)
            {
                // just duplicate the logbag
                var lb1 = DupLogBagInto(cur, new LogBag());
                return lb1;
            }
            var lb2 = new LogBag();
            lb2 = DupLogBagInto(prev, lb2);
            lb2 = DupLogBagInto(cur, lb2);
            return lb2;
        }

        private static LogBag DupLogBagInto(LogBag cur, LogBag dest)
        {
            if (cur != null)
            {
                foreach (var elem in cur)
                {
                    dest[elem.Key] = elem.Value;
                }
            }
            return dest;
        }

        /// <summary>
        /// Merge given logbag with the current scope
        /// </summary>
        /// <param name="cur"></param>
        /// <returns>merged logbag</returns>
        public static LogBag MergeWithScope(LogBag cur)
        {
            var scopeLog = LogScope.GetLogBagForTopScope();
            var newLog = LogScope.Merge(scopeLog, cur, false);
            return newLog;

        }

        /// <summary>
        ///  to be called before adding this to stack
        /// </summary>
        void SetEffectiveLB()
        {
            if (GetScopes().Count == 0)
            {
                // first!
                this._effective = this._lb;
                return;
            }

            var tip = GetScopes().Peek();
            if (tip == this)
            {
                //error wrong usage
            }

            this._effective = Merge(tip._effective, this._lb, this._isCreateNew);
        }

        LogBag _lb;
        bool _isCreateNew;
        LogBag _effective;
        private Stopwatch sw;

        /// <summary>
        /// Construct a logscope
        /// </summary>
        /// <param name="isCreateNew">should keep appending previous logscope from the stack</param>
        public LogScope(bool isCreateNew, LogBag lb)
        {
            Init(lb, isCreateNew);
        }

        /// <summary>
        /// Construct a logscope
        /// </summary>
        /// <param name="isCreateNew">should keep appending previous logscope from the stack</param>
        /// <param name="p">alternating list of enum, value for the logbag</param>
        public LogScope(bool isCreateNew, params object[] p)
        {
            Init(LogBagFromParamPairs(p), isCreateNew);

        }

        /// <summary>
        /// Initialize the logscope
        /// </summary>
        /// <param name="lb"></param>
        /// <param name="isCreateNew"></param>
        void Init(LogBag lb, bool isCreateNew)
        {

            try
            {
                _lb = lb;
                _isCreateNew = isCreateNew;
                if (GetScopes().Count > 0)
                {
                    // could keep back ptrref
                }
                SetEffectiveLB();
                GetScopes().Push(this);
                sw = new Stopwatch();
                sw.Start();
                Logger.Log(LogLevel.Information, "ctor", BaseLoggable.TypeName, typeof(LogScope), BaseLoggable.MethodName, "Init", LogScopeLoggable.LogDepth, EffectiveScopeDepth());
            }
            catch (Exception e)
            {
                Debug.WriteLine("Failed to init LogScope due to " + e);
            }
        }

        /// <summary>
        /// implements IDisposable
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            // This object will be cleaned up by the Dispose method.
            // Therefore, you should call GC.SupressFinalize to
            // take this object off the finalization queue
            // and prevent finalization code for this object
            // from executing a second time.
            GC.SuppressFinalize(this);
        }

        public enum LogScopeLoggable
        {
            LogScopeInfo = 1000,
            LogDepth,
            ScopeExecutionTime,
        }

        protected virtual void Dispose(bool disposing)
        {
            sw.Stop();
            // Elapsed time: 00:00:04.9028442
            Logger.Log(LogLevel.Information, "Dispose", BaseLoggable.TypeName, typeof(LogScope), BaseLoggable.MethodName, "Dispose", LogScopeLoggable.ScopeExecutionTime, sw.Elapsed, LogScopeLoggable.LogDepth, EffectiveScopeDepth());
            if (!disposing)
            {
                Logger.LogWithoutTransforms(LogLevel.Error, "Disposing LogScope by GC indicates lack of explicit call to dispose (e.g. no using())",
                    LogScopeLoggable.LogScopeInfo, this);
                return;
            }

            if (GetScopes().Count == 0)
            {
                Logger.LogWithoutTransforms(LogLevel.Error, "Cannot dispose LogScope on empty stack",
                    LogScopeLoggable.LogScopeInfo, this);
                return;
            }

            var ls = GetScopes().Peek();
            if (ls != this)
            {
                HandleUnbalancedDispose();
                return;
            }

            GetScopes().Pop();
        }

        /// <summary>
        ///  heuristically clean up the logscope stack if logscope is deleted out of error due to lack of use of dispose
        /// </summary>
        private void HandleUnbalancedDispose()
        {
            if (!GetScopes().Contains(this))
            {
                Logger.LogWithoutTransforms(LogLevel.Error, "Cannot dispose LogScope which is not on stack",
                    LogScopeLoggable.LogScopeInfo, this);
                return;
            }

            var i = 0;
            var ls = GetScopes().Pop();
            for (; GetScopes().Count != 0; ls = GetScopes().Pop(), i++)
            {
                if (ls == this)
                {
                    Logger.LogWithoutTransforms(LogLevel.Error, "Cannot dispose LogScope correctly when not on top of stack, preceding LogScopes eliminated",
                     LogScopeLoggable.LogScopeInfo, this);
                    return;
                }
                else
                {
                    Logger.LogWithoutTransforms(LogLevel.Warning, "Cannot dispose LogScope correctly when not on top of stack, current LogScopes eliminated",
                     LogScopeLoggable.LogScopeInfo, ls);
                }
            }
        }

        /// <summary>
        /// displayable description of LogScope
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return String.Format("LogScope LB:{0} Effective:{1} new {2}", LogBagSummary(this._lb), LogBagSummary(this._effective), this._isCreateNew);
        }

        public string LogBagSummary(LogBag lb)
        {
            var s = "";
            foreach (var kv in lb)
            {
                s += kv.Key + ":" + kv.Value + " ";
            }
            return s;
        }
    }

}
