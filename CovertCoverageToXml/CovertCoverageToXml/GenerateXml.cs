using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.Coverage.Analysis;
using System.IO;
using System.Xml.Linq;
using Microsoft.Web.Administration;

namespace CovertCoverageToXml
{
    class GenerateXml
    {
        static List<string> binPaths;
        static string masterXmlPath;
        static string coverageFile;
        static string CoveragePath;
        static string strAppList;
        
        static void Main(string[] args)
        {

            if (args.Length == 0)
            {
                // comment once testing is done
                //args = new string[3] { @"\\hqomsws04t1a.dstest.drugstore.com\webroot\DsPayPalService\Release_DsPayPalService_16.02.24.01\bin\PP_CC.coverage", "PayPal", @"C:\QAAutomation\CoverageFiles\PayPal" };
                //args = new string[3] { @"\\hqomsws04t1a.dstest.drugstore.com\webroot\ContentCatalogService\Dev2_ContentCatalogService_16.04.19.00\bin\CC.coverage", "ConentCatalog", @"C:\QAAutomation\CoverageFiles\ContentCatalog" };
                //args = new string[3] { @"\\hqomsws04t1a.dstest.drugstore.com\webroot\ContentCatalogService\Dev2_ContentCatalogService_16.03.16.03\bin\CCProductBlurb.coverage", "ConentCatalogProductBlurb", @"C:\QAAutomation\CoverageFiles\ContentCatalog" };
                
                //Uncomment once testing is done
                Console.WriteLine("Invalid Arguments......");
                Console.WriteLine("Argumenst should be Coverage File Path (same as instrumented bin path), Application Name, Xml File Location");
                return;
            }

            bool isXmlGenerated=false;
            string inputfile = args[0]; 
            CoveragePath = Path.GetDirectoryName(inputfile);
            coverageFile = Path.GetFileNameWithoutExtension(inputfile);

            strAppList = args[1];

            if (File.Exists(inputfile))
            {
                Console.WriteLine("Coverage File Exist");
                Console.WriteLine("Params:{0},{1}", inputfile, strAppList);
                try
                {
                    binPaths = new List<string>();
                    binPaths.Add(CoveragePath);
                    CoverageInfo ci = CoverageInfo.CreateFromFile(inputfile, binPaths, binPaths);
                    CoverageDS data = ci.BuildDataSet(null);
                    masterXmlPath = GetMasterXmlFilePath(args[2]);
                    data.WriteXml(masterXmlPath);
                }
                catch (ImageNotFoundException infEx)
                {
                    Console.WriteLine("Image not found exception is caught.." + infEx.StackTrace);
                    //throw;
                }

                if (File.Exists(masterXmlPath))
                    isXmlGenerated = true;                
            }
            else
            {
                Console.WriteLine("Coverage File does not Exist");
            }

            if (isXmlGenerated)
                Console.WriteLine("Successfully coverted to Xml File :" + isXmlGenerated);
            Console.ReadLine();
        }

        private static string GetMasterXmlFilePath( string CoverageXmlPath)
        {
            return Path.Combine(CoverageXmlPath, coverageFile + ".xml");
        }

    }
}
