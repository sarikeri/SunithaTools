using System;
using System.Collections.Generic;
using System.Linq;

namespace Wag.Oms.SOS.Logging
{
    public class MemoryLog
    {
        private object memoryLogLock = new object();
        
        public int MaxLogEntries = 100;
        
        public List<KeyValuePair<DateTime, String>> innerLog = new List<KeyValuePair<DateTime, string>>();

        public void AddLog(LogLevel level, string msg)
        {
            lock (memoryLogLock)
            {
                if (innerLog.Count() >= MaxLogEntries)
                {
                    innerLog.RemoveAt(0);
                }
                innerLog.Add(new KeyValuePair<DateTime, String>(DateTime.Now, msg));
            }
        }

        /// <summary>
        /// Finds if a log contains the string and in the logbag
        /// </summary>
        /// <param name="enums"></param>
        /// <param name="bag"></param>
        /// <param name="contains"></param>
        /// <returns></returns>
        public List<KeyValuePair<DateTime, String>> Match(List<Type> enums, LogBag bag, string contains)
        {
            return innerLog.Where(l => LogBag.IsMatchLineAll(l.Value, enums, bag, contains)).ToList();
        }
    }
}
