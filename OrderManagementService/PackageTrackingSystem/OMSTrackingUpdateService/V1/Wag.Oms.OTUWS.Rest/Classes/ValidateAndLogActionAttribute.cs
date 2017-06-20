using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.Models.Common;

namespace Wag.Oms.OTUWS.Classes
{
    public class ValidateAndLogActionAttribute : ActionFilterAttribute
    {
        private static bool requestTraceLog = Convert.ToBoolean(System.Web.Configuration.WebConfigurationManager.AppSettings["requestTraceLog"]);
        private DateTime requestTimestamp;

        /// <summary>
        /// Logs trace before starting execution of an Action. Also handles validation errors.
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            requestTimestamp = DateTime.Now;

            string friendlyName = GetFriendlyName(actionContext);

            actionContext.ActionArguments["ValidateAndLogActionAttribute_requestTimestamp"] = requestTimestamp;

            string referenceId = GetReferenceId(actionContext);

            if (requestTraceLog)
            {
                string logMsg = string.Format("{0} Start: reference id {1}", friendlyName, referenceId);
                ServiceLogHandler.HeaderLog(ServiceConstants.ServiceTrace, ServiceEventId.Information, TraceEventType.Information, logMsg, true);
            }

            HandleModelValidationErrors(actionContext, referenceId);

        }

