using System;
using Microsoft.Practices.EnterpriseLibrary.Logging;

namespace Wag.Oms.OTUWS.Classes
{
    public class ServiceLogEntry : LogEntry
    {
        /// <summary>
        /// Gets or sets the stack trace.
        /// </summary>
        /// <value>The stack trace.</value>
        public string StackTrace { get; set; }

        /// <summary>
        /// Gets or sets the type of the trace event.
        /// </summary>
        /// <value>The type of the trace event.</value>
        public string TraceEventType { get; set; }

        /// <summary>
        /// Gets or sets the Drugstore log level.
        /// </summary>
        /// <value>Customized service log level.</value>
        public int LogLevel { get; set; }

        /// <summary>
        /// Gets or sets the exception.
        /// </summary>
        /// <value>The exception.</value>
        public Exception Exception { get; set; }
    }
}