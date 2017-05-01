using RegressionReport.BO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text;
using System.Linq;

namespace RegressionReport.BL
{
    public class Report
    {
        public List<Release> GetFunctionalTCInfo(string funFolder)
        {
            List<Release> releaseCycle = new List<Release>();
            string str = Directory.GetDirectories(Path.Combine(ConfigurationManager.AppSettings["ReleaseFolder"], funFolder), "*Functional*").FirstOrDefault();
            return GetTCInfo(str, funFolder);
        }
        public List<Release> GetLastTestCaseInfo(string releaseFolder)
        {
            List<Release> releaseCycle = new List<Release>();
            //const Int32 BufferSize = 128;
            string str = Directory.GetDirectories(Path.Combine(ConfigurationManager.AppSettings["ReleaseFolder"],releaseFolder),"*Log*").FirstOrDefault();
            return GetTCInfo(str, releaseFolder);
            //if (str != null)
            //{
            //    foreach (string directoryName in Directory.GetDirectories(str))
            //    {
            //        Release execCycle = new Release();
            //        execCycle.ReleaseName = releaseFolder; //directoryName.Substring(directoryName.LastIndexOf('\\') + 1);
            //        execCycle.appTCData = new List<ApplicationTCData>();
            //        foreach (string fileName in Directory.GetFiles(directoryName))
            //        {
            //            ApplicationTCData appTcData = new ApplicationTCData();
            //            appTcData.testData = new List<TestCaseData>();
            //            TestCaseData tcData = new TestCaseData();
            //            appTcData.ApplicationName = fileName.Substring(fileName.LastIndexOf('\\') + 1).Substring(0, fileName.Substring(fileName.LastIndexOf('\\') + 1).LastIndexOf('_'));
            //            using (var streamReader = new StreamReader(File.OpenRead(fileName), Encoding.UTF8, true, BufferSize))
            //            {
            //                String line;
            //                string tcid = string.Empty;
            //                while ((line = streamReader.ReadLine()) != null)
            //                {
            //                    if (line.ToLowerInvariant().Contains("test case") || line.ToLowerInvariant().Contains("testcase"))
            //                    {
            //                        if (line.ToLowerInvariant().Contains("started"))
            //                        {
            //                            tcData = new TestCaseData();
            //                            tcData.TCId = line.Substring(line.ToLowerInvariant().LastIndexOf("test case") + 10, 7).Trim();
            //                        }
            //                        else
            //                        {
            //                            if (tcData == null || tcData.TCId == null)
            //                            {
            //                                tcData = new TestCaseData();
            //                                tcData.TCId = line.Substring(line.ToLowerInvariant().LastIndexOf("test case") + 10, 6);
            //                            }
            //                            if (!appTcData.testData.Exists(s => s.TCId == tcData.TCId))
            //                            {
            //                                if (line.Contains("PASSED") || line.Contains("FAILED"))
            //                                {
            //                                    appTcData.TotalTCCount++;
            //                                    if (line.Contains("PASSED"))
            //                                    {
            //                                        appTcData.PassTCCount++;
            //                                        tcData.tcStatus = TCStatus.PASS;
            //                                    }
            //                                    else
            //                                    {
            //                                        appTcData.FailTCCount++;
            //                                        tcData.tcStatus = TCStatus.FAIL;
            //                                    }
            //                                    appTcData.testData.Add(tcData);
            //                                    tcData = null;
            //                                }
            //                            }
            //                            else
            //                            {
            //                                if (line.Contains("PASSED"))
            //                                {
            //                                    if (appTcData.testData.Single(s => s.TCId == tcData.TCId).tcStatus == TCStatus.FAIL)
            //                                    {
            //                                        appTcData.PassTCCount++;
            //                                        appTcData.FailTCCount--;
            //                                        appTcData.testData.Single(s => s.TCId == tcData.TCId).tcStatus = TCStatus.PASS;
            //                                    }
            //                                }
            //                            }
            //                            tcData = null;
            //                        }
            //                    }
            //                }
            //            }

            //            execCycle.appTCData.Add(appTcData);
            //        }
            //        //Console.WriteLine("***************************Execution For Cycle : " + execCycle.ReleaseName + "***************************");
            //        //foreach (ApplicationTCData appTcData in execCycle.appTCData)
            //        //{
            //        //    Console.WriteLine(string.Format("App: {0} ------- TotalTCCount: {1} ------- PassCount: {2} ------- FailCount: {3}", appTcData.ApplicationName, appTcData.PassTCCount + appTcData.FailTCCount, appTcData.PassTCCount, appTcData.FailTCCount));
            //        //}
            //        execCycle.TotalTCCount = execCycle.appTCData.Sum(s => s.TotalTCCount);
            //        execCycle.PassTCCount = execCycle.appTCData.Sum(s => s.PassTCCount);
            //        execCycle.FailTCCount = execCycle.appTCData.Sum(s => s.FailTCCount);
            //        execCycle.PassPercent = Math.Round(((execCycle.PassTCCount + 0.0) / execCycle.TotalTCCount * 100), 2);
            //        releaseCycle.Add(execCycle);
            //        execCycle = null;
            //    }
            //}
            //return releaseCycle;
        }

