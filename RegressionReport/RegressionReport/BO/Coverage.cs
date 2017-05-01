﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace RegressionReport.BO
{
    public class Coverage
    {

    }
    #region coveragefile
    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    [System.Xml.Serialization.XmlRootAttribute(Namespace = "", IsNullable = false)]
    public partial class CoverageDSPriv
    {

        private CoverageDSPrivModule[] moduleField;

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("Module")]
        public CoverageDSPrivModule[] Module
        {
            get
            {
                return this.moduleField;
            }
            set
            {
                this.moduleField = value;
            }
        }
        private string applicationname;
        private int linesCoveredField;

        private int linesPartiallyCoveredField;

        private int linesNotCoveredField;

        private int blocksCoveredField;

        private int blocksNotCoveredField;
        private double coveragepercent;
        private double blockcoveragepercent;
        public double CoveragePercent
        {
            get
            {
                return this.coveragepercent;
            }
            set
            {
                this.coveragepercent = value;
            }
        }
        public double BlockCoveragePercent
        {
            get
            {
                return this.blockcoveragepercent;
            }
            set
            {
                this.blockcoveragepercent = value;
            }
        }
        public string ApplicationName
        {
            get
            {
                return this.applicationname;
            }
            set
            {
                this.applicationname = value;
            }
        }

        public int LinesCovered
        {
            get
            {
                return this.linesCoveredField;
            }
            set
            {
                this.linesCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesPartiallyCovered
        {
            get
            {
                return this.linesPartiallyCoveredField;
            }
            set
            {
                this.linesPartiallyCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesNotCovered
        {
            get
            {
                return this.linesNotCoveredField;
            }
            set
            {
                this.linesNotCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksCovered
        {
            get
            {
                return this.blocksCoveredField;
            }
            set
            {
                this.blocksCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksNotCovered
        {
            get
            {
                return this.blocksNotCoveredField;
            }
            set
            {
                this.blocksNotCoveredField = value;
            }
        }
    }

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    public partial class CoverageDSPrivModule
    {
        private string moduleNameField;

        private int imageSizeField;

        private int imageLinkTimeField;

        private int linesCoveredField;

        private int linesPartiallyCoveredField;

        private int linesNotCoveredField;

        private int blocksCoveredField;

        private int blocksNotCoveredField;

        private CoverageDSPrivModuleNamespaceTable[] namespaceTableField;
        

        /// <remarks/>
        public string ModuleName
        {
            get
            {
                return this.moduleNameField;
            }
            set
            {
                this.moduleNameField = value;
            }
        }

        /// <remarks/>
        public int ImageSize
        {
            get
            {
                return this.imageSizeField;
            }
            set
            {
                this.imageSizeField = value;
            }
        }

        /// <remarks/>
        public int ImageLinkTime
        {
            get
            {
                return this.imageLinkTimeField;
            }
            set
            {
                this.imageLinkTimeField = value;
            }
        }

        /// <remarks/>
        public int LinesCovered
        {
            get
            {
                return this.linesCoveredField;
            }
            set
            {
                this.linesCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesPartiallyCovered
        {
            get
            {
                return this.linesPartiallyCoveredField;
            }
            set
            {
                this.linesPartiallyCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesNotCovered
        {
            get
            {
                return this.linesNotCoveredField;
            }
            set
            {
                this.linesNotCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksCovered
        {
            get
            {
                return this.blocksCoveredField;
            }
            set
            {
                this.blocksCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksNotCovered
        {
            get
            {
                return this.blocksNotCoveredField;
            }
            set
            {
                this.blocksNotCoveredField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("NamespaceTable")]
        public CoverageDSPrivModuleNamespaceTable[] NamespaceTable
        {
            get
            {
                return this.namespaceTableField;
            }
            set
            {
                this.namespaceTableField = value;
            }
        }

       
        
    }

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    public partial class CoverageDSPrivModuleNamespaceTable
    {

        private int blocksCoveredField;

        private int blocksNotCoveredField;

        private int linesCoveredField;

        private int linesNotCoveredField;

        private int linesPartiallyCoveredField;

        private string moduleNameField;

        private string namespaceKeyNameField;

        private string namespaceNameField;

        private CoverageDSPrivModuleNamespaceTableClass[] classField;

        /// <remarks/>
        public int BlocksCovered
        {
            get
            {
                return this.blocksCoveredField;
            }
            set
            {
                this.blocksCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksNotCovered
        {
            get
            {
                return this.blocksNotCoveredField;
            }
            set
            {
                this.blocksNotCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesCovered
        {
            get
            {
                return this.linesCoveredField;
            }
            set
            {
                this.linesCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesNotCovered
        {
            get
            {
                return this.linesNotCoveredField;
            }
            set
            {
                this.linesNotCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesPartiallyCovered
        {
            get
            {
                return this.linesPartiallyCoveredField;
            }
            set
            {
                this.linesPartiallyCoveredField = value;
            }
        }

        /// <remarks/>
        public string ModuleName
        {
            get
            {
                return this.moduleNameField;
            }
            set
            {
                this.moduleNameField = value;
            }
        }

        /// <remarks/>
        public string NamespaceKeyName
        {
            get
            {
                return this.namespaceKeyNameField;
            }
            set
            {
                this.namespaceKeyNameField = value;
            }
        }

        /// <remarks/>
        public string NamespaceName
        {
            get
            {
                return this.namespaceNameField;
            }
            set
            {
                this.namespaceNameField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("Class")]
        public CoverageDSPrivModuleNamespaceTableClass[] Class
        {
            get
            {
                return this.classField;
            }
            set
            {
                this.classField = value;
            }
        }
    }

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    public partial class CoverageDSPrivModuleNamespaceTableClass
    {

        private string classKeyNameField;

        private string classNameField;

        private int linesCoveredField;

        private int linesNotCoveredField;

        private int linesPartiallyCoveredField;

        private int blocksCoveredField;

        private int blocksNotCoveredField;

        private string namespaceKeyNameField;

        private CoverageDSPrivModuleNamespaceTableClassMethod[] methodField;

        /// <remarks/>
        public string ClassKeyName
        {
            get
            {
                return this.classKeyNameField;
            }
            set
            {
                this.classKeyNameField = value;
            }
        }

        /// <remarks/>
        public string ClassName
        {
            get
            {
                return this.classNameField;
            }
            set
            {
                this.classNameField = value;
            }
        }

        /// <remarks/>
        public int LinesCovered
        {
            get
            {
                return this.linesCoveredField;
            }
            set
            {
                this.linesCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesNotCovered
        {
            get
            {
                return this.linesNotCoveredField;
            }
            set
            {
                this.linesNotCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesPartiallyCovered
        {
            get
            {
                return this.linesPartiallyCoveredField;
            }
            set
            {
                this.linesPartiallyCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksCovered
        {
            get
            {
                return this.blocksCoveredField;
            }
            set
            {
                this.blocksCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksNotCovered
        {
            get
            {
                return this.blocksNotCoveredField;
            }
            set
            {
                this.blocksNotCoveredField = value;
            }
        }

        /// <remarks/>
        public string NamespaceKeyName
        {
            get
            {
                return this.namespaceKeyNameField;
            }
            set
            {
                this.namespaceKeyNameField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("Method")]
        public CoverageDSPrivModuleNamespaceTableClassMethod[] Method
        {
            get
            {
                return this.methodField;
            }
            set
            {
                this.methodField = value;
            }
        }
    }

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    public partial class CoverageDSPrivModuleNamespaceTableClassMethod
    {

        private string methodKeyNameField;

        private string methodNameField;

        private string methodFullNameField;

        private int linesCoveredField;

        private int linesPartiallyCoveredField;

        private int linesNotCoveredField;

        private int blocksCoveredField;

        private int blocksNotCoveredField;

        private CoverageDSPrivModuleNamespaceTableClassMethodLines[] linesField;

        /// <remarks/>
        public string MethodKeyName
        {
            get
            {
                return this.methodKeyNameField;
            }
            set
            {
                this.methodKeyNameField = value;
            }
        }

        /// <remarks/>
        public string MethodName
        {
            get
            {
                return this.methodNameField;
            }
            set
            {
                this.methodNameField = value;
            }
        }

        /// <remarks/>
        public string MethodFullName
        {
            get
            {
                return this.methodFullNameField;
            }
            set
            {
                this.methodFullNameField = value;
            }
        }

        /// <remarks/>
        public int LinesCovered
        {
            get
            {
                return this.linesCoveredField;
            }
            set
            {
                this.linesCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesPartiallyCovered
        {
            get
            {
                return this.linesPartiallyCoveredField;
            }
            set
            {
                this.linesPartiallyCoveredField = value;
            }
        }

        /// <remarks/>
        public int LinesNotCovered
        {
            get
            {
                return this.linesNotCoveredField;
            }
            set
            {
                this.linesNotCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksCovered
        {
            get
            {
                return this.blocksCoveredField;
            }
            set
            {
                this.blocksCoveredField = value;
            }
        }

        /// <remarks/>
        public int BlocksNotCovered
        {
            get
            {
                return this.blocksNotCoveredField;
            }
            set
            {
                this.blocksNotCoveredField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute("Lines")]
        public CoverageDSPrivModuleNamespaceTableClassMethodLines[] Lines
        {
            get
            {
                return this.linesField;
            }
            set
            {
                this.linesField = value;
            }
        }
    }

    /// <remarks/>
    [System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    public partial class CoverageDSPrivModuleNamespaceTableClassMethodLines
    {

        private int lnStartField;

        private int colStartField;

        private int lnEndField;

        private int colEndField;

        private int coverageField;

        private int sourceFileIDField;

        private int lineIDField;

        /// <remarks/>
        public int LnStart
        {
            get
            {
                return this.lnStartField;
            }
            set
            {
                this.lnStartField = value;
            }
        }

        /// <remarks/>
        public int ColStart
        {
            get
            {
                return this.colStartField;
            }
            set
            {
                this.colStartField = value;
            }
        }

        /// <remarks/>
        public int LnEnd
        {
            get
            {
                return this.lnEndField;
            }
            set
            {
                this.lnEndField = value;
            }
        }

        /// <remarks/>
        public int ColEnd
        {
            get
            {
                return this.colEndField;
            }
            set
            {
                this.colEndField = value;
            }
        }

        /// <remarks/>
        public int Coverage
        {
            get
            {
                return this.coverageField;
            }
            set
            {
                this.coverageField = value;
            }
        }

        /// <remarks/>
        public int SourceFileID
        {
            get
            {
                return this.sourceFileIDField;
            }
            set
            {
                this.sourceFileIDField = value;
            }
        }

        /// <remarks/>
        public int LineID
        {
            get
            {
                return this.lineIDField;
            }
            set
            {
                this.lineIDField = value;
            }
        }
    }
 #endregion
}