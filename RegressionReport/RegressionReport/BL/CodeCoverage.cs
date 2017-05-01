using RegressionReport.BO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.IO.IsolatedStorage;
using System.Runtime.Serialization.Formatters.Binary;
using System.Xml.Serialization;

namespace RegressionReport.BL
{
    public class CodeCoverage
    {
        public List<CoverageDSPriv> CoverageReport()
        {
            List<CoverageDSPriv> coverageApps = new List<CoverageDSPriv>();
            
            foreach (string directoryName in Directory.GetDirectories(ConfigurationManager.AppSettings["CoverageFiles"]))
            {
                foreach (string fileName in Directory.GetFiles(directoryName))
                {
                    CoverageDSPriv coverageModule = new CoverageDSPriv();
                    if (fileName.Contains(".xml"))
                    {
                        XmlSerializer serializer = new XmlSerializer(typeof(CoverageDSPriv));
                        StreamReader reader = new StreamReader(fileName);
                        CoverageDSPriv moduleCoverageLst = (CoverageDSPriv)serializer.Deserialize(reader);
                        if (moduleCoverageLst != null)
                        {
                            moduleCoverageLst.ApplicationName = directoryName.Substring(directoryName.LastIndexOf('\\') + 1);
                            foreach (CoverageDSPrivModule moduleCoverage in moduleCoverageLst.Module)
                            {
                                moduleCoverageLst.BlocksCovered += moduleCoverage.BlocksCovered;
                                moduleCoverageLst.BlocksNotCovered += moduleCoverage.BlocksNotCovered;
                                moduleCoverageLst.LinesCovered += moduleCoverage.LinesCovered;
                                moduleCoverageLst.LinesNotCovered += moduleCoverage.LinesNotCovered;
                                moduleCoverageLst.LinesPartiallyCovered += moduleCoverage.LinesPartiallyCovered;
                            }
                            moduleCoverageLst.CoveragePercent = Math.Round(((moduleCoverageLst.LinesCovered + 0.0 + moduleCoverageLst.LinesPartiallyCovered) / (moduleCoverageLst.LinesCovered + moduleCoverageLst.LinesNotCovered + moduleCoverageLst.LinesPartiallyCovered)) * 100, 2);
                            moduleCoverageLst.BlockCoveragePercent = Math.Round(((moduleCoverageLst.BlocksCovered + 0.0) / (moduleCoverageLst.BlocksCovered + moduleCoverageLst.BlocksNotCovered)) * 100, 2);
                            coverageApps.Add(moduleCoverageLst);
                        }
                        reader.Close();
                    }
                }
            }
            return coverageApps;
        }
    }
}