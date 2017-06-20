using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading;
using System.Transactions;
using System.Web.Script.Serialization;
using Wag.Oms.SOS.Common;
using Wag.Oms.SOS.DataProviders.Common;
using Wag.Oms.SOS.DataProviders.Contracts;
using Wag.Oms.SOS.DataProviders.Contracts.BusinessObjects;
using Wag.Oms.SOS.Logging;
using Constants = Wag.Oms.SOS.Common.Constants;

namespace Wag.Oms.SOS.Handler
{
    public class SuborderShippedStateProcessorHandler
    {
        public bool HasNoNewRecords { get; private set; }

        private static bool _shouldTerminate;
        private readonly string ConString;
        private readonly ISuborderProvider SuborderProvider;
        private readonly IShippedSuborderProvider ShippedSuborderProvider;
        private readonly string UrlWebApi;
        private readonly int ServiceTimedOut;
        private readonly int SubscribingClientId;
        private readonly int RetryDelay;
        private readonly string AllowedPTSCarrierIds;
        private readonly string DisAllowedPTSSiteIds;

        #region Constructor

        public SuborderShippedStateProcessorHandler()
        {
            try
            {
                if (ConfigurationManager.ConnectionStrings[Constants.OdsDb] != null)
                {
                    ConString = ConfigurationManager.ConnectionStrings[Constants.OdsDb].ConnectionString;
                }
                UrlWebApi = ConfigurationManager.AppSettings[Constants.UrlWebApi];
                ServiceTimedOut = ConfigurationManager.AppSettings[Constants.ServerConnectionTimeout] != null ? Convert.ToInt32(ConfigurationManager.AppSettings[Constants.ServerConnectionTimeout]) : Constants.DefaultServerConnectionTimeout;
                SubscribingClientId = ConfigurationManager.AppSettings[Constants.SubscribingClientId] != null ? Convert.ToInt32(ConfigurationManager.AppSettings[Constants.SubscribingClientId]) : Constants.DefaultSubscribingClientId;
                RetryDelay = ConfigurationManager.AppSettings[Constants.RetryDelay] != null ? Convert.ToInt32(ConfigurationManager.AppSettings[Constants.RetryDelay]) : Constants.DefaultRetryDelay;
                AllowedPTSCarrierIds = ConfigurationManager.AppSettings[Constants.AllowedPTSCarrierIds];
                DisAllowedPTSSiteIds = ConfigurationManager.AppSettings[Constants.DisAllowedPTSSiteIds];

                SuborderProvider = Container.Resolve<ISuborderProvider>();
                SuborderProvider.ConnectionString = ConString;

                ShippedSuborderProvider = Container.Resolve<IShippedSuborderProvider>();
                ShippedSuborderProvider.ConnectionString = ConString;
            }
            catch (Exception ex)
            {
                // log the error and throw exception
                var errorText = string.Concat("Exception at SuborderShippedStateProcessorHandler.SuborderShippedStateProcessorHandler: ", ex.Message);
                Logger.LogAndThrow(ex, LogLevel.Error, new LogBag(), string.Format("{0}. Thread Name {1}", errorText, Thread.CurrentThread.Name));
            }
        }

        #endregion

        #region PublicMethods

