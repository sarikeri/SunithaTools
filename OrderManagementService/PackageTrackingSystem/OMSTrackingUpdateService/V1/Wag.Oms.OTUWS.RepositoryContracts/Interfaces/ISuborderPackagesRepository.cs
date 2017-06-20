using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wag.Oms.OTUWS.RepositoryContracts.Interfaces
{
    public interface ISuborderPackagesRepository
    {
        int Update(string suborderId, string trackingNumber, string trackingStatus, DateTime trackingDate);
    }
}
