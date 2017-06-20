using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Collections;
using System.Text.RegularExpressions;

namespace Wag.Oms.EGWS.ValidationAttributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    sealed public class NumericCollectionAttribute : ValidationAttribute
    {
        private const string DefaultErrorMessage = "'{0}' must contain only numbers up to 4 digits.";
        private readonly Regex numberCheckRegex = new Regex(@"^[0-9]{1,4}$");

        public bool AllowNull { get; set; } = false;

        public NumericCollectionAttribute()
            : base(DefaultErrorMessage)
        {
        }

        public override string FormatErrorMessage(string name)
        {
            return string.Format(CultureInfo.CurrentUICulture, ErrorMessageString, name);
        }

        public override bool IsValid(object value)
        {
            var list = value as IList;
            if (list == null)
            {
                return AllowNull;
            }
            foreach (var item in list)
            {
                if (!numberCheckRegex.Match(item.ToString()).Success)
                {
                    return false;
                }
            }

            return true;
        }
    }
}