        private List<Release> GetTCInfo(string dirList, string releaseFolder)
        {
            List<Release> releaseCycle = new List<Release>();
            const Int32 BufferSize = 128;
            if (dirList != null)
            {
                foreach (string directoryName in Directory.GetDirectories(dirList))
                {
                    Release execCycle = new Release();
                    execCycle.ReleaseName = directoryName.Substring(directoryName.LastIndexOf('\\') + 1);
                    execCycle.appTCData = new List<ApplicationTCData>();
                    foreach (string fileName in Directory.GetFiles(directoryName))
                    {
                        ApplicationTCData appTcData = new ApplicationTCData();
                        appTcData.testData = new List<TestCaseData>();
                        TestCaseData tcData = new TestCaseData();
                        appTcData.ApplicationName = fileName.Substring(fileName.LastIndexOf('\\') + 1).Substring(0, fileName.Substring(fileName.LastIndexOf('\\') + 1).LastIndexOf('_'));
                        using (var streamReader = new StreamReader(File.OpenRead(fileName), Encoding.UTF8, true, BufferSize))
                        {
                            String line;
                            string tcid = string.Empty;
                            while ((line = streamReader.ReadLine()) != null)
                            {
                                if (line.ToLowerInvariant().Contains("test case") || line.ToLowerInvariant().Contains("testcase"))
                                {
                                    if (line.ToLowerInvariant().Contains("started"))
                                    {
                                        tcData = new TestCaseData();
                                        tcData.TCId = line.Substring(line.ToLowerInvariant().LastIndexOf("test case") + 10, 7).Trim();
                                    }
                                    else
                                    {
                                        if (tcData == null || tcData.TCId == null)
                                        {
                                            tcData = new TestCaseData();
                                            tcData.TCId = line.Substring(line.ToLowerInvariant().LastIndexOf("test case") + 10, 6);
                                        }
                                        if (!appTcData.testData.Exists(s => s.TCId == tcData.TCId))
                                        {
                                            if (line.Contains("PASSED") || line.Contains("FAILED"))
                                            {
                                                appTcData.TotalTCCount++;
                                                if (line.Contains("PASSED"))
                                                {
                                                    appTcData.PassTCCount++;
                                                    tcData.tcStatus = TCStatus.PASS;
                                                }
                                                else
                                                {
                                                    appTcData.FailTCCount++;
                                                    tcData.tcStatus = TCStatus.FAIL;
                                                }
                                                appTcData.testData.Add(tcData);
                                                tcData = null;
                                            }
                                        }
                                        else
                                        {
                                            if (line.Contains("PASSED"))
                                            {
                                                if (appTcData.testData.Single(s => s.TCId == tcData.TCId).tcStatus == TCStatus.FAIL)
                                                {
                                                    appTcData.PassTCCount++;
                                                    appTcData.FailTCCount--;
                                                    appTcData.testData.Single(s => s.TCId == tcData.TCId).tcStatus = TCStatus.PASS;
                                                }
                                            }
                                        }
                                        tcData = null;
                                    }
                                }
                            }
                        }

                        execCycle.appTCData.Add(appTcData);
                    }
                    //Console.WriteLine("***************************Execution For Cycle : " + execCycle.ReleaseName + "***************************");
                    //foreach (ApplicationTCData appTcData in execCycle.appTCData)
                    //{
                    //    Console.WriteLine(string.Format("App: {0} ------- TotalTCCount: {1} ------- PassCount: {2} ------- FailCount: {3}", appTcData.ApplicationName, appTcData.PassTCCount + appTcData.FailTCCount, appTcData.PassTCCount, appTcData.FailTCCount));
                    //}
                    execCycle.TotalTCCount = execCycle.appTCData.Sum(s => s.TotalTCCount);
                    execCycle.PassTCCount = execCycle.appTCData.Sum(s => s.PassTCCount);
                    execCycle.FailTCCount = execCycle.appTCData.Sum(s => s.FailTCCount);
                    execCycle.PassPercent = Math.Round(((execCycle.PassTCCount + 0.0) / execCycle.TotalTCCount * 100), 2);
                    releaseCycle.Add(execCycle);
                    execCycle = null;
                }
            }
            return releaseCycle;
        }

