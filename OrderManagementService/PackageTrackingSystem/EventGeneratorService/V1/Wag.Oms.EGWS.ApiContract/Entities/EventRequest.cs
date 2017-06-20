using System.Collections.Generic;

namespace Wag.Oms.EGWS.ApiContract.Entities
{
    public class EventRequest
    {
        public int ClientId { get; set; }
        public int SiteId { get; set; }
        public string KeyValue1 { get; set; }
        public string KeyValue2 { get; set; }
        public string EventName { get; set; }
        public string EventData { get; set; }
        public string ClientReferenceId { get; set; }
        public List<int> SecondarySubscribingClientIds { get; set; }
    }
}
