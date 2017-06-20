using Wag.Oms.EGWS.RepositoryContracts.Entities;

namespace Wag.Oms.EGWS.RepositoryContracts.Interfaces
{
    public interface IEventOutboundRepository
    {
        void Add(EventOutboundEntity eventOutboundEntity);
    }
}
