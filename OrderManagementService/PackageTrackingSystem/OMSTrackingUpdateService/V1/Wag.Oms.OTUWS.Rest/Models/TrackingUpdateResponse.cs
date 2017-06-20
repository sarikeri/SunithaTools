using Wag.Oms.OTUWS.Models.Common;

namespace Wag.Oms.OTUWS.Models
{
    public class TrackingUpdateResponse : ITrackingUpdateResponse
    {
        public int ResultCode { get; set; }
        public string FailureDescription { get; set; }
        public string ResponseTimestamp { get; set; }
        public string ClientReferenceId { get; set; }
    }
}