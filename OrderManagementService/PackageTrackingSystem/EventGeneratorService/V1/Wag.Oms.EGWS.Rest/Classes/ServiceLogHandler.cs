using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web;
using Microsoft.Practices.EnterpriseLibrary.Logging;

namespace Wag.Oms.EGWS.Classes
{
    public static class ServiceLogHandler
    {
        #region logging handler
        /// <summary>
        /// Get stack trace from an exception
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        static private string GetStackTrace(Exception ex)
        {
            string trace = string.Empty;

            for (int i = 1; i < 4; i++)
            {
                if (ex == null)
                    break;

                trace += Environment.NewLine + "Exception" + i + ": ";
                trace += ex.Message + Environment.NewLine + ex.StackTrace;
                ex = ex.InnerException;
            }

            return trace;
        }

        /// <summary>
        /// add web context parameter to service log entry object
        /// </summary>
        /// <param name="srvLogEntry"></param>
        static private void AddWebContext(ServiceLogEntry srvLogEntry)
        {
            HttpContext webContext = HttpContext.Current;
            if (webContext == null)
                return;

            srvLogEntry.ExtendedProperties["Url"] = webContext.Request.Url;
            srvLogEntry.ExtendedProperties["HttpMethod"] = webContext.Request.HttpMethod;
            srvLogEntry.ExtendedProperties["Params"] = webContext.Request.Params.ToString();
            if (webContext.Request.UserAgent != null)
                srvLogEntry.ExtendedProperties["UserAgent"] = webContext.Request.UserAgent;
            srvLogEntry.ExtendedProperties["UserHostAddress"] = webContext.Request.UserHostAddress;
            srvLogEntry.ExtendedProperties["PathInfo"] = Convert.ToString(webContext.Request.ServerVariables["PATH_INFO"]);
            srvLogEntry.ExtendedProperties["QueryString"] = Convert.ToString(webContext.Request.ServerVariables["QUERY_STRING"]);
        }

        /// <summary>
        /// Write log section title/footer
        /// </summary>
        /// <param name="logCat">log categroy source, defined in loggingConfiguration</param>
        /// <param name="serviceEventId">Service Event id</param>
        /// <param name="type">Trace Event Type</param>
        /// <param name="msg">message in title or footer</param>
        /// <param name="isTitle">is title if yes, otherwise is footer</param>
        public static void HeaderLog(string logCat, ServiceEventId serviceEventId, TraceEventType type, string msg, bool isTitle)
        {
            string line;
            if (isTitle)
            {
                line = string.Format("----- {0} -----",
                                     msg);
                LogIt(logCat, serviceEventId, type, null, line, true);
            }
            else
            {
                line = string.Format("----- {0} -----", msg);
                LogIt(logCat, ServiceEventId.Information, TraceEventType.Information, null, line, false);
            }
        }

        /// <summary>
        /// Write normal transaction log in the format related with log category soruce
        /// </summary>
        /// <param name="logCategroy">log cateogry source  in config section</param>
        /// <param name="msg">extra message at log section</param>
        public static void TransactionLog(string logCategroy, string msg)
        {
            LogIt(logCategroy, ServiceEventId.Information, TraceEventType.Information, null, msg, false);
        }

        /// <summary>
        /// Write exception log in the format related with log category soruce
        /// </summary>
        /// <param name="logCategory">log cateogry source</param>
        /// <param name="e">Exception object  in config section</param>
        /// <param name="msg">extra message</param>
        public static void ExceptionLog(string logCategory, Exception e, string msg)
        {
            LogIt(logCategory, ServiceEventId.Error, TraceEventType.Error, e, msg, false);
        }

