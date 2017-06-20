
using Wag.Oms.EGWS.Common;

namespace Wag.Oms.EGWS.RepositoryContracts.Entities
{
    public class EventConfigurationEntity
    {
        public string MessageType { get; set; }
        public int EndPointId { get; set; }
        public EncodingType Encoding { get; set; }
        public bool MsgBodyNotRequired { get; set; }
    }
}
