
using Wag.Oms.OTUWS.ApiContract.Entities;

namespace Wag.Oms.OTUWS.ApiContract.Interfaces
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
