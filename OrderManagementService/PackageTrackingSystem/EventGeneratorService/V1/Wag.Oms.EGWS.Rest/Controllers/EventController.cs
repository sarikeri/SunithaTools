using System;
using System.Diagnostics;
using System.Web.Http;
using Wag.Oms.EGWS.ApiImplementation;
using Wag.Oms.EGWS.Classes;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.Models;
using Wag.Oms.EGWS.Models.Common;
using System.Collections.Generic;

namespace Wag.Oms.EGWS.Controllers
{
    public class EventController : ApiController
    {
        [ValidateAndLogAction]
        public EventGenerationResponse Post([FromBody]EventGenerationRequest request)
        {
            if (request == null)
            {
                throw new EGWSException(null, Constants.INVALID_REQUEST_MESSAGE);
            }

            var response = new EventGenerationResponse
            {
                ClientReferenceId = request.ClientReferenceId,
                ResultCode = (int)ResultCode.Success,
            };

            try
            {
                var eventGenerationHandler = new EventGenerationHandler();
                ApiContract.Entities.EventRequest apiEventRequest = new ApiContract.Entities.EventRequest
                {
                    ClientId = Convert.ToInt32(request.ClientId),
                    ClientReferenceId = request.ClientReferenceId,
                    EventData = request.EventData,
                    EventName = request.EventName,
                    KeyValue1 = request.KeyValue1,
                    KeyValue2 = request.KeyValue2,
                    SiteId = Convert.ToInt32(request.SiteId),
                    SecondarySubscribingClientIds = new List<int>()
                };
                if (request.SecondarySubscribingClientIds != null)
                {
                    foreach (var clientId in request.SecondarySubscribingClientIds)
                    {
                        apiEventRequest.SecondarySubscribingClientIds.Add(Convert.ToInt32(clientId));
                    }
                }
                
                eventGenerationHandler.HandleEventGenerationRequest(apiEventRequest);
            }
            catch (Exception ex)
            {
                response.ResultCode = Constants.ERROR_CODE;
                var egwsException = ex as EGWSException;
                if (ex is EGWSException)
                {
                    response.FailureDescription = egwsException.ErrorMessage;
                }
                else
                {
                    response.FailureDescription = Constants.UNHANDLED_EXCEPTION_MESSAGE;
                    ServiceLogHandler.ExceptionLog(ServiceConstants.ServiceException, ex, "Exception Caught: ");
                }
                ServiceLogHandler.WindowEventLog(ServiceConstants.WindowEvent, ServiceEventId.Error, TraceEventType.Error, ex, "Exception caught: ", true);
            }

            response.ResponseTimestamp = DateTime.Now.ToMilitaryFormat();
            return response;
        }
    }
}
