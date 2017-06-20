using System;

namespace Wag.Oms.EGWS.Common
{
    public static class Helper
    {
        public static void LogAndThrowLibraryException(Exception ex, string message)
        {
            LogLibraryException(ex, message);
            throw new EGWSException(ex, message);
        }

        public static void LogLibraryException(Exception ex, string message)
        {
            EGWSLogger.ExceptionLog(Constants.EGWS_LIBRARY_EXCEPTION, ex, message);
        }
    }
}
