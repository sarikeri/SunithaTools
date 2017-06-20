using System;
using Wag.Oms.EGWS.ApiContract.Entities;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.Repositories;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.EGWS.ApiImplementation
{
    public class HeartbeatManager
    {
        /// <summary>
        /// Gets the service health information
        /// </summary>
        /// <returns>Heartbeat object</returns>
        public Heartbeat Get()
        {
            var heartBeat = new Heartbeat {ServerTime = DateTime.Now.ToMilitaryFormat()};

            try
            {
                IDBStatusRepository statusProvider = new DBStatusRepository();
                var currentDate = statusProvider.GetCurrentDBDate();
                heartBeat.IsDBReachable = currentDate != default(DateTime);
            }
            catch (Exception ex)
            {
                EGWSLogger.ExceptionLog(Constants.EGWS_LIBRARY_EXCEPTION, ex, Constants.SERVICE_COULD_NOT_CONNECT_TO_DATABASE);
                heartBeat.IsDBReachable = false;
            }

            if (!heartBeat.IsDBReachable)
            {
                heartBeat.ErrorMessage = Constants.SERVICE_COULD_NOT_CONNECT_TO_DATABASE;
            }

            return heartBeat;
        }
    }
}
