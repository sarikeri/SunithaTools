using System;

namespace Wag.Oms.OTUWS.Common
{
    public static class Helper
    {
        public static void LogAndThrowLibraryException(Exception ex, string message)
        {
            LogLibraryException(ex, message);
            throw new OTUWSException(ex, message);
        }

        public static void LogLibraryException(Exception ex, string message)
        {
            OTUWSLogger.ExceptionLog(Constants.OTUWS_LIBRARY_EXCEPTION, ex, message);
        }
    }
}
