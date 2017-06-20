using System;

namespace Wag.Oms.EGWS.Models.Common
{
    interface IEventGenerationResponse
    {
        int ResultCode { get; set; }
        string FailureDescription { get; set; }
        string ResponseTimestamp { get; set; }
        string ClientReferenceId { get; set; }
    }
}