        /// <summary>
        /// This method fetches and processes the 'New' orders
        /// </summary>
        /// <param name="cancellationTokenSource"></param>
        public void ProcessShippedOrders(CancellationTokenSource cancellationTokenSource)
        {
            try
            {
                Logger.Log(LogLevel.Verbose, new LogBag(), string.Format("Getting shipped orders from database."));

                var shippedSuborders = SuborderProvider.GetShippedSuborders();

                if (shippedSuborders != null && shippedSuborders.Count > 0)
                {
                    HasNoNewRecords = false;

                    var distinctSuborderIdList = shippedSuborders.Select(s => s.SuborderId).Distinct().ToList();
                    foreach (var suborderId in distinctSuborderIdList)
                    {
                        var isFailedAnyPackage = false;
                        // If there is a signal to terminate, it is likely that the service was stopped. Do not process any more suborders.
                        if (_shouldTerminate)
                        {
                            cancellationTokenSource.Cancel(false);
                            HasNoNewRecords = true;
                            Logger.Log(LogLevel.Verbose, new LogBag(), "Current suborder processing complete. Signaling to exit.");
                            return;
                        }

                        using (var transaction = new TransactionScope())
                        {
                            // Try to lock the record in shipped_suborders table. If it succeeds, proceed with processing
                            var isLocked = ShippedSuborderProvider.TryLocking(suborderId, (int)PTSStatus.New);
                            if (isLocked)
                            {
                                var shippedSuborderPackages = shippedSuborders.Where(c => c.SuborderId == suborderId).ToList();

                                //Checking if Carriers are in configured list and site ids are not in disallowed list
                                if (AllowedPTSCarrierIds.Split(',').Any(p => p.Trim().ToUpper() == shippedSuborderPackages.First().ShippingCarrierId.Trim().ToUpper()) && !DisAllowedPTSSiteIds.Split(',').Any(p => p.Trim() == shippedSuborderPackages.First().SiteId.ToString()))
                                {
                                    // Build input object required for api service.
                                    var request = ApiRequestTranslator.MapSuborderToApiRequest(shippedSuborderPackages, SubscribingClientId);
                                    var bodyString = new JavaScriptSerializer().Serialize(request);


                                    Logger.Log(LogLevel.Information, new LogBag(), string.Format("SuborderShippedStateProcessorHandler.ProcessShippedOrders: Started Processing for suborderId {0}", suborderId));

                                    Response response = null;
                                    //call web service to do fraud check
                                    var result = HTTPHelper.Post(UrlWebApi, bodyString, Constants.ContentType, Constants.AcceptType, ServiceTimedOut);
                                    if (result.IsSuccessStatusCode)
                                    {
                                        try
                                        {
                                            response = new JavaScriptSerializer().Deserialize<Response>(result.Content.ReadAsStringAsync().Result);
                                        }
                                        catch (Exception ex)
                                        {
                                            response = null;
                                            isFailedAnyPackage = true;
                                            Logger.Log(LogLevel.Warning, new LogBag(), string.Format("Subcription failed while deserialize for suborder Id {0} with error: {1}", suborderId, ex.Message));
                                        }
                                    }
                                    else
                                    {
                                        transaction.Complete();
                                        throw new Exception(string.Format("SuborderShippedStateProcessorHandler.ProcessShippedOrders: error occured while sending request to web service. SuborderId : {0}, Response code : {1}.", suborderId, result.ReasonPhrase));
                                    }

                                    if (response != null)
                                    {
                                        if (response.ResultCode == 1 && response.FailedPackageDetails.Count <= 0)
                                        {
                                            isFailedAnyPackage = true;
                                            Logger.Log(LogLevel.Warning, new LogBag(), string.Format("Subcription failed for suborder Id {0} with error: {1}", suborderId, response.FailureDescription));
                                        }
                                        foreach (var failureDescription in response.FailedPackageDetails)
                                        {
                                            isFailedAnyPackage = true;

                                            var failureMessage = string.Format("Subcription failed for ClientId: {0}, SiteId: {1}, ShippingDateTime: {2}, CarrierId: {3}, TrackingId: {4}, OrderId: {5}, FailureDescription: {6}",
                                                failureDescription.ClientId, failureDescription.SiteId,
                                                failureDescription.ShippingDateTime,
                                                failureDescription.CarrierId, failureDescription.TrackingId,
                                                failureDescription.OrderId,
                                                failureDescription.FailureDescription);

                                            Logger.Log(LogLevel.Warning, new LogBag(), failureMessage);
                                        }
                                    }
                                }
                                else
                                {
                                    isFailedAnyPackage = false;
                                }
                                if (!isFailedAnyPackage)
                                {
                                    ShippedSuborderProvider.UpdateStatus(suborderId, (int)PTSStatus.SuborderTrackingSubscribed);
                                }
                                else
                                {
                                    ShippedSuborderProvider.UpdatePtsNextRetryDate(suborderId, DateTime.Now.AddMinutes(RetryDelay));
                                }
                                transaction.Complete();
                            }
                            else
                            {
                                Logger.Log(LogLevel.Information, new LogBag(),
                                    string.Format("Suborders are already processed/or being processed by other instance."));
                                transaction.Complete();
                            }
                        }
                    }
                }
                else
                {
                    HasNoNewRecords = true;
                    Logger.Log(LogLevel.Information, new LogBag(), string.Format("SuborderShippedStateProcessorHandler.ProcessShippedOrders: No shipped orders found"));
                }

            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, new LogBag().AddToBag(ex), string.Format("SuborderShippedStateProcessorHandler.ProcessShippedOrders: Exception occurred."));
            }

            Logger.Log(LogLevel.Verbose, new LogBag(), string.Format("SuborderShippedStateProcessorHandler.ProcessShippedOrders: Ends."));
        }

        /// <summary>
        /// Ensures there are no further order processing. However, the order currently being processed will continue.
        /// </summary>
        public static void StopProcessingFurtherOrders()
        {
            _shouldTerminate = true;
            Logger.Log(LogLevel.Verbose, new LogBag(), string.Format("Stop processing further called at {0}. Thread Name {1}", DateTime.Now, Thread.CurrentThread.Name));
        }

        #endregion
    }
}
