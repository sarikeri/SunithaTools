using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wag.Oms.OTUWS.ApiContract.Entities;

namespace Wag.Oms.OTUWS.ApiContract.Interfaces
{
    public interface ITrackingUpdateHandler
    {
        void HandleTrackingUpdateRequest(TrackingUpdateRequest trackingUpdateRequest);
    }
}
