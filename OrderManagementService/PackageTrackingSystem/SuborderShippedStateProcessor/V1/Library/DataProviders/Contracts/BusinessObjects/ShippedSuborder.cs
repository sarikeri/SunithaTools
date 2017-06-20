using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wag.Oms.SOS.DataProviders.Contracts.BusinessObjects
{
    public class ShippedSuborder
    {
        public string ShippedSubordersId { get; set; }
        public string SuborderId { get; set; }
        public int? PtsStatusId { get; set; }
        public DateTime? PtsNextRetryDate { get; set; }
    }
}