        /// <summary>
        /// Write information/exception to windown event in the format related with log category soruce
        /// To make sure the method works, create necessary 'Source' in "Application" window log
        /// </summary>
        /// <param name="logCat">log categroy source in config section</param>
        /// <param name="eventId">Service Event Id</param>
        /// <param name="traceEventType">Trace Event Type</param>
        /// <param name="ex">Excepton object</param>
        /// <param name="message">extra messge</param>
        /// <param name="addWebContext">if yes, add the extended properties in log file </param>
        public static void WindowEventLog(string logCat, ServiceEventId eventId, TraceEventType traceEventType, Exception ex, string message, bool addWebContext)
        {
            LogIt(logCat, eventId, traceEventType, ex, message, addWebContext);
        }

        /// <summary>
        /// base method to write a log 
        /// </summary>
        /// <param name="logCat">log categroy source in config section</param>
        /// <param name="eventId">Service Event Id</param>
        /// <param name="traceEventType">Trace Event Type</param>
        /// <param name="ex">Excepton object</param>
        /// <param name="message">extra messge</param>
        /// <param name="addWebContext">if yes, add the extended properties in log file</param>
        static internal void LogIt(string logCat, ServiceEventId eventId, TraceEventType traceEventType, Exception ex, string message, bool addWebContext)
        {
            var serviceLogEntry = new ServiceLogEntry();
            serviceLogEntry.EventId = (int)eventId;
            serviceLogEntry.Categories = new string[] { logCat };
            serviceLogEntry.Message = ex == null
                                          ? message
                                          : ex.ToString();
            serviceLogEntry.TraceEventType = MapSeverityToText[traceEventType];
            serviceLogEntry.LogLevel = (int)MapSeverityToDSLogLevel[traceEventType];
            if (ex != null)
            {
                serviceLogEntry.StackTrace = GetStackTrace(ex);
                serviceLogEntry.Exception = ex;
            }
            serviceLogEntry.Severity = traceEventType;


            if (addWebContext)
                AddWebContext(serviceLogEntry);
            Logger.Write(serviceLogEntry);
        }

        #endregion

        #region Static Maps
        /// <summary>
        /// Maps Trace Event Type Severity to Event Id.
        /// </summary>
        private static readonly IDictionary<TraceEventType, string> MapSeverityToText
            = new Dictionary<TraceEventType, string>
    		  	{
					{TraceEventType.Verbose, "V"},
					{TraceEventType.Information, "I"},
					{TraceEventType.Warning, "W"},
					{TraceEventType.Error, "E"},
					{TraceEventType.Critical, "C"},
					{TraceEventType.Resume, "R"},
					{TraceEventType.Start, "S"},
					{TraceEventType.Stop, "F"}, //Finish
					{TraceEventType.Suspend, "P"}, //Pause
					{TraceEventType.Transfer, "T"},
    		  	};


        private static readonly IDictionary<TraceEventType, ServiceLogLevel> MapSeverityToDSLogLevel
            = new Dictionary<TraceEventType, ServiceLogLevel>
    		  	{
					{TraceEventType.Verbose, ServiceLogLevel.Debug},
					{TraceEventType.Information, ServiceLogLevel.Information},
					{TraceEventType.Warning, ServiceLogLevel.Warning},
					{TraceEventType.Error, ServiceLogLevel.Error},
					{TraceEventType.Critical, ServiceLogLevel.Critical},
					{TraceEventType.Resume, ServiceLogLevel.Report},
					{TraceEventType.Start, ServiceLogLevel.Report},
					{TraceEventType.Stop, ServiceLogLevel.Report},
					{TraceEventType.Suspend, ServiceLogLevel.Report},
					{TraceEventType.Transfer, ServiceLogLevel.Report},
    		  	};

        #endregion
    }

    /// <summary>
    /// Enum declared for service log level
    /// </summary>
    public enum ServiceLogLevel
    {
        Debug = 10,
        Report = 20,
        Information = 30,
        Warning = 40,
        Error = 50,
        Critical = 60
    }

    /// <summary>
    /// define the service event id
    /// </summary>
    public enum ServiceEventId
    {
        Debug = 10,
        Report = 20,
        Information = 30,
        Warning = 40,
        Error = 50,
        Critical = 60
    }
}