        public List<ApplicationTCData> GetLastApplicationTestCaseInfo(string releaseFolder,string releaseName)
        {
            const Int32 BufferSize = 128;
            List<ApplicationTCData> appTCDataList = null;
            //foreach (string directoryName in Directory.GetDirectories(@"C:\QAAutomation" + ReleaseName))
            //{
            string directoryName = Directory.GetDirectories(Path.Combine(ConfigurationManager.AppSettings["ReleaseFolder"], releaseFolder, releaseName)).FirstOrDefault(); ;
            //@"C:\QAAutomation\" + releaseName;
            appTCDataList = new List<ApplicationTCData>();
            if (!Directory.Exists(directoryName))
            {
                directoryName = ConfigurationManager.AppSettings["TestCaseLogfile"];
            }
            foreach (string fileName in Directory.GetFiles(directoryName))
            {
                if (fileName.Contains(".log"))
                {
                    ApplicationTCData appTcData = new ApplicationTCData();
                    appTcData.testData = new List<TestCaseData>();
                    TestCaseData tcData = new TestCaseData();
                    appTcData.ApplicationName = fileName.Substring(fileName.LastIndexOf('\\') + 1).Substring(0, fileName.Substring(fileName.LastIndexOf('\\') + 1).LastIndexOf('_'));
                    var temp = from appTCDt in appTCDataList where appTCDt.ApplicationName.Equals(appTcData.ApplicationName) select appTCDt;
                    if (temp.FirstOrDefault() != null)
                        appTcData = (ApplicationTCData)temp.FirstOrDefault();
                    using (var streamReader = new StreamReader(File.OpenRead(fileName), Encoding.UTF8, true, BufferSize))
                    {
                        String line;
                        string tcid = string.Empty;
                        while ((line = streamReader.ReadLine()) != null)
                        {
                            if (line.ToLowerInvariant().Contains("test case") || line.ToLowerInvariant().Contains("testcase"))
                            {
                                if (line.ToLowerInvariant().Contains("started"))
                                {
                                    tcData = new TestCaseData();
                                    tcData.TCId = line.Substring(line.ToLowerInvariant().LastIndexOf("test case") + 10, 7).Trim();
                                }
                                else
                                {
                                    if (tcData == null || tcData.TCId == null)
                                    {
                                        tcData = new TestCaseData();
                                        tcData.TCId = line.Substring(line.ToLowerInvariant().LastIndexOf("test case") + 10, 6);
                                    }
                                    //var ret = appTcData.testData.Exists(s => s.TCId == tcData.TCId);
                                    if (!appTcData.testData.Exists(s => s.TCId == tcData.TCId))
                                    {
                                        if (line.Contains("PASSED") || line.Contains("FAILED"))
                                        {
                                            appTcData.TotalTCCount++;
                                            if (line.Contains("PASSED"))
                                            {
                                                appTcData.PassTCCount++;
                                                tcData.tcStatus = TCStatus.PASS;
                                            }
                                            else
                                            {
                                                appTcData.FailTCCount++;
                                                tcData.tcStatus = TCStatus.FAIL;
                                            }
                                            appTcData.testData.Add(tcData);
                                            tcData = null;
                                        }
                                    }
                                    else
                                    {
                                        if (line.Contains("PASSED"))
                                        {
                                            if (appTcData.testData.Single(s => s.TCId == tcData.TCId).tcStatus == TCStatus.FAIL)
                                            {
                                                appTcData.PassTCCount++;
                                                appTcData.FailTCCount--;
                                                appTcData.testData.Single(s => s.TCId == tcData.TCId).tcStatus = TCStatus.PASS;
                                            }
                                        }
                                    }
                                    tcData = null;
                                }
                            }
                        }
                        appTcData.PassPercent = Math.Round(((appTcData.PassTCCount + 0.0) / appTcData.TotalTCCount * 100), 2);
                        if (temp.FirstOrDefault() == null)
                            appTCDataList.Add(appTcData);
                    }
                }
            }
            //}
            return appTCDataList;
        }

        public List<string> GetReleaseFolders()
        {
            //List<string> ReleaseName = Directory.GetDirectories(ConfigurationManager.AppSettings["ReleaseFolder"]).Select(i=>i.Substring(i.LastIndexOf('\\')+1)).ToList();
            //return ReleaseName;
            List<string> ReleaseName = new List<string>();
            foreach (string dir in Directory.GetDirectories(ConfigurationManager.AppSettings["ReleaseFolder"]).ToList())
            {
                foreach (string str in Directory.GetDirectories(dir).ToList())
                {
                    if (str.Contains("Log"))
                        ReleaseName.Add(dir.Substring(dir.LastIndexOf('\\')+1));
                }
            }
            return ReleaseName;
        }

        public List<string> GetFuncationalFolders()
        {
            List<string> ReleaseName = new List<string>();
            foreach (string dir in Directory.GetDirectories(ConfigurationManager.AppSettings["ReleaseFolder"]).ToList())
            {
                foreach (string str in Directory.GetDirectories(dir).ToList())
                {
                    if (str.Contains("Functional"))
                        ReleaseName.Add(dir.Substring(dir.LastIndexOf('\\') + 1));
                }
            }
            return ReleaseName;
        }
    }
}