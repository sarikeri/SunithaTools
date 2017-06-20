
namespace Wag.Oms.EGWS.RepositoryContracts.Entities
{
    public class EventOutboundEntity
    {
        public string MessageId { get; set; }
        public string MessageType { get; set; }
        public int StatusId { get; set; }
        public int RetryCount { get; set; }
        public string KeyValue1 { get; set; }
        public string KeyValue2 { get; set; }
        public int RequestEndPointId { get; set; }
    }
}
