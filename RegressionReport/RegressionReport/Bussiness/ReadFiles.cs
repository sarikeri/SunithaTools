using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RegressionReport.Bussiness
{
    public class ReadFiles
    {
        public void ReadLogFile()
        {
            List<string> appList = System.Web.Configuration.WebConfigurationManager.AppSettings["ApplicationNames"].ToString().Split(',').ToList();
            foreach (string app in appList)
            {

            }
        }
    }
}