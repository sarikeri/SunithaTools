using System;

namespace Wag.Oms.SOS.Common
{
    public enum SuborderStatus
    {
        PreValid = -1,
        Invalid = 0,
        New = 1,
        Submitted = 2,
        Backordered = 3,
        Held = 4,
        Resubmitted = 5,
        CancelPending = 6,
        Cancelled = 7,
        Shipped = 8,
        SubmittedButCheckResponseReceived = 9,
        Presell = 10,
        ShipRequestSent = 11,
        PreAuthSent = 12,
        AuthCompleteFailed = 13,
        Deleted = 14,
        AuthCompleteSentCharging = 19,
        AuthCompleteOkCharged = 20,
        PendingRxEvaluation = 30,
        RxRequested = 31,
        PendingPoEvaluation = 32,
        PoRequested = 33,
        PendingPoInventoryCheck = 34,
        PendingShip = 35,
        Unexpected = 40,
        CnsHoldStatus = 99
    }

    public enum RequestType
    {
        Order = 1,
        Suborder = 2,
        Cart = 3
    }

    public enum RequestErrorCode
    {
        InputDataOK = 0,
        InputDataError = 1
    }

    public enum RoutingErrorCode
    {
        Success = 0,
        SuccessWithDiscrepancy = 1,
        SuccessToCancel = 2,
        SuccessToHold = 3,
        SuccessToBackOrder = 4,
        SuccessToPresell = 5,
        Fail = -1
    }

    public enum CreditCardStatus
    {
        New = 1,
        Tokenized = 2,
        InvalidCreditCard = 3,
        Tokenizing = 4,
        BMLPendingForOrderInformation = 10,
        DeletedFlagSetNoOrders = 5,
        DeletedFlagSetVoidedOrder = 6,
        DeletedFlagNotSetVoidedOrder = 7,
        DeletedFlagSetOpenOrder = 8,
        CCExpiredNoOrders = 9
    }

    public enum OrderStatus
    {
        PendingSoon = -3,
        Aborted = -2,
        PendingForApproval = -1,
        Pending = 1,
        PendingCC = 2,
        PendingRX = 3,
        New = 4,
        Submitted = 5,
        CancelPending = 6,
        Completed = 7,
        Held = 8,
        PromoFraud = 9,
        PendingSku = 11,
        SkuRequested = 12,
        BaltimoreNew = 14,
        BaltimoreReady = 15,
        RoutingITFailed = 16,
        RoutingBIZFailed = 17,
        BulkOrderPendingCSRProcessing = 18,
        ReadyForOrderRouter = 20
    }

    public enum OrderFlags
    {
        BackorderEmail = 1,
        RxPreauth = 2,
        RxRenew = 4,
        PromoFraudExempt = 8,
        SentSiteStatus = 16,
        KnownBackorder = 32,
        Hazmat = 64,
        ProblemEmail = 128,
        CsrFreeOrder = 256,
        CsrFreeShipping = 512,
        Refrigerated = 1024,
        PaidByCheck = 2048,
        AutoReorder = 4096,
        OptedFsa = 8192,
        PrimaryCCDeclined = 16384,
        SecondaryCCDeclined = 32768,
        HasLensItem = 65536,
        HasBaseSku = 131072,
        RoutingFailure = 262144,
        Waivetaxonshipping = 524288,
        CsrFreeSecshipping = 1048576,
        PlacedWhileGuest = 2097152,
        PaidExternal = 4194304,
        SkipFraudCheck = 8388608,
        RxAutoRefill = 16777216,
        CsrNoModifyPeriod = 33554432,
        OptedFsaRxonly = 67108864,
        StsOrder = 134217728
    }


    public enum SuborderFlags
    {
        Fraud = 1,
        SecondaryShipping = 2,
        Beauty = 4,
        Ds = 8,
        Presell = 16,
        SoftCancel = 32,
        ApplySurcharge = 64,
        InstalChargeDecl = 128,
        OptedFsa = 256,
        Backordered = 512,
        LensItemPlacedInOrder = 1024,
        ContentSentToLensRxDc = 2048,
        PreauthSent = 4096,
        PreauthSentForFsa = 8192,
        AdjTooSoon = 16384,
        Outdropship = 32768,
        SkipFraudCheck = 65536,
        PartialSoftAllocated = 131072,
        Consolidated = 262144,
        OutOfStock = 524288,
        InjectedToRoutingQueue = 2097152
    }

    public enum SuborderPaymentStatus
    {
        Init = -1,
        Pending = 0,
        PreauthSent = 1,
        PreauthOk = 2,
        PreauthOkAndInvestigatingFraud = 2,
        PreauthDecl = 3,
        ChargeSent = 4,
        ChargeOk = 5,
        ChargeDecl = 6,
        Held = 7,
        NotFraud = 8,
        Fraud = 9,
        EmailSent = 10,
        Cancelled = 11
    }

