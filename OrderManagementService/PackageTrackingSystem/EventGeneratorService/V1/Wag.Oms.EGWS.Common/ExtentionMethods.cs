using System;

namespace Wag.Oms.EGWS.Common
{
    public static class ExtensionMethods
    {
        public static string ToMilitaryFormat(this DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffzzz");
        }
    }
}
