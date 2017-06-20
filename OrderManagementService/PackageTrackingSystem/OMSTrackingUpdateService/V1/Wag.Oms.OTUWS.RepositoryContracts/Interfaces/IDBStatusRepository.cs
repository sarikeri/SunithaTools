using System;

namespace Wag.Oms.OTUWS.RepositoryContracts.Interfaces
{
    public interface IDBStatusRepository
    {
        DateTime GetCurrentDBDate();
    }
}
