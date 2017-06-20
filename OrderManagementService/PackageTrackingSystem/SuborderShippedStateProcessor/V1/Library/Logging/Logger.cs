using System;
using System.IO;
using Wag.Oms.SOS.Logging.EntLib;
using System.Diagnostics;
using System.Reflection;

/*
 * Structured Logging  
 * YanivP 2011
 * 
 * This module enables logging a NAMED properties in a format which can reliablly be parsed out
 * This allows unification of logging format, and allows automatic analysis of logged information
 * 
 * Data is logged in JSON-compatible format, allowing a trailing freeform comment 
 * */
namespace Wag.Oms.SOS.Logging
{
    /// <summary>
    ///  singleton static logger for convenience
    /// </summary>
    static public class Logger
    {
        static LoggerActor actor;
        private const string SloggerShouldDie = "SLoggerShouldDie";
        private const string SloggerNameEnvironmentVariable = "SLoggerName";
        private const string SloggerName = "Drugstore";
        private const string DefaultLoggerName = "Wag.Oms.SOS.Logging.dll.config";

        public static LoggerActor getActor()
        {
            return actor;
        }

        /// <summary>
        /// Initialize logger based on app.config or env variable
        /// </summary>
        static Logger()
        {
            bool initOk;
            string sloggerName = Environment.GetEnvironmentVariable(SloggerNameEnvironmentVariable);
            // string sloggerName = SloggerName;
            string configFilename = string.Empty;

            if (string.IsNullOrEmpty(sloggerName)) sloggerName = DefaultLoggerName;

            // Check ifLoggerName exists, if it doesn't then just use appConfig
            if (string.IsNullOrEmpty(sloggerName))
            {
                initOk = Init(null);
            }
            else
            {
                /// Search Order:
                /// 1. CWD
                /// 2. EXE path
                /// 3. appConfig

                //configFilename = sloggerName + ".Logging.Config";
                configFilename = sloggerName;
                string assemblyPath = new Uri(Assembly.GetExecutingAssembly().CodeBase).AbsolutePath;
                configFilename = Path.Combine(Path.GetDirectoryName(assemblyPath), configFilename);
                initOk = Init(configFilename);
                if (!initOk)
                {

                    string currentAssemblyDirectoryName = new Uri(Assembly.GetExecutingAssembly().CodeBase).AbsolutePath;
                    configFilename = Path.Combine(Path.GetDirectoryName(currentAssemblyDirectoryName), configFilename);
                    initOk = Init(configFilename);
                }

                if (!initOk)
                {
                    initOk = Init(null);
                }
            }
            // if !InitOK, logging has failed, possibly the app should be forcibly terminated
            if (!initOk)
            {
                bool shouldDie = String.IsNullOrEmpty(Environment.GetEnvironmentVariable(SloggerShouldDie));
                string s = (shouldDie ? "APP TERMINATING: " : "APP LOG FAILURE :")
                    + "Cannot start due to logging config issue : logfile config expected [" + configFilename + "]LoggerName env variable is " + sloggerName;
                TryLogToEventLog(s, 1001);

                if (shouldDie)
                {
                    throw new Exception(s);
                }
                else
                {
                    actor = new DebugLoggerActor();
                }
            }
        }

        private static bool TryLogToEventLog(string s, int evId)
        {
            try
            {
                const string sSource = "X2 SDK";
                const string sLog = "Application";
                var sEvent = s;
                Debug.WriteLine(s + " EventId " + evId);
                if (!EventLog.SourceExists(sSource))
                    EventLog.CreateEventSource(sSource, sLog);
                EventLog.WriteEntry(sSource, sEvent, EventLogEntryType.Error, evId);

                return true;
            }
            catch (Exception)
            {
                Debug.WriteLine("Cannot write to eventlog : " + s);
                return false;
            }

        }

        private static bool Init(string fullPath)
        {
            try
            {
                actor = string.IsNullOrEmpty(fullPath) ? new EntLibLoggerActor() : new EntLibLoggerActor(fullPath);
                return true;
            }
            catch (Exception e)
            {
                actor = new DebugLoggerActor();
                LogWithoutTransforms(LogLevel.Critical, LogBag.CreateExceptionBag(e), "Cannot instantiate EntLibLoggerActor with file=[{0}]", fullPath);
                return false;
            }
        }

        /// <summary>
        /// log using the actor after making any generic logbag transform
        /// currently, LogScope transforms are executed
        /// ExceptionContract: should not throw
        /// </summary>
        /// <param name="level"></param>
        /// <param name="bag"></param>
        /// <param name="userMessage"></param>
        /// <param name="formatArgs"></param>
        static private void logWithTransforms(LogLevel level, LogBag bag, string userMessage, params object[] formatArgs)
        {
            var scopeBag = LogScope.MergeWithScope(bag);
            actor.Log(level, scopeBag, userMessage, formatArgs);
        }


