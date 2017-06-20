using System;

namespace Wag.Oms.OTUWS.Common
{
    public static class ExtensionMethods
    {
        public static string ToMilitaryFormat(this DateTime? dateTime)
        {
            return dateTime.HasValue ? dateTime.Value.ToMilitaryFormat() : null;
        }

        public static string ToMilitaryFormat(this DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffzzz");
        }
    }
}
