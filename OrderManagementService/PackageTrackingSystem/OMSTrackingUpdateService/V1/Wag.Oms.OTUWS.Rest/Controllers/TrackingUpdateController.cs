using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Wag.Oms.OTUWS.ApiContract.Interfaces;
using Wag.Oms.OTUWS.ApiImplementation;
using Wag.Oms.OTUWS.Classes;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.Models;
using Wag.Oms.OTUWS.Models.Common;
using Mapper = AutoMapper.Mapper;

namespace Wag.Oms.OTUWS.Controllers
{
    public class TrackingUpdateController : ApiController
    {
        [ValidateAndLogAction]
        public TrackingUpdateResponse Post([FromBody]TrackingUpdateRequest request)
        {
            if (request == null)
            {
                throw new OTUWSException(null, Constants.INVALID_REQUEST_MESSAGE);
            }
            var response = new TrackingUpdateResponse
            {
                ClientReferenceId = request.ClientReferenceId,
                ResultCode = (int)ResultCode.Success,
            };

            try
            {
                ITrackingUpdateHandler trackingUpdateHandler = new TrackingUpdateHandler();
                Mapper.Initialize(x =>
                {
                    x.CreateMap<TrackingUpdateRequest, ApiContract.Entities.TrackingUpdateRequest>();
                    x.CreateMap<EventData, ApiContract.Entities.EventData>();
                    x.CreateMap<TrackResponse, ApiContract.Entities.TrackResponse>();
                    x.CreateMap<TrackSummary, ApiContract.Entities.TrackSummary>();
                    x.CreateMap<TrackEvent, ApiContract.Entities.TrackEvent>();
                    x.CreateMap<Location, ApiContract.Entities.Location>();
                }
                );
                var trackingUpdateRequest = Mapper.Map<TrackingUpdateRequest, ApiContract.Entities.TrackingUpdateRequest>(request);
                trackingUpdateHandler.HandleTrackingUpdateRequest(trackingUpdateRequest);
            }
            catch (Exception ex)
            {
                response.ResultCode = Constants.ERROR_CODE;
                var otuwsException = ex as OTUWSException;
                if (ex is OTUWSException)
                {
                    response.FailureDescription = otuwsException.ErrorMessage;
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
