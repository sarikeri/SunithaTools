using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wag.Oms.OTUWS.RepositoryContracts.Entities
{
    public class SuborderPackagesEntity
    {
        public string SuborderId { get; set; }
        public string PackageId { get; set; }
        public decimal? Weight { get; set; }
        public string TrackingNumber { get; set; }
        public string PickupNumber { get; set; }
        public decimal? ShippingCost { get; set; }
        public DateTime? DbInsertDt { get; set; }
        public DateTime? DbUpdateDt { get; set; }
        public DateTime? EstimatedArrivalDate { get; set; }
        public string StoreReceivingBarcode { get; set; }
        public string TrackingStatus { get; set; }
        public DateTime? TrackingDate { get; set; }
    }
}
