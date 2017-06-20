
using Wag.Oms.EGWS.ApiContract.Entities;

namespace Wag.Oms.EGWS.ApiContract.Interfaces
{
    public interface IHeartbeatManager
    {
        /// <summary>
        /// Gets the service health information
        /// </summary>
        /// <returns>Heartbeat object</returns>
        Heartbeat Get();
    }
}
