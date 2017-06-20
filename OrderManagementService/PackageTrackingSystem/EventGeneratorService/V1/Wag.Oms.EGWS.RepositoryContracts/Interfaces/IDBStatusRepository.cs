using System;

namespace Wag.Oms.EGWS.RepositoryContracts.Interfaces
{
    public interface IDBStatusRepository
    {
        DateTime GetCurrentDBDate();
    }
}
