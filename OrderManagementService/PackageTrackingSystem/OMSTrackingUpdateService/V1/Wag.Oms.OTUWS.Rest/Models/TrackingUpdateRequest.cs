using System;
using System.ComponentModel.DataAnnotations;
using Wag.Oms.OTUWS.Models.Common;

namespace Wag.Oms.OTUWS.Models
{
    public class TrackingUpdateRequest : ITrackingUpdateRequest
    {
        [Required]
        public EventData EventData { get; set; }
        [StringLength(32)]
        public string ClientReferenceId { get; set; }
    }

    public class EventData
    {
        [Required]
        public string EventType { get; set; }
        [Required]
        public DateTime EventTimestamp { get; set; }
        [Required]
        public int ClientId { get; set; }
        [Required]
        public TrackResponse TrackResponse { get; set; }
    }
    public class TrackResponse
    {
        [Required]
        public TrackSummary TrackSummary { get; set; }
        public TrackEvent[] TrackEvents { get; set; }
    }

    public class TrackSummary
    {
        [Required]
        public int SiteId { get; set; }
        [Required]
        [StringLength(32)]
        public string OrderId { get; set; }
        [Required]
        public DateTime ShippingDateTime { get; set; }
        [Required]
        [StringLength(32)]
        public string CarrierId { get; set; }
        [Required]
        [StringLength(32)]
        public string TrackingId { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string CarrierStatus { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        [Required]
        public Location Location { get; set; }
    }

    public class TrackEvent
    {
        public string Event { get; set; }
        public DateTime DateTime { get; set; }
        public Location Location { get; set; }
    }

    public class Location
    {
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        [StringLength(20)]
        public string ZipCode { get; set; }
    }
}