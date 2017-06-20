using System;
using System.Collections.Generic;
using Wag.Oms.SOS.Logging;

namespace Wag.Oms.SOS.Handler
{
    public class Response
    {
        public Response() { }

        public int ClientId { get; set; }
        public string ClientRequestReferenceId { get; set; }
        public short ResultCode { get; set; }
        public DateTime ResponseTimestamp { get; set; }
        public string FailureDescription { get; set; }
        public List<FailedPackageDetail> FailedPackageDetails { get; set; }
    }

    public class FailedPackageDetail
    {
        public int? ClientId { get; set; }
        public long? SiteId { get; set; }
        public string OrderId { get; set; }
        public DateTime? ShippingDateTime { get; set; }
        public string CarrierId { get; set; }
        public string TrackingId { get; set; }
        public string FailureDescription { get; set; }
    }
}
