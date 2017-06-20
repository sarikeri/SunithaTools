using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wag.Oms.SOS.DataProviders.Contracts
{
    public interface IShippedSuborderProvider
    {
        string ConnectionString { get; set; }

        int UpdateStatus(string suborderId, int ptsStatusId);
        int UpdatePtsNextRetryDate(string suborderId, DateTime ptsNextRetryDate);
        bool TryLocking(string id, int ptsStatusId);
    }
}