        /// <summary>
        /// Logs a usermessage with a given level
        /// </summary>
        /// <example>
        /// var logBag = new LogBag();
        /// logBag.Add(BaseLoggable.AppName, "v1");
        /// logBag.Add(BaseLoggable.Callstack, "v1");
        /// OR
        /// var logBag = new LogBag().AddSingleValue(BaseLoggable.AppName, "v1").AddSingleValue(BaseLoggable.Callstack, "v1"); 
        /// 
        /// // AVOID passing strings via the formatArgs
        /// Logger.Log(LogLevel.Debug, logBag, "Debug:userMessage:{0}", "p0");
        /// </example>
        /// <param name="level"></param>
        /// <param name="bag"></param>
        /// <param name="userMessage"></param>
        /// <param name="formatArgs"></param>
        public static void Log(LogLevel level, LogBag bag, string userMessage, params object[] formatArgs)
        {
            logWithTransforms(level, bag, userMessage, formatArgs);
        }

        /// <summary>
        /// Logs a usermessage with a given level, WITHOUT a transform. for use only from within logging code
        /// </summary>
        /// <param name="level"></param>
        /// <param name="bag"></param>
        /// <param name="userMessage"></param>
        /// <param name="formatArgs"></param>
        internal static void LogWithoutTransforms(LogLevel level, LogBag bag, string userMessage, params object[] formatArgs)
        {
            actor.Log(level, bag, userMessage, formatArgs);
        }



        /// <summary>
        /// Log messages with a given message and an alternating pair of Loggable, value, Loggable, Value 
        /// WITHOUT a transform. for use only from within logging code
        /// e.g. var Log(LogLevel.Debug, "logging this", BaseLoggable.AppName, "v1", BaseLoggable.Callstack, "v2"); 
        /// </summary>
        /// <param name="level">Log level</param>
        /// <param name="userMessage">Message</param>
        /// <param name="logBagPairs">alternating pair of (enum, object) to log</param>
        internal static void LogWithoutTransforms(LogLevel level, string userMessage, params object[] logBagPairs)
        {
            var bag = LogScope.LogBagFromParamPairs(logBagPairs);
            LogWithoutTransforms(level, bag, userMessage);
        }


        /// <summary>
        /// Log messages with a given message and an alternating pair of Loggable, value, Loggable, Value
        /// e.g. var Log(LogLevel.Debug, "logging this", BaseLoggable.AppName, "v1", BaseLoggable.Callstack, "v2"); 
        /// </summary>
        /// <param name="level">Log level</param>
        /// <param name="userMessage">Message</param>
        /// <param name="logBagPairs">alternating pair of (enum, object) to log</param>
        public static void Log(LogLevel level, string userMessage, params object[] logBagPairs)
        {
            var bag = LogScope.LogBagFromParamPairs(logBagPairs);
            Log(level, bag, userMessage);
        }

        /// <summary>
        /// Delays the construction of the bag (put the message into
        ///   Loggable.MSG) until we know for certain that the LogLevel is high
        ///   enough that it will be seen by at least one listener.
        /// </summary>
        /// <param name="level"></param>
        /// <param name="bagAndMessage"></param>
        public static void Log(LogLevel level, Func<LogBag> bagAndMessage)
        {
            if (!actor.ShouldLog(level))
                return;
            var bag = bagAndMessage();
            // We need to pull the message out as well, because there is
            //   nothing in the contract that says that the actor must handle
            //   Loggable.MSG and the message argument identically.
            var message = (bag.ContainsKey(BaseLoggable.Msg))
                ? bag[BaseLoggable.Msg] as string
                : string.Empty;
            logWithTransforms(level, bag, message);
        }

        /// <summary>
        /// Logs a usermessage with a given level and throws
        /// For use with new exceptions only. Because you will lose the original stack trace.
        /// The alternative is Log() with "logBag[BaseLoggable.Exception] = e;" and then throw;
        /// </summary>
        /// <example>
        /// var logBag = new LogBag();
        /// logBag.Add(BaseLoggable.AppName, "v1");
        /// logBag.Add(BaseLoggable.Callstack, "v1");
        /// OR
        /// var logBag = new LogBag().AddSingleValue(BaseLoggable.AppName, "v1").AddSingleValue(BaseLoggable.Callstack, "v1"); 
        ///
        /// // AVOID passing strings via the formatArgs
        /// Logger.Log(new Exception(), LogLevel.Debug, logBag, "Debug:userMessage:{0}", "p0");
        /// </example>
        /// <param name="e"></param>
        /// <param name="level"></param>
        /// <param name="bag"></param>
        /// <param name="userMessage"></param>
        /// <param name="formatArgs"></param>
        public static void LogAndThrow(Exception e, LogLevel level, LogBag bag, string userMessage, params object[] formatArgs)
        {
            if (bag == null)
            {
                bag = LogBag.CreateExceptionBag(e);
            }
            else
            {
                bag[BaseLoggable.Exception] = e;
            }
            Log(level, bag, userMessage, formatArgs);
            throw e;
        }
    }
}