using System;
using System.Diagnostics;
using System.Web.Http;
using Wag.Oms.OTUWS.ApiImplementation;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.Classes;
using Wag.Oms.OTUWS.Models;
using Wag.Oms.OTUWS.Models.Common;
using Mapper = AutoMapper.Mapper;

namespace Wag.Oms.OTUWS.Controllers
{
    public class HeartbeatController : ApiController
    {
        // GET api/heartbeat
        /// <summary>
        /// Get: Checking service/db health status
        /// </summary>
        /// <returns>Heartbeat object</returns>
        public Heartbeat Get()
        {
            var response = new Heartbeat();
            try
            {
                var heartBeat = new HeartbeatManager().Get();
                Mapper.Initialize(x => x.CreateMap<ApiContract.Entities.Heartbeat, Heartbeat>());
                response = Mapper.Map<ApiContract.Entities.Heartbeat, Heartbeat>(heartBeat);
                response.ServiceStatus = response.IsDBReachable ? ServiceStatus.Ok.ToString() : ServiceStatus.NotOk.ToString();
            }
            catch (Exception ex)
            {
                var otswsException = ex as OTUWSException;
                if (otswsException != null)
                {
                    response.ErrorMessage = otswsException.ErrorMessage;
                }
                else
                {
                    response.ErrorMessage = Constants.UNHANDLED_EXCEPTION_MESSAGE;
                    ServiceLogHandler.ExceptionLog(ServiceConstants.ServiceException, ex, "Exception Caught: ");
                }
                ServiceLogHandler.WindowEventLog(ServiceConstants.WindowEvent, ServiceEventId.Error, TraceEventType.Error, ex, "Exception caught: ", true);
            }

            return response;
        }
    }
}