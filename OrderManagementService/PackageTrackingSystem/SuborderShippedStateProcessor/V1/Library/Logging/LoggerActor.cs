using System;
using System.Diagnostics;


namespace Wag.Oms.SOS.Logging
{
    /// <summary>
    /// YanivP 2011
    /// This class implements structured logging, to enable structured logging analysis
    /// </summary>
    /// 
    public abstract class LoggerActor
    {
        public bool shouldMemoryLog = false; // log in memory, for UT use
        public bool shouldSkipActorLog = false; // set to true to avoid going to the entlibm for UT use only
        public bool shouldLogDirectAll = false; // log everything to dbgout
        public MemoryLog memoryLog = new MemoryLog();
        public void Log(LogLevel level, LogBag bag, string userMessage, params object[] formatArgs)
        {
            try
            {
                var shouldLog = ShouldLog(level);

                if (!shouldLog && !shouldMemoryLog &! shouldLogDirectAll)
                {
                    // bail early before generating message
                    return;
                }

                var s = GenLogLine(level, bag, userMessage, formatArgs);

                // log to memory first in case the real logger fails
                if (shouldMemoryLog)
                {
                    DoMemoryLog(level, s);
                }

                if (shouldLogDirectAll)
                {
                    Debug.WriteLine(level + " : " + s);
                }
                
                if (shouldLog)
                {
                    if (!shouldSkipActorLog)
                        DoLog(level, s);
                }

            }
            catch (Exception e)
            {
                // this is BAD, logging should not throw. of course, we can't log this error, but we can try..
                DoMemoryLog(LogLevel.Error, "Logging failure cause "+e.Message + " { }");
                Debug.WriteLine("!!! Logging failure !!! : " + e);
            }
        }

        public delegate string AutomaticPropertyDelegate(LogBag bag);
        public void AddAutomaticProperty(LogLevel minLevel, AutomaticPropertyDelegate generatingCallback)
        {
            // TODO
            // TODO: are we allowed to change the logbag or copy on change instead?
        }

        protected void AddAutomaticProperties(LogLevel level, LogBag bag)
        {
            // TODO
        }

        public virtual bool ShouldLog(LogLevel level)
        {
            return true;
        }

        protected virtual void DoMemoryLog(LogLevel level, string msg) {
            memoryLog.AddLog(level, msg);
        }

        protected abstract void DoLog(LogLevel level, string msg) ;
        protected virtual string GenLogLine(LogLevel level, LogBag bag, string userMessage, params object[] formatArgs)
        {
            AddAutomaticProperties(level, bag);
            return LogBag.LogBagToString(bag) + " " + LogBag.Canonize(String.Format(userMessage, formatArgs));
        }

    }
}
