using System;

namespace Wag.Oms.OTUWS.ApiContract.Entities
{
    public class TrackingUpdateRequest
    {
        public EventData EventData { get; set; }
        public string ClientReferenceId { get; set; }
    }

    public class EventData
    {
        public string EventType { get; set; }
        public DateTime EventTimestamp { get; set; }
        public int ClientId { get; set; }
        public TrackResponse TrackResponse { get; set; }
    }
    public class TrackResponse
    {
        public TrackSummary TrackSummary { get; set; }
        public TrackEvent[] TrackEvents { get; set; }
    }

    public class TrackSummary
    {
        public int SiteId { get; set; }
        public string OrderId { get; set; }
        public DateTime ShippingDateTime { get; set; }
        public string CarrierId { get; set; }
        public string TrackingId { get; set; }
        public string Status { get; set; }
        public string CarrierStatus { get; set; }
        public DateTime DateTime { get; set; }
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
        public string ZipCode { get; set; }
    }
}
