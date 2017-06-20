using System;
using System.Data;
using System.IO;
using System.Reflection;
using System.Collections.Generic;

namespace Wag.Oms.SOS.DAL.XmlRepositories
{
    public class Common
    {
        public static string GetXmlFilePath(string fileName)
        {
            string assemblyPath = new Uri(Assembly.GetExecutingAssembly().CodeBase).AbsolutePath;

            return Path.GetDirectoryName(assemblyPath) + @"\XMLs\" + fileName;
        }

        public static DataSet GetDataSet(string tableName)
        {
            string xmlFilePath = GetXmlFilePath(tableName.ToLower() + ".xml");

            DataSet ds = new DataSet();
            ds.ReadXml(xmlFilePath);

            return ds;
        }

        public static T GetValue<T>(System.Data.IDataReader dr, int index)
        {
            return (T)StringConversion[typeof(T)](dr, index);
        }

        public static readonly Dictionary<Type, Func<IDataReader, int, object>> StringConversion =
         new Dictionary<Type, Func<IDataReader, int, object>>
            {
                { typeof (long), (dr, i) => Convert.ToInt64(dr[i]) },
                { typeof (short), (dr, i) => Convert.ToInt16(dr[i]) },
                { typeof (string), (dr, i) => dr.GetString(i) },
                { typeof (int), (dr, i) => Convert.ToInt32(dr[i]) },
                { typeof (bool), (dr, i) => ( (dr[i] != null && (dr.GetString(i).ToUpper() == "TRUE" || dr.GetString(i) == "1")) ? true : false ) },
                { typeof (decimal), (dr, i) => Convert.ToDecimal(dr[i]) },
                { typeof (DateTime), (dr, i) => Convert.ToDateTime(dr[i]) }
            };

    }
}
