using System;

namespace Wag.Oms.SOS.DAL.Contracts
{
    public class Suborder : IDalEntity
    {
        public long? SiteId { get; set; }
        public string OrderId { get; set; }
        public string SuborderId { get; set; }
        public string ShippingCarrierId { get; set; }
        public string ShippingTrackingInfo { get; set; }
        public DateTime? ShippedDate { get; set; }
        public string ShipZip { get; set; }
        public string SecondarySubscribingClientids { get; set; }
    }
}
