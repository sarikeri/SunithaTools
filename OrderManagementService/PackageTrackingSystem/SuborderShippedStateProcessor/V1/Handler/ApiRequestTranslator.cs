using System;
using System.Collections.Generic;
using System.Linq;
using Wag.Oms.SOS.DataProviders.Contracts.BusinessObjects;
using Wag.Oms.SOS.Logging;

namespace Wag.Oms.SOS.Handler
{
    public class Request
    {
        public Request() { }
        public int ClientId { get; set; }
        public string ClientRequestReferenceId { get; set; }
        public List<PackageDetails> PackageDetails { get; set; }
    }

    public class PackageDetails
    {
        public long? SiteId { get; set; }
        public string OrderId { get; set; }
        public string ShippingDateTime { get; set; }
        public string CarrierId { get; set; }
        public string TrackingId { get; set; }
        public string[] SecondarySubscribingClientIds { get; set; }
        public string DestinationZipCode { get; set; }

    }

    public static class ApiRequestTranslator
    {
        /// <summary>
        /// Maps the Object Object to Package Tracking Service
        /// </summary>
        /// <param name="suborders">Order</param>
        /// <param name="subscribingClientId">Order</param>
        /// <returns>Request</returns>
        public static Request MapSuborderToApiRequest(List<Suborder> suborders, int subscribingClientId)
        {
            Logger.Log(LogLevel.Verbose, new LogBag(), "ApiRequestTranslator.MapSuborderToApiRequest: Starts");

            var requestObj = new Request();


            try
            {
                requestObj.ClientId = subscribingClientId;
                requestObj.ClientRequestReferenceId = suborders.First().SuborderId; //Guid.NewGuid().ToString("N");
                requestObj.PackageDetails = new List<PackageDetails>();
                foreach (var packageDetail in suborders.Select(suborder => new PackageDetails()
                {
                    CarrierId = suborder.ShippingCarrierId,
                    DestinationZipCode = suborder.ShipZip,
                    OrderId = suborder.SuborderId,
                    SecondarySubscribingClientIds = suborder.SecondarySubscribingClientids == null ? null : suborder.SecondarySubscribingClientids.Split(',').Distinct().ToArray(),
                    ShippingDateTime = suborder.ShippedDate == null ? null : Convert.ToDateTime(suborder.ShippedDate).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    SiteId = suborder.SiteId,
                    TrackingId = suborder.ShippingTrackingInfo
                }))
                {
                    requestObj.PackageDetails.Add(packageDetail);
                }

            }
            catch (Exception ex)
            {
                Logger.LogAndThrow(ex, LogLevel.Error, new LogBag().AddToBag(ex),
                    string.Format("ApiRequestTranslator.MapSuborderToApiRequest: Exception caught"));
            }
            Logger.Log(LogLevel.Verbose, new LogBag(), "ApiRequestTranslator.MapSuborderToApiRequest: Ends");

            return requestObj;
        }

    }
}
