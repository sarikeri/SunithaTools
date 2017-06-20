using System;

namespace Wag.Oms.EGWS.Common
{
    public class EGWSException : Exception
    {
        public string ErrorMessage { get; set; }
        public new Exception InnerException { get; set; }

        public override string ToString()
        {
            return InnerException == null ? ErrorMessage : InnerException.ToString();
        }

        public EGWSException(Exception ex, string errorMessage)
        {
            ErrorMessage = errorMessage;
            InnerException = ex;
        }
    }
}
