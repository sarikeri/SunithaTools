using System.Collections.Generic;

namespace Wag.Oms.SOS.DAL.Contracts
{
    public interface ISuborderLoader
    {
        string ConnectionString { get; set; }

        List<Suborder> GetShippedSuborders();
    }
}
