using Wag.Oms.EGWS.RepositoryContracts.Entities;

namespace Wag.Oms.EGWS.RepositoryContracts.Interfaces
{
    public interface IEventOutboundDataRepository
    {
        void Add(EventOutboundDataEntity eventOutboundDataEntity);
    }
}
