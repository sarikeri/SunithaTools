using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Wag.Oms.EGWS.Models.Common;
using Wag.Oms.EGWS.ValidationAttributes;

namespace Wag.Oms.EGWS.Models
{ 
    public class EventGenerationRequest : IEventGenerationRequest
    {
        [Required]
        [RegularExpression(@"[0-9]{1,4}", ErrorMessage = "Client Id must be a number up to a max of 4 digits")]
        public string ClientId { get; set; }
        [Required]
        [RegularExpression(@"[0-9]{1,4}", ErrorMessage = "Site Id must be a number up to a max of 4 digits")]
        public string SiteId { get; set; }
        [Required]
        [StringLength(128)]
        public string KeyValue1 { get; set; }
        [StringLength(128)]
        public string KeyValue2 { get; set; }
        [Required]
        [StringLength(32)]
        public string EventName { get; set; }
        public string EventData { get; set; }
        [NumericCollection(AllowNull = true)]
        public List<string> SecondarySubscribingClientIds { get; set; }
        [StringLength(32)]
        public string ClientReferenceId { get; set; }
    }
}