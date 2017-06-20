using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using Wag.Oms.SOS.Logging;

namespace Wag.Oms.SOS.Common
{
    public static class Utility
    {
        public static string Serialize(object seralizeObject)
        {
            var serializer = new XmlSerializer(seralizeObject.GetType());
            var xml = new XmlDocument();
            using (var stream = new MemoryStream())
            {
                serializer.Serialize(stream, seralizeObject);
                stream.Position = 0;
                xml.Load(stream);
            }

            return xml.InnerXml;
        }

        public static List<T> Clone<T>(this List<T> listToClone) where T : ICloneable
        {
            return listToClone.Select(item => (T)item.Clone()).ToList();
        }

        //Log the payload request/response - Serialized info
        public static void LogOrderInfo(string dataToBeLogged, string logHeader)
        {
            var logEnabled = ConfigurationManager.AppSettings.Get("SuborderShippedStateProcessorServiceReqResp_LogEnabled");

            if (string.IsNullOrEmpty(logEnabled) || logEnabled != "1") return;
            var logFilenamePrefix = ConfigurationManager.AppSettings.Get("SuborderShippedStateProcessorServiceReqResp_LogFilename");

            if (string.IsNullOrEmpty(logFilenamePrefix))
                return;

            try
            {
                // Get the correct filename based on the date.
                var currentLogFile = string.Format(logFilenamePrefix, DateTime.Now.Date.ToString("MM-dd-yyyy"));

                // Create the file out stream and write the bytes into it.
                using (var outFileStream = new FileStream(currentLogFile, FileMode.Append, FileAccess.Write, FileShare.None))
                {
                    var s = string.Format("\r\n======================================= {0} : Timestamp {1}  ============================================\r\n", logHeader, DateTime.Now);
// ReSharper disable AccessToStaticMemberViaDerivedType
                    var timeStampBytes = ASCIIEncoding.ASCII.GetBytes(s);
// ReSharper restore AccessToStaticMemberViaDerivedType
// ReSharper disable AccessToStaticMemberViaDerivedType
                    var messageBytes = ASCIIEncoding.ASCII.GetBytes(FormatXml(dataToBeLogged) + "\r\n");
// ReSharper restore AccessToStaticMemberViaDerivedType

                    outFileStream.Write(timeStampBytes, 0, timeStampBytes.Length);
                    outFileStream.Write(messageBytes, 0, messageBytes.Length);
                }
            }
            catch (Exception ex)
            {
                LogError(System.Reflection.MethodBase.GetCurrentMethod(), string.Format("Failed logging payload info. File: {0}. Error: {1}", logFilenamePrefix, ex.Message));
            }
        }

        public static void LogRequestResponse(object data, string logHeader, string logEnabled)
        {
            //var logEnabled = ConfigurationManager.AppSettings.Get("SuborderShippedStateProcessorServiceReqResp_LogEnabled");
            

            if ((string.IsNullOrEmpty(logEnabled) || logEnabled != "1") && data != null ) return;
            var logFilenamePrefix = ConfigurationManager.AppSettings.Get("SuborderShippedStateProcessorServiceReqResp_LogFilename");
            string dataToBeLogged = Serialize(data);

            if (string.IsNullOrEmpty(logFilenamePrefix))
                return;

            try
            {
                // Get the correct filename based on the date.
                var currentLogFile = string.Format(logFilenamePrefix, DateTime.Now.Date.ToString("MM-dd-yyyy"));

                // Create the file out stream and write the bytes into it.
                using (var outFileStream = new FileStream(currentLogFile, FileMode.Append, FileAccess.Write, FileShare.None))
                {
                    var s = string.Format("\r\n======================================= {0} : Timestamp {1}  ============================================\r\n", logHeader, DateTime.Now);
                    // ReSharper disable AccessToStaticMemberViaDerivedType
                    var timeStampBytes = ASCIIEncoding.ASCII.GetBytes(s);
                    // ReSharper restore AccessToStaticMemberViaDerivedType
                    // ReSharper disable AccessToStaticMemberViaDerivedType
                    var messageBytes = ASCIIEncoding.ASCII.GetBytes(FormatXml(dataToBeLogged) + "\r\n");
                    // ReSharper restore AccessToStaticMemberViaDerivedType

                    outFileStream.Write(timeStampBytes, 0, timeStampBytes.Length);
                    outFileStream.Write(messageBytes, 0, messageBytes.Length);
                }
            }
            catch (Exception ex)
            {
                LogError(System.Reflection.MethodBase.GetCurrentMethod(), string.Format("Failed logging payload info. File: {0}. Error: {1}", logFilenamePrefix, ex.Message));
            }
        }

        //Add indents & newlines to xml - for better readability
        static public string FormatXml(string xmlContent)
        {
            try
            {
                var doc = new XmlDocument();
                doc.LoadXml(xmlContent);

                var sb = new StringBuilder();
                var settings = new XmlWriterSettings
                {
                    Indent = true,
                    IndentChars = "  ",
                    NewLineChars = "\r\n",
                    NewLineHandling = NewLineHandling.Replace
                };
                using (var writer = XmlWriter.Create(sb, settings))
                {
                    doc.Save(writer);
                }
                return sb.ToString();
            }
            catch
            { }

            //return the original xml if formatting failed
            return xmlContent;
        }

        //Log Class, Method, Error, EntityIdentifier (optional) info
        public static void LogError(System.Reflection.MethodBase method, string errorMessage, string strEntityIdentifier = "")
        {
// ReSharper disable RedundantAssignment
            var logEntry = string.Empty;
// ReSharper restore RedundantAssignment

// ReSharper disable PossibleNullReferenceException
            logEntry = string.IsNullOrEmpty(strEntityIdentifier) ? string.Format("Exception in Class: {0} ... Method: {1} ... Error: {2}", method.ReflectedType.FullName, method.Name, errorMessage) : string.Format("Exception in Class: {0} ... Method: {1} ... EntityIdentifier: [ {2} ] ... Error: {3}", method.ReflectedType.FullName, method.Name, strEntityIdentifier, errorMessage);
// ReSharper restore PossibleNullReferenceException
// ReSharper restore PossibleNullReferenceException

            Logger.Log(LogLevel.Error, new LogBag(), logEntry);
        }

        public static decimal Round(decimal? amount)
        {
            return amount == null ? 0 : Math.Round((decimal)amount, 2, MidpointRounding.AwayFromZero);
        }
    }
}
