using System.Collections;
using System.Collections.Generic;
using System.Reflection;

namespace Wag.Oms.SOS.DAL.Repositories
{
    class Common
    {
        // This method will return the columns names for the class attributes (public properties) which are modified.  
        // The hashtable passed as input should have mappings for the class' attribute names to column names.
        public static List<string> GetModifiedColumns(object a, object b, Hashtable ColMap)
        {
            List<string> cols = new List<string>();

            if (a.GetType() != b.GetType())
                return cols;

            PropertyInfo[] properties = a.GetType().GetProperties();

            foreach (var prop in properties)
            {
                if (prop.GetValue(a) == null && prop.GetValue(b) == null)
                    continue;
                
                if ((prop.GetValue(a) == null && prop.GetValue(b) != null) || 
                    (prop.GetValue(a) != null && prop.GetValue(b) == null) || 
                    (prop.GetValue(a).ToString() != prop.GetValue(b).ToString()))
                {
                    if (ColMap[prop.Name] != null)
                        cols.Add(ColMap[prop.Name].ToString());
                }
            }

            return cols;
        }

    }
}
