using System.Collections.Generic;
using Wag.Oms.SOS.DataProviders.Contracts.BusinessObjects;

namespace Wag.Oms.SOS.DataProviders.Contracts
{
    public interface ISuborderProvider
    {
        string ConnectionString { get; set; }

        List<Suborder> GetShippedSuborders();
    }
}