        /// <summary>
        /// Logs trace after the execution of an Action. Also handles any unhandled exceptions. Creates a activity log entry in database.
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception != null)
            {
                if (actionExecutedContext.Exception is InternalServerException)
                    HandleInternalServerException(actionExecutedContext);
                else HandleException(actionExecutedContext);
            }

            string friendlyName = GetFriendlyName(actionExecutedContext.ActionContext);

            string referenceId = GetReferenceId(actionExecutedContext.ActionContext);
            if (requestTraceLog)
            {
                string logMsg = string.Format("{0} End: reference id {1}", friendlyName, referenceId);
                ServiceLogHandler.HeaderLog(ServiceConstants.ServiceTrace, ServiceEventId.Information, TraceEventType.Information, logMsg, false);
            }
        }

        /// <summary>
        /// Handles model validation errors
        /// </summary>
        /// <param name="actionContext"></param>
        /// <param name="referenceId"></param>
        private void HandleModelValidationErrors(HttpActionContext actionContext, string referenceId)
        {
            if (!actionContext.ModelState.IsValid)
            {
                string errorMessage = string.Join(Environment.NewLine, actionContext.ModelState.Select(keyValue => keyValue.Key + " : " + string.Join(Environment.NewLine, keyValue.Value.Errors.Select(e => e.ErrorMessage + (e.Exception != null ? "Exception: " + e.Exception.Message : "")).ToList())).ToList());

                string friendlyName = GetFriendlyName(actionContext);

                ITrackingUpdateResponse actionResponse = BuildErrorResponse(actionContext, errorMessage);
                actionContext.Response =
                    actionContext.Request.CreateResponse(System.Net.HttpStatusCode.OK);
                actionContext.Response.Content = GetObjectContent(actionContext.Request, actionResponse);
                ServiceLogHandler.ExceptionLog(ServiceConstants.ServiceException, new ArgumentException(errorMessage), "Exception Caught: ");
                ServiceLogHandler.WindowEventLog(ServiceConstants.WindowEvent, ServiceEventId.Error, TraceEventType.Error, new ArgumentException(errorMessage), "Exception caught: ", true);
                if (requestTraceLog)
                {
                    string logMsg = string.Format("{0} End: reference id {1}", friendlyName, referenceId);
                    ServiceLogHandler.HeaderLog(ServiceConstants.ServiceTrace, ServiceEventId.Information, TraceEventType.Information, logMsg, false);
                }
            }
        }

        // Manual content negotiation
        private HttpContent GetObjectContent(HttpRequestMessage requestMessage, ITrackingUpdateResponse actionResponse)
        {
            if ((string.IsNullOrEmpty(requestMessage.Headers.Accept.ToString())
                    && requestMessage.Content.Headers.ContentType.MediaType.ToLower().Contains("xml"))
                || requestMessage.Headers.Accept.ToString().ToLower().Contains("xml"))
            {
                return new ObjectContent(actionResponse.GetType(), actionResponse, new XmlMediaTypeFormatter());
            }
            return new ObjectContent(actionResponse.GetType(), actionResponse, new JsonMediaTypeFormatter());
        }

        /// <summary>
        /// Handles any unhandled exceptions occured during execution of an action
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        private void HandleException(HttpActionExecutedContext actionExecutedContext)
        {
            string errorMessage = (actionExecutedContext.Exception is OTUWSException) ? ((OTUWSException)(actionExecutedContext.Exception)).ErrorMessage : actionExecutedContext.Exception.Message;
            ITrackingUpdateResponse actionResponse = BuildErrorResponse(actionExecutedContext.ActionContext, errorMessage);
            actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(System.Net.HttpStatusCode.OK, actionResponse);
            ServiceLogHandler.ExceptionLog(ServiceConstants.ServiceException, actionExecutedContext.Exception, "Exception Caught: ");
            ServiceLogHandler.WindowEventLog(ServiceConstants.WindowEvent, ServiceEventId.Error, TraceEventType.Error, actionExecutedContext.Exception, "Exception caught: ", true);
        }

        /// <summary>
        /// Handles a 500 internal error thrown by the service.
        /// This is to handle a special case where the requirement itself is to throw a 500 error when something goes wrong.
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        private void HandleInternalServerException(HttpActionExecutedContext actionExecutedContext)
        {
            string errorMessage = (actionExecutedContext.Exception is InternalServerException) ? ((InternalServerException)(actionExecutedContext.Exception)).ErrorMessage : actionExecutedContext.Exception.Message;
            ITrackingUpdateResponse actionResponse = BuildErrorResponse(actionExecutedContext.ActionContext, errorMessage);
            actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(System.Net.HttpStatusCode.InternalServerError, actionResponse);
        }

        private string GetReferenceId(HttpActionContext actionContext)
        {
            object value;
            string referenceId = "";
            if (actionContext.Request.Method == HttpMethod.Get)
            {
                if (actionContext.ActionArguments.TryGetValue("clientReferenceId", out value))
                {
                    referenceId = value as string;
                }
            }
            else if (actionContext.Request.Method == HttpMethod.Post || actionContext.Request.Method == HttpMethod.Put)
            {
                foreach (KeyValuePair<string, object> argument in actionContext.ActionArguments)
                {
                    if (argument.Value is ITrackingUpdateRequest)
                    {
                        var request = (ITrackingUpdateRequest)argument.Value;
                        referenceId = request.ClientReferenceId;
                    }
                }
            }
            return referenceId;
        }

        private ITrackingUpdateResponse BuildErrorResponse(HttpActionContext actionContext, string errorMessage)
        {
            object response = Activator.CreateInstance(actionContext.ActionDescriptor.ReturnType);
            var actionResponse = response as ITrackingUpdateResponse;

            if (actionContext.Request.Method == HttpMethod.Post || actionContext.Request.Method == HttpMethod.Put)
            {
                object requestObject;
                if (actionContext.ActionArguments.TryGetValue("request", out requestObject))
                {
                    if (requestObject is ITrackingUpdateRequest)
                    {
                        ITrackingUpdateRequest request = (ITrackingUpdateRequest)requestObject;
                        actionResponse.ClientReferenceId = request.ClientReferenceId;
                    }
                }
            }
            actionResponse.ResponseTimestamp = DateTime.Now.ToMilitaryFormat();
            actionResponse.ResultCode = Constants.ERROR_CODE;
            actionResponse.FailureDescription = errorMessage;

            return actionResponse;
        }

        private string GetFriendlyName(HttpActionContext actionContext)
        {
            string actionName = actionContext.ActionDescriptor.ActionName;
            string controllerName = actionContext.ActionDescriptor.ControllerDescriptor.ControllerName;

            string friendlyName = "";
            MapControllerActionToFriendlyName.TryGetValue(controllerName + "_" + actionName, out friendlyName);
            return friendlyName;
        }

        private static readonly IDictionary<string, string> MapControllerActionToFriendlyName
          = new Dictionary<string, string>
                  {
                    {"Event_Post","TrackingUpdate"}
                  };
    }
}