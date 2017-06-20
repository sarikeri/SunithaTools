using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Wag.Oms.OTUWS.ApiContract.Entities;
using Wag.Oms.OTUWS.ApiContract.Interfaces;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.Repositories;

namespace Wag.Oms.OTUWS.ApiImplementation
{
    public class TrackingUpdateHandler : ITrackingUpdateHandler
    {
        public void HandleTrackingUpdateRequest(TrackingUpdateRequest trackingUpdateRequest)
        {
            string errorMessage;
            var validRequest = IsValidRequest(trackingUpdateRequest, out errorMessage);
            if (!validRequest)
            {
                Helper.LogAndThrowLibraryException(null, $"{errorMessage} Client Reference Id: {trackingUpdateRequest.ClientReferenceId}");
            }
            UpdateSuborderPackage(trackingUpdateRequest);
        }

        private void UpdateSuborderPackage(TrackingUpdateRequest trackingUpdateRequest)
        {
            var trackSummary = trackingUpdateRequest.EventData.TrackResponse.TrackSummary;
            var retValue = 0;
            try
            {
                OTUWSLogger.TransactionLog(Constants.OTUWS_TRACE,
                    $"Start: TrackingUpdateHandler.UpdateSuborderPackage for suborder id {trackSummary.OrderId}, tracking id {trackSummary.TrackingId}," +
                        $" reference id {trackingUpdateRequest.ClientReferenceId}");

                using (var transaction = new TransactionScope())
                {
                    retValue = new SuborderPackagesRepository().Update(trackSummary.OrderId, trackSummary.TrackingId, trackSummary.Status, trackSummary.DateTime);
                    transaction.Complete();
                }
                OTUWSLogger.TransactionLog(Constants.OTUWS_TRACE,
                    $"End: TrackingUpdateHandler.UpdateSuborderPackage successful for suborder id {trackSummary.OrderId}, tracking id {trackSummary.TrackingId}," +
                        $" reference id {trackingUpdateRequest.ClientReferenceId}");
                if (retValue <= 0)
                {
                    var message = $"No Data found in suborder_packages for suborder id {trackSummary.OrderId}, tracking id {trackSummary.TrackingId}," +
                            $" reference id {trackingUpdateRequest.ClientReferenceId}";
                    throw new OTUWSException(new KeyNotFoundException(), message);
                }

            }
            catch (OTUWSException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                var message = $"Error while updating suborder_packages for suborder id {trackSummary.OrderId}, tracking id {trackSummary.TrackingId}," +
                            $" reference id {trackingUpdateRequest.ClientReferenceId}";
                Helper.LogAndThrowLibraryException(ex, message);
            }
        }

        private bool IsValidRequest(TrackingUpdateRequest request, out string errorMessage)
        {
            var validTrackingStatuses = ConfigurationManager.AppSettings[Constants.VALID_TRACKING_STATUSES].ToString().ToUpper();
            errorMessage = string.Empty;
            if (!validTrackingStatuses.Split(',').Any(p => p.Trim() == request.EventData.TrackResponse.TrackSummary.Status.ToUpper().Trim()))
            {
                errorMessage = $"Invalid Tracking Status: {request.EventData.TrackResponse.TrackSummary.Status}.";
                return false;
            }

            return true;
        }
    }
}
