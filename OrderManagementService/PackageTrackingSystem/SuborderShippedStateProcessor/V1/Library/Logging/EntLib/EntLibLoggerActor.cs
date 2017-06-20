using System;
using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.Logging;

namespace Wag.Oms.SOS.Logging.EntLib
{
    public class EntLibLoggerActor : LoggerActor
    {
        private LogWriter _underlyingLog;
        private IConfigurationSource _configSource;
        private LogWriterFactory _logWriterFactory;
        private Dictionary<LogLevel, LogEntry> _defaultEntries = new Dictionary<LogLevel, LogEntry>();

        public EntLibLoggerActor()
        {
            foreach (LogLevel logLevel in Enum.GetValues(typeof(LogLevel)))
            {
                _defaultEntries.Add(logLevel, new LogEntry() { Categories = new[] { logLevel.ToString() }, Priority = (int)logLevel });
            }
            _underlyingLog = EnterpriseLibraryContainer.Current.GetInstance<LogWriter>();
        }

        public EntLibLoggerActor(string configPath)
        {
            foreach (LogLevel logLevel in Enum.GetValues(typeof(LogLevel)))
            {
                _defaultEntries.Add(logLevel, new LogEntry() { Categories = new[] { logLevel.ToString() }, Priority = (int)logLevel });
            }

            Intialize(configPath);
        }

        private void Intialize(string configPath)
        {
            _configSource = new FileConfigurationSource(configPath);
            _configSource.AddSectionChangeHandler("loggingConfiguration",
                                                  (sender, e) => Debug.WriteLine("Something changed for " + e.SectionName));

            _logWriterFactory = new LogWriterFactory(_configSource);
            _underlyingLog = _logWriterFactory.Create();
        }

        protected override void DoLog(LogLevel level, string msg)
        {
            var logEntry = new LogEntry
                               {
                                   Categories = new[] { level.ToString() },
                                   Message = msg,
                                   Priority = Convert.ToInt32(level),
                                   Severity = GetSeverityLevel(level)
                               };

            logEntry.ExtendedProperties.Add("LogLevel", level.ToString());

            AddStackTrace(logEntry);

            _underlyingLog.Write(logEntry);
        }

        private void AddStackTrace(LogEntry logEntry)
        {
            try
            {
                var stackTrace = new StackTrace(2);
                var frames = stackTrace.GetFrames();

                if (frames != null)
                {
                    foreach (var stackFrame in frames)
                    {
                        var declaringType = stackFrame.GetMethod().DeclaringType;
                        var fullName = declaringType.FullName;

                        if (fullName != null && !fullName.Contains("Drugstore.Sdk.Logging"))
                        {
                            logEntry.ExtendedProperties.Add("FileName", stackFrame.GetFileName() ?? string.Empty);
                            logEntry.ExtendedProperties.Add("FileLineNumber", stackFrame.GetFileLineNumber());
                            logEntry.ExtendedProperties.Add("Type", stackFrame.GetMethod().DeclaringType);
                            logEntry.ExtendedProperties.Add("Method", stackFrame.GetMethod().Name);

                            return;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine("Unable to get StackTrace for EntLibLoggerActor EXCEPTION:" + e);
            }
        }

        public override bool ShouldLog(LogLevel level)
        {
            return _underlyingLog.ShouldLog(_defaultEntries[level]);
        }

        private TraceEventType GetSeverityLevel(LogLevel level)
        {
            TraceEventType traceEventType;
            switch (level)
            {
                case LogLevel.Information:
                case LogLevel.Debug:
                    traceEventType = TraceEventType.Information;
                    break;
                case LogLevel.Verbose:
                    traceEventType = TraceEventType.Verbose;
                    break;
                case LogLevel.Warning:
                    traceEventType = TraceEventType.Warning;
                    break;
                case LogLevel.Critical:
                    traceEventType = TraceEventType.Critical;
                    break;
                default:
                    traceEventType = TraceEventType.Error;
                    break;
            }

            return traceEventType;
        }
    }
}