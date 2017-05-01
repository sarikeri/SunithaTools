using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class CoverageXMLClass
    {
    }

    ///// <remarks/>
    //[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    //[System.Xml.Serialization.XmlRootAttribute(Namespace = "", IsNullable = false)]
    //public partial class CoverageDSPriv
    //{

    //    private CoverageDSPrivModule moduleField;

    //    private CoverageDSPrivSourceFileNames[] sourceFileNamesField;

    //    /// <remarks/>
    //    public CoverageDSPrivModule Module
    //    {
    //        get
    //        {
    //            return this.moduleField;
    //        }
    //        set
    //        {
    //            this.moduleField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    [System.Xml.Serialization.XmlElementAttribute("SourceFileNames")]
    //    public CoverageDSPrivSourceFileNames[] SourceFileNames
    //    {
    //        get
    //        {
    //            return this.sourceFileNamesField;
    //        }
    //        set
    //        {
    //            this.sourceFileNamesField = value;
    //        }
    //    }
    //}

    ///// <remarks/>
    //[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    //public partial class CoverageDSPrivModule
    //{

    //    private string moduleNameField;

    //    private uint imageSizeField;

    //    private byte imageLinkTimeField;

    //    private ushort linesCoveredField;

    //    private byte linesPartiallyCoveredField;

    //    private ushort linesNotCoveredField;

    //    private ushort blocksCoveredField;

    //    private ushort blocksNotCoveredField;

    //    private CoverageDSPrivModuleNamespaceTable[] namespaceTableField;

    //    /// <remarks/>
    //    public string ModuleName
    //    {
    //        get
    //        {
    //            return this.moduleNameField;
    //        }
    //        set
    //        {
    //            this.moduleNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public uint ImageSize
    //    {
    //        get
    //        {
    //            return this.imageSizeField;
    //        }
    //        set
    //        {
    //            this.imageSizeField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte ImageLinkTime
    //    {
    //        get
    //        {
    //            return this.imageLinkTimeField;
    //        }
    //        set
    //        {
    //            this.imageLinkTimeField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort LinesCovered
    //    {
    //        get
    //        {
    //            return this.linesCoveredField;
    //        }
    //        set
    //        {
    //            this.linesCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesPartiallyCovered
    //    {
    //        get
    //        {
    //            return this.linesPartiallyCoveredField;
    //        }
    //        set
    //        {
    //            this.linesPartiallyCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort LinesNotCovered
    //    {
    //        get
    //        {
    //            return this.linesNotCoveredField;
    //        }
    //        set
    //        {
    //            this.linesNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort BlocksCovered
    //    {
    //        get
    //        {
    //            return this.blocksCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort BlocksNotCovered
    //    {
    //        get
    //        {
    //            return this.blocksNotCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    [System.Xml.Serialization.XmlElementAttribute("NamespaceTable")]
    //    public CoverageDSPrivModuleNamespaceTable[] NamespaceTable
    //    {
    //        get
    //        {
    //            return this.namespaceTableField;
    //        }
    //        set
    //        {
    //            this.namespaceTableField = value;
    //        }
    //    }
    //}

    ///// <remarks/>
    //[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    //public partial class CoverageDSPrivModuleNamespaceTable
    //{

    //    private ushort blocksCoveredField;

    //    private ushort blocksNotCoveredField;

    //    private ushort linesCoveredField;

    //    private byte linesNotCoveredField;

    //    private byte linesPartiallyCoveredField;

    //    private string moduleNameField;

    //    private string namespaceKeyNameField;

    //    private string namespaceNameField;

    //    private CoverageDSPrivModuleNamespaceTableClass[] classField;

    //    /// <remarks/>
    //    public ushort BlocksCovered
    //    {
    //        get
    //        {
    //            return this.blocksCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort BlocksNotCovered
    //    {
    //        get
    //        {
    //            return this.blocksNotCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort LinesCovered
    //    {
    //        get
    //        {
    //            return this.linesCoveredField;
    //        }
    //        set
    //        {
    //            this.linesCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesNotCovered
    //    {
    //        get
    //        {
    //            return this.linesNotCoveredField;
    //        }
    //        set
    //        {
    //            this.linesNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesPartiallyCovered
    //    {
    //        get
    //        {
    //            return this.linesPartiallyCoveredField;
    //        }
    //        set
    //        {
    //            this.linesPartiallyCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string ModuleName
    //    {
    //        get
    //        {
    //            return this.moduleNameField;
    //        }
    //        set
    //        {
    //            this.moduleNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string NamespaceKeyName
    //    {
    //        get
    //        {
    //            return this.namespaceKeyNameField;
    //        }
    //        set
    //        {
    //            this.namespaceKeyNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string NamespaceName
    //    {
    //        get
    //        {
    //            return this.namespaceNameField;
    //        }
    //        set
    //        {
    //            this.namespaceNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    [System.Xml.Serialization.XmlElementAttribute("Class")]
    //    public CoverageDSPrivModuleNamespaceTableClass[] Class
    //    {
    //        get
    //        {
    //            return this.classField;
    //        }
    //        set
    //        {
    //            this.classField = value;
    //        }
    //    }
    //}

    ///// <remarks/>
    //[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    //public partial class CoverageDSPrivModuleNamespaceTableClass
    //{

    //    private string classKeyNameField;

    //    private string classNameField;

    //    private byte linesCoveredField;

    //    private byte linesNotCoveredField;

    //    private byte linesPartiallyCoveredField;

    //    private byte blocksCoveredField;

    //    private byte blocksNotCoveredField;

    //    private string namespaceKeyNameField;

    //    private CoverageDSPrivModuleNamespaceTableClassMethod[] methodField;

    //    /// <remarks/>
    //    public string ClassKeyName
    //    {
    //        get
    //        {
    //            return this.classKeyNameField;
    //        }
    //        set
    //        {
    //            this.classKeyNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string ClassName
    //    {
    //        get
    //        {
    //            return this.classNameField;
    //        }
    //        set
    //        {
    //            this.classNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesCovered
    //    {
    //        get
    //        {
    //            return this.linesCoveredField;
    //        }
    //        set
    //        {
    //            this.linesCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesNotCovered
    //    {
    //        get
    //        {
    //            return this.linesNotCoveredField;
    //        }
    //        set
    //        {
    //            this.linesNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesPartiallyCovered
    //    {
    //        get
    //        {
    //            return this.linesPartiallyCoveredField;
    //        }
    //        set
    //        {
    //            this.linesPartiallyCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte BlocksCovered
    //    {
    //        get
    //        {
    //            return this.blocksCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte BlocksNotCovered
    //    {
    //        get
    //        {
    //            return this.blocksNotCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string NamespaceKeyName
    //    {
    //        get
    //        {
    //            return this.namespaceKeyNameField;
    //        }
    //        set
    //        {
    //            this.namespaceKeyNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    [System.Xml.Serialization.XmlElementAttribute("Method")]
    //    public CoverageDSPrivModuleNamespaceTableClassMethod[] Method
    //    {
    //        get
    //        {
    //            return this.methodField;
    //        }
    //        set
    //        {
    //            this.methodField = value;
    //        }
    //    }
    //}

    ///// <remarks/>
    //[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    //public partial class CoverageDSPrivModuleNamespaceTableClassMethod
    //{

    //    private string methodKeyNameField;

    //    private string methodNameField;

    //    private string methodFullNameField;

    //    private byte linesCoveredField;

    //    private byte linesPartiallyCoveredField;

    //    private byte linesNotCoveredField;

    //    private byte blocksCoveredField;

    //    private byte blocksNotCoveredField;

    //    private CoverageDSPrivModuleNamespaceTableClassMethodLines[] linesField;

    //    /// <remarks/>
    //    public string MethodKeyName
    //    {
    //        get
    //        {
    //            return this.methodKeyNameField;
    //        }
    //        set
    //        {
    //            this.methodKeyNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string MethodName
    //    {
    //        get
    //        {
    //            return this.methodNameField;
    //        }
    //        set
    //        {
    //            this.methodNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string MethodFullName
    //    {
    //        get
    //        {
    //            return this.methodFullNameField;
    //        }
    //        set
    //        {
    //            this.methodFullNameField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesCovered
    //    {
    //        get
    //        {
    //            return this.linesCoveredField;
    //        }
    //        set
    //        {
    //            this.linesCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesPartiallyCovered
    //    {
    //        get
    //        {
    //            return this.linesPartiallyCoveredField;
    //        }
    //        set
    //        {
    //            this.linesPartiallyCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte LinesNotCovered
    //    {
    //        get
    //        {
    //            return this.linesNotCoveredField;
    //        }
    //        set
    //        {
    //            this.linesNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte BlocksCovered
    //    {
    //        get
    //        {
    //            return this.blocksCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte BlocksNotCovered
    //    {
    //        get
    //        {
    //            return this.blocksNotCoveredField;
    //        }
    //        set
    //        {
    //            this.blocksNotCoveredField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    [System.Xml.Serialization.XmlElementAttribute("Lines")]
    //    public CoverageDSPrivModuleNamespaceTableClassMethodLines[] Lines
    //    {
    //        get
    //        {
    //            return this.linesField;
    //        }
    //        set
    //        {
    //            this.linesField = value;
    //        }
    //    }
    //}

    ///// <remarks/>
    //[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    //public partial class CoverageDSPrivModuleNamespaceTableClassMethodLines
    //{

    //    private ushort lnStartField;

    //    private byte colStartField;

    //    private ushort lnEndField;

    //    private byte colEndField;

    //    private byte coverageField;

    //    private byte sourceFileIDField;

    //    private ushort lineIDField;

    //    /// <remarks/>
    //    public ushort LnStart
    //    {
    //        get
    //        {
    //            return this.lnStartField;
    //        }
    //        set
    //        {
    //            this.lnStartField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte ColStart
    //    {
    //        get
    //        {
    //            return this.colStartField;
    //        }
    //        set
    //        {
    //            this.colStartField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort LnEnd
    //    {
    //        get
    //        {
    //            return this.lnEndField;
    //        }
    //        set
    //        {
    //            this.lnEndField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte ColEnd
    //    {
    //        get
    //        {
    //            return this.colEndField;
    //        }
    //        set
    //        {
    //            this.colEndField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte Coverage
    //    {
    //        get
    //        {
    //            return this.coverageField;
    //        }
    //        set
    //        {
    //            this.coverageField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public byte SourceFileID
    //    {
    //        get
    //        {
    //            return this.sourceFileIDField;
    //        }
    //        set
    //        {
    //            this.sourceFileIDField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public ushort LineID
    //    {
    //        get
    //        {
    //            return this.lineIDField;
    //        }
    //        set
    //        {
    //            this.lineIDField = value;
    //        }
    //    }
    //}

    ///// <remarks/>
    //[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
    //public partial class CoverageDSPrivSourceFileNames
    //{

    //    private byte sourceFileIDField;

    //    private string sourceFileNameField;

    //    /// <remarks/>
    //    public byte SourceFileID
    //    {
    //        get
    //        {
    //            return this.sourceFileIDField;
    //        }
    //        set
    //        {
    //            this.sourceFileIDField = value;
    //        }
    //    }

    //    /// <remarks/>
    //    public string SourceFileName
    //    {
    //        get
    //        {
    //            return this.sourceFileNameField;
    //        }
    //        set
    //        {
    //            this.sourceFileNameField = value;
    //        }
    //    }
    //}


}
