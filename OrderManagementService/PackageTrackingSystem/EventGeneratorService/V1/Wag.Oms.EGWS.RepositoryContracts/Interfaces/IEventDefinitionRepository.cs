using System.Collections.Generic;
using Wag.Oms.EGWS.RepositoryContracts.Entities;

namespace Wag.Oms.EGWS.RepositoryContracts.Interfaces
{
    public interface IEventDefinitionRepository
    {
        IEnumerable<EventDefinitionEntity> Get();
    }
}
