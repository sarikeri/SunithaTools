
using Wag.Oms.EGWS.RepositoryContracts.Entities;

namespace Wag.Oms.EGWS.RepositoryContracts.Interfaces
{
    public interface IEventConfigurationRepository
    {
        EventConfigurationEntity Get(string eventName, int siteId, int clientId);
    }
}
