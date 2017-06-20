using System.Collections.Generic;

namespace Wag.Oms.EGWS.RepositoryContracts.Interfaces
{
    public interface IDalBaseRepository<T>
    {
        IEnumerable<T> Get();
    }
}
