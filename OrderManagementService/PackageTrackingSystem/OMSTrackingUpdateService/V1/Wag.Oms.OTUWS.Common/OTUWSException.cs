using System;

namespace Wag.Oms.OTUWS.Common
{
    public class OTUWSException : Exception
    {
        public string ErrorMessage { get; set; }
        public new Exception InnerException { get; set; }

        public override string ToString()
        {
            return InnerException == null ? ErrorMessage : InnerException.ToString();
        }

        public OTUWSException(Exception ex, string errorMessage)
        {
            ErrorMessage = errorMessage;
            InnerException = ex;
        }
    }
}
