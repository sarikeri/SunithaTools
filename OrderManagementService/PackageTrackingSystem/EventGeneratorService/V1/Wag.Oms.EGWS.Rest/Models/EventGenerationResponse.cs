using Wag.Oms.EGWS.Models.Common;

namespace Wag.Oms.EGWS.Models
{
    public class EventGenerationResponse : IEventGenerationResponse
    {
        public int ResultCode { get; set; }
        public string FailureDescription { get; set; }
        public string ResponseTimestamp { get; set; }
        public string ClientReferenceId { get; set; }
    }
}