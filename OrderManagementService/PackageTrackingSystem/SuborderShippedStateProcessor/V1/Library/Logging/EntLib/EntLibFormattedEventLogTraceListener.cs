using System.Diagnostics;
using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.Logging;
using Microsoft.Practices.EnterpriseLibrary.Logging.Configuration;
using Microsoft.Practices.EnterpriseLibrary.Logging.TraceListeners;

namespace Wag.Oms.SOS.Logging.EntLib
{
    /// <summary>
    /// Custom event listener to log events to the event Log
    /// </summary>
    [ConfigurationElementType(typeof(CustomTraceListenerData))]
    public class EntLibFormattedEventLogTraceListener : CustomTraceListener
    {
        /// <summary>
        /// Listener to log events to the event log
        /// </summary>
        private readonly TraceListener innerListener;

        /// <summary>
        /// Initializes the inner EventLogTraceListener
        /// </summary>
        public EntLibFormattedEventLogTraceListener()
        {
            // The current process name is used as the event source
            var p = Process.GetCurrentProcess();
            innerListener = new EventLogTraceListener(new EventLog("", ".", p.ProcessName));
        }

        /// <summary>
        /// Forwards the trace request to the inner listener.
        /// </summary>
        /// <param name="eventCache">The context information.</param>
        /// <param name="source">The trace source.</param>
        /// <param name="severity">The severity.</param>
        /// <param name="id">The event id.</param>
        /// <param name="data">The objects to trace.</param>
        public override void TraceData(TraceEventCache eventCache, string source, TraceEventType severity, int id, object data)
        {
            if (Formatter != null)
            {
                var output = Formatter.Format(data as LogEntry);
                this.innerListener.TraceData(eventCache, source, severity, id, output);
            }
            else
            {
                this.innerListener.TraceData(eventCache, source, severity, id, data);
            }
        }

        /// <summary>
        /// Not used
        /// </summary>
        /// <param name="message"></param>
        public override void Write(string message)
        {
        }

        /// <summary>
        /// Not used
        /// </summary>
        /// <param name="message"></param>
        public override void WriteLine(string message)
        {
        }
    }
}
