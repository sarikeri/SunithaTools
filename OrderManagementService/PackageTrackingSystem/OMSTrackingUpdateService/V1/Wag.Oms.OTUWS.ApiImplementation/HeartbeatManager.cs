using System;
using Wag.Oms.OTUWS.ApiContract.Entities;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.Repositories;
using Wag.Oms.OTUWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.OTUWS.ApiImplementation
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
                OTUWSLogger.ExceptionLog(Constants.OTUWS_LIBRARY_EXCEPTION, ex, Constants.SERVICE_COULD_NOT_CONNECT_TO_DATABASE);
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
