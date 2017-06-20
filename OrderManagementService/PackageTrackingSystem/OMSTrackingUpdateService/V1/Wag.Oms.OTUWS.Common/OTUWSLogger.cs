using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using Microsoft.Practices.EnterpriseLibrary.Logging;

namespace Wag.Oms.OTUWS.Common
{
    public static class OTUWSLogger
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
        /// Write log section title/footer
        /// </summary>
        /// <param name="logCat">log categroy source, defined in loggingConfiguration</param>
        /// <param name="serviceEventId">Service Event id</param>
        /// <param name="type">Trace Event Type</param>
        /// <param name="msg">message in title or footer</param>
        public static void HeaderLog(string logCat, OTUWSEventId serviceEventId, TraceEventType type, string msg)
        {
            var line = string.Format("{0}", msg);
            LogIt(logCat, serviceEventId, type, null, line);
        }

        /// <summary>
        /// Write normal transaction log in the format related with log category soruce
        /// </summary>
        /// <param name="logCategroy">log cateogry source  in config section</param>
        /// <param name="msg">extra message at log section</param>
        public static void TransactionLog(string logCategroy, string msg)
        {
            LogIt(logCategroy, OTUWSEventId.Information, TraceEventType.Information, null, msg);
        }

        /// <summary>
        /// Write exception log in the format related with log category soruce
        /// </summary>
        /// <param name="logCategory">log cateogry source</param>
        /// <param name="e">Exception object  in config section</param>
        /// <param name="msg">extra message</param>
        public static void ExceptionLog(string logCategory, Exception e, string msg)
        {
            LogIt(logCategory, OTUWSEventId.Error, TraceEventType.Error, e, msg);
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
        public static void WindowEventLog(string logCat, OTUWSEventId eventId, TraceEventType traceEventType, Exception ex, string message, bool addWebContext)
        {
            LogIt(logCat, eventId, traceEventType, ex, message);
        }


        /// <summary>
        /// base method to write a log 
        /// </summary>
        /// <param name="logCat">log categroy source in config section</param>
        /// <param name="eventId">Service Event Id</param>
        /// <param name="traceEventType">Trace Event Type</param>
        /// <param name="ex">Excepton object</param>
        /// <param name="message">extra messge</param>
        static internal void LogIt(string logCat, OTUWSEventId eventId, TraceEventType traceEventType, Exception ex, string message)
        {
            try
            {
                var otswsLogEntry = new OTUWSLogEntry();
                otswsLogEntry.EventId = (int)eventId;
                otswsLogEntry.Categories = new string[] { logCat };
                otswsLogEntry.Message = ex == null
                                              ? message
                                              : message + " " + ex;
                otswsLogEntry.TraceEventType = MapSeverityToText[traceEventType];
                otswsLogEntry.LogLevel = (int)MapSeverityToDSLogLevel[traceEventType];
                if (ex != null)
                {
                    otswsLogEntry.StackTrace = GetStackTrace(ex);
                    otswsLogEntry.Exception = ex;
                }
                otswsLogEntry.Severity = traceEventType;

                Logger.Write(otswsLogEntry);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message + e.InnerException);
            }
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


        private static readonly IDictionary<TraceEventType, OTUWSLogLevel> MapSeverityToDSLogLevel
            = new Dictionary<TraceEventType, OTUWSLogLevel>
    		  	{
					{TraceEventType.Verbose, OTUWSLogLevel.Debug},
					{TraceEventType.Information, OTUWSLogLevel.Information},
					{TraceEventType.Warning, OTUWSLogLevel.Warning},
					{TraceEventType.Error, OTUWSLogLevel.Error},
					{TraceEventType.Critical, OTUWSLogLevel.Critical},
					{TraceEventType.Resume, OTUWSLogLevel.Report},
					{TraceEventType.Start, OTUWSLogLevel.Report},
					{TraceEventType.Stop, OTUWSLogLevel.Report},
					{TraceEventType.Suspend, OTUWSLogLevel.Report},
					{TraceEventType.Transfer, OTUWSLogLevel.Report},
    		  	};

        #endregion

        #region //deserialize obj to xml
        /// <summary>
        /// Serialize a type of object to xml string
        /// </summary>
        /// <typeparam name="T">Type of object to be serialized</typeparam>
        /// <param name="obj">Object</param>
        /// <returns>Xml String</returns>
        public static string SerializeObjToXml<T>(T obj)
        {
            var ser = new XmlSerializer(typeof(T));
            var settings = new XmlWriterSettings();
            settings.Encoding = new UnicodeEncoding(false, false); // no BOM in a .NET string
            settings.Indent = true;
            settings.OmitXmlDeclaration = true;

            string xmlString;

            using (var sw = new StringWriter())
            {
                using (var xmlWriter = XmlWriter.Create(sw, settings))
                {
                    ser.Serialize(xmlWriter, obj);
                }
                xmlString = sw.ToString(); //This is the output as a string
            }
            return xmlString;
        }
        #endregion
    }

    /// <summary>
    /// Enum declared for service log level
    /// </summary>
    public enum OTUWSLogLevel
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
    public enum OTUWSEventId
    {
        Debug = 10,
        Report = 20,
        Information = 30,
        Warning = 40,
        Error = 50,
        Critical = 60
    }
}
