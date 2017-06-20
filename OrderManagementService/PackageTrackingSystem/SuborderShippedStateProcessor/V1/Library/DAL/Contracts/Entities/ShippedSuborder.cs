using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wag.Oms.SOS.DAL.Contracts
{
    public class ShippedSuborder : IDalEntity
    {
        public string ShippedSubordersId { get; set; }
        public string SuborderId { get; set; }
        public int? PtsStatusId { get; set; }
        public DateTime? PtsNextRetryDate { get; set; }
    }
}
