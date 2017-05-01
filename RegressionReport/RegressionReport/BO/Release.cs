using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RegressionReport.BO
{
    public class Release
    {
        public string ReleaseName { get; set; }
        public List<ApplicationTCData> appTCData = new List<ApplicationTCData>();
        public int TotalTCCount { get; set; }
        public int PassTCCount { get; set; }
        public int FailTCCount { get; set; }
        public double PassPercent { get; set; }
    }
    public class ApplicationTCData
    {
        public string ApplicationName { get; set; }
        public int TotalTCCount { get; set; }
        public int PassTCCount { get; set; }
        public int FailTCCount { get; set; }
        public double PassPercent { get; set; }
        public List<TestCaseData> testData { get; set; }
    }
    public class TestCaseData
    {
        public string TCId { get; set; }
        public TCStatus tcStatus { get; set; }
    }
    public enum TCStatus
    {
        PASS = 1,
        FAIL = 0
    }
}