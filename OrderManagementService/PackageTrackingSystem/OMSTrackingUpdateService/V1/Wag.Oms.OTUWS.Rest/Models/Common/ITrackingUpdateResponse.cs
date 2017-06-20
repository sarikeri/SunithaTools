using System;

namespace Wag.Oms.OTUWS.Models.Common
{
    interface ITrackingUpdateResponse
    {
        int ResultCode { get; set; }
        string FailureDescription { get; set; }
        string ResponseTimestamp { get; set; }
        string ClientReferenceId { get; set; }
    }
}
