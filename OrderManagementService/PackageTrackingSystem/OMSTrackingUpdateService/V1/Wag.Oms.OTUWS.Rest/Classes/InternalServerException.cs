using System;

namespace Wag.Oms.OTUWS.Classes
{
    public class InternalServerException : Exception
    {
        public string ErrorMessage { get; set; }
        public new Exception InnerException { get; set; }

        public InternalServerException(string error)
        {
            ErrorMessage = error;
        }

        public override string ToString()
        {
            return InnerException == null ? ErrorMessage : InnerException.ToString();
        }
    }
}