    public enum FSAType
    {
        FSANotSet = 0,
        FSAOnly = 1,
        NonFSAOnly = 2,
        FSAMixed = 3
    }

    public enum PTSStatus
    {
        New = 0,
        SuborderTrackingSubscribed = 1
    }

    [Flags]
    public enum LineitemFlags
    {
        HAZMAT = 1,
        RA_IMPLIED_PICKUP = 2,
        BENEFIT_ITEM = 4,
        RX_WAIT_FOR_NDC_SUB = 8,
        RX_NDC_SUB_SUCCESS = 16,
        RX_NDC_SUB_FAIL = 32,
        BEAUTY_ITEM = 64,
        REFRIGERATED = 128,
        PRESELL = 256,
        LENS_ACQUIRED = 512,
        VA_AM = 1024,
        VA_NOON = 2048,
        VA_PM = 4096,
        VA_NIGHT = 8192,
        FSA = 16384,
        BASE_SKU = 32768,
        MTO = 65536,
        POD = 131072,
        RGP = 262144,
        RX_REQUIRED = 524288,
        POB = 1048576,
        ADJ_TOO_SOON = 4194304,
        INIT_REORDER = 8388608,
        OUTDROPSHIP = 16777216,
        FSA_PAYMENT = 33554432,
        PARTNER_SERVICE_FEE = 67108864,
        FSA_RX_MANUAL_CLAIM = 268435456
    }

    public enum DCTYPE_FLAGS
    {
        DCTYPEFLAG_CAN_APPLY_DISCOUNT = 1,
        DCTYPEFLAG_CAN_CHARGE_SHIPPING = 2,
        DCTYPEFLAG_CAN_CONSOLIDATE_BACKORDER = 4,
        DCTYPEFLAG_PARTIAL_SOFT_ALLOCATION_ALLOWED = 8,
        DCTYPEFLAG_ENABLE_POB = 16,
        DCTYPEFLAG_ENABLE_POD = 32,
        DCTYPEFLAG_INVENTORY_ALWAYS_READY = 64,
        DCTYPEFLAG_ENABLE_MAX_BACKORDER_DAYS_FOR_EMAIL = 128,
        DCTYPEFLAG_OUTBOUND_DROPSHIP = 256,
        DCTYPEFLAG_CAN_NOT_DISCONTINUE_ITEMS = 512,
        DCTYPEFLAG_CAN_SHIP_BASE_SKU = 1024
    }
    public enum SiteType
    {
        Beauty = 1,
        Default = 0
    }

    public enum SuborderBillingStatus
    {
        SUBORDER_BILLINGSTAT_NONE = 0,
        SUBORDER_BILLINGSTAT_CHARED = 1,
        SUBORDER_BILLINGSTAT_PREAUTHING = 2,
        SUBORDER_BILLINGSTAT_AUTHAPPROVED = 3,
        SUBORDER_BILLINGSTAT_AUTHDECLINED = 4,
        SUBORDER_BILLINGSTAT_CHARGING = 5
    } ;

    public enum MessageOutboundInstance
    {
        DSB = 1,
        MAG = 2,
        LENS = 3,
        OTC = 4,
        RX = 5,
        DS_LENS = 6,
        SKU_AGENT = 15,
        PO_AGENT = 17,
        RX_VERIFICATION = 40
    }

    public enum DCType
    {
        NON_SPECIFIC = 0,
        OTC = 1,
        RX = 2,
        BOTH = 3,
        RA_INSTORE = 4,
        MAGAZINE = 5,
        CNS = 7,
        GC = 8,
        IVD = 9,
        OUTDROPSHIP = 10,
        DS_LENS = 11,
        LENS_RX_VERIFICATION = 12,
        OUTDROPSHIP_LENS_RGP = 13,
        OUTDROPSHIP_LENS_CUSTOM_GOGGLE = 14,
        OUTDROPSHIP_LENS_SPECIALTY = 15
    }

    public enum MessageTypes
    {
        //bypass OPS2
        MT_20500 = 20500, //Order request to DC, bypass OPS2	
        MT_20560 = 20560,
        MT_20540 = 20540, //ACLens RxEvent msg to FE
        MT_20600 = 20600, //Ship Request to DC
        MT_20660 = 20660, //Ship response from DC
        MT_20605 = 20605, //Cancel request to DC
        MT_20655 = 20655, //Cancel response from DC
        MT_20950 = 20950, //Order Status message from DC to FE
    }

    public enum FeKeyValueTypes
    {
        KYT_NULL = 0,
        KYT_ACQ_RX_NUM = 1,
        KYT_ORDER_NUM = 2,
        KYT_RA_RX_NUM = 3,
        KYT_EMAIL_ID = 4,
        KYT_SUBORDER_NUM = 5,
        KYT_FE_SCRIPT_ID = 6,
        KYT_DC_PAT_ID = 7,
        KYT_REQ_ID = 8,
        KYT_DC_PAT_INS_ID = 9,
        KYT_DS_PAT_ID = 10,
        KYT_DC_ID = 11,
        KYT_DS_CARD_ID = 12,
        KYT_RA_PAT_ID = 13,
        KYT_DC_CARD_ID = 14,
        KYT_TRANSFER_ID_TYPE = 15,
        KYT_MEMBER_ID = 16,
        KYT_CC_TOKEN = 17,
        KYT_FILL_INDICATOR = 18,
        KYT_AUTH_TYPE = 19,
        KYT_CANCEL_TYPE = 20,
        KYT_SITE_ID = 21,
        KYT_TC_NUM = 22,
        KYT_OFR_TYPE = 23,
        KYT_BATCH_ID = 24,
        KYT_DISPOSITION = 25,
        KYT_MC_NUM = 26,
        KYT_PAY_NUM = 27,
        KYT_PKG_ID = 28,
        KYT_CC_ID = 29,
        KYT_CC_TYPE = 30,
        KYT_LINEITEM_ID = 31,
        KYT_MSG_ID = 32,
        KYT_FAILED_MSGS = 33
    }

    public enum RoutingResultFlag
    {
        SkuNotSetupYet = -1,
        NonMDCRoutingError = -2,
        DropshipSkuAssignToNonDropshipDC = 1,
        NonDropshipSkuAssignToDropshipDC = 2,
        InvalidGroupLogicId = 4,
        ConflictDisasterSetting = 8,
        InvalidInputParameter = 16,
        SiteIdDisallowed = 32,
        DcInDisaster = 64,
        NoSingleDCStockingAllSkus = 128,
        NoPrimaryDCInDeliveryArea = 256,
        NoPrimaryDCInGroup = 512,
        ConfigurationError = 1024,  // all configuration related errors
        NoDcInDeliveryArea = 2048,
    }

    public enum RoutingDiscrepancyFlag
    {
        SkuNotStocked = 1,
        NotEnoughInventory = 2,
        SiteDisallowed = 4,
        DCInDisaster = 8,
    }

    public enum RetryFailureStatus
    {
        RFS_NEW = 1,
        RFS_RETRY = 2,
        RFS_RESOLVED = 3,
        RFS_PROCESSED_WITH_INFO = 4,
        RFS_PROCESSING = 6,
        RFS_REPLACED = 9,
        RFS_RETRY_FAILED = 100,
        RFS_PROCESSED_WITH_ERROR = 101,
    }

    public enum OrderInfoFlag
    {
        ORDERINFO_FLAG_WAIVETAXONSHIPPING = 1,
        ORDERINFO_FLAG_BASE_SHIPPING_UNKNOWN = 2,
        ORDERINFO_FLAG_CSR_ORDER = 4,
        ORDERINFO_FLAG_CSR_ONE_TIME_ORDER = 8,
        ORDERINFO_FLAG_OUTDROPSHIP = 16
    }

    public enum DIVISION
    {
        DIVISION_DS_OTC = 1,
        DIVISION_DS_RX = 2,
        DIVISION_SYNAPSE = 3,
        DIVISION_ACLENS = 4,
        DIVISION_VITAMINADVISOR = 5,
        DIVISION_VISIONDIRECT = 7,
    }

    public enum RoutingQueueStatus
    {
        New = 1,
        Completed = 3,
        CompletedWithWarning = 4,
        Error = 101,
    }

    public enum RoutingType
    {
        NotDefined = 0,
        NewOrder = 1,
        PresellSuborder = 2,
        BackorderSuborder = 3,
        HeldSuborder = 4
    }

    
public enum HoldReasonCodes
{
    //the following are hold reasons that are visible to customers
    //when the suborder is in 'SUBORDERSTAT_HELD' status
	HRC_BAD_CC			= 1,
	HRC_BAD_INSURANCE	= 2,		

    //the following are hold reasons that are not visible to customers
    //when the suborder is in 'SUBORDERSTAT_UNEXPECTED' status
	HRC_BACKORDERED_MTO_ITEM = 5000,
	HRC_PROBLEM_PO_ITEM = 5001,
	HRC_DISCONTINUED_ITEM = 5002,
	HRC_CANCEL_BY_CSR = 5003,
    HRC_ROUTING_FAILURE = 5004
} 


}

