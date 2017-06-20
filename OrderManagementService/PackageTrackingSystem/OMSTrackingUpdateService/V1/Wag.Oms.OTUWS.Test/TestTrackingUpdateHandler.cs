using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using Wag.Oms.OTUWS.ApiImplementation;
using Microsoft.QualityTools.Testing.Fakes;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.ApiContract.Entities;
using Wag.Oms.OTUWS.Common.Fakes;
using Wag.Oms.OTUWS.Repositories.Fakes;

namespace Wag.Oms.OTUWS.Test
{
    [TestClass]
    public class TestTrackingUpdateHandler
    {
        [TestMethod]
        public void TestTrackingUpdateHandling_InvalidTrackingStatus()
        {
            var trackingUpdateHandler = new TrackingUpdateHandler();
            var trackingUpdateRequest = GetTrackingUpdateRequest("ABCDEvent");
            try
            {
                using (ShimsContext.Create())
                {
                    ShimOTUWSLogger.LogItStringOTUWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimOTUWSLogger.TransactionLogStringString = (a, b) => { };
                    trackingUpdateHandler.HandleTrackingUpdateRequest(trackingUpdateRequest);
                }
            }
            catch (OTUWSException ex)
            {
                Assert.AreEqual("Invalid Tracking Status: ABCDEvent. Client Reference Id: testRef", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestTrackingUpdateHandling_HappyPath()
        {
            var trackingUpdateHandler = new TrackingUpdateHandler();
            var trackingUpdateRequest = GetTrackingUpdateRequest("Delivered");
            bool suborderPackagesUpdated = false;
            try
            {
                using (ShimsContext.Create())
                {
                    ShimSuborderPackagesRepository.AllInstances.UpdateStringStringStringDateTime = (a, b, c, d, e) =>
                    {
                        suborderPackagesUpdated = true;
                        return 1;
                    };
                    ShimOTUWSLogger.LogItStringOTUWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimOTUWSLogger.TransactionLogStringString = (a, b) => { };
                    trackingUpdateHandler.HandleTrackingUpdateRequest(trackingUpdateRequest);
                    Assert.IsTrue(suborderPackagesUpdated);
                }
            }
            catch (OTUWSException ex)
            {
                Assert.IsFalse(true);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestTrackingUpdateHandling_NoDataFound()
        {
            var trackingUpdateHandler = new TrackingUpdateHandler();
            var trackingUpdateRequest = GetTrackingUpdateRequest("Delivered");
            bool suborderPackagesUpdated = false;
            try
            {
                using (ShimsContext.Create())
                {
                    ShimSuborderPackagesRepository.AllInstances.UpdateStringStringStringDateTime = (a, b, c, d, e) =>
                    {
                        suborderPackagesUpdated = false;
                        return 0;
                    };
                    ShimOTUWSLogger.LogItStringOTUWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimOTUWSLogger.TransactionLogStringString = (a, b) => { };
                    trackingUpdateHandler.HandleTrackingUpdateRequest(trackingUpdateRequest);
                    Assert.IsTrue(suborderPackagesUpdated);
                }
            }
            catch (OTUWSException ex)
            {
                Assert.AreEqual("No Data found in suborder_packages for suborder id 01234567890101, tracking id 1Z6RA0680335272916, reference id testRef", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestTrackingUpdateHandling_Exception()
        {
            var trackingUpdateHandler = new TrackingUpdateHandler();
            var trackingUpdateRequest = GetTrackingUpdateRequest("Delivered");
            bool suborderPackagesUpdated = false;
            try
            {
                using (ShimsContext.Create())
                {
                    ShimSuborderPackagesRepository.AllInstances.UpdateStringStringStringDateTime = (a, b, c, d, e) =>
                    {
                        throw new Exception();
                    };
                    ShimOTUWSLogger.LogItStringOTUWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimOTUWSLogger.TransactionLogStringString = (a, b) => { };
                    trackingUpdateHandler.HandleTrackingUpdateRequest(trackingUpdateRequest);
                    Assert.IsTrue(suborderPackagesUpdated);
                }
            }
            catch (OTUWSException ex)
            {
                var exception = ex.ToString();
                Assert.AreEqual("Error while updating suborder_packages for suborder id 01234567890101, tracking id 1Z6RA0680335272916, reference id testRef", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        private TrackingUpdateRequest GetTrackingUpdateRequest(string eventStatus)
        {
            DateTime? shipDatet = DateTime.Now;
            var trackingUpdateRequest = new TrackingUpdateRequest()
            {
                ClientReferenceId = "testRef",
                EventData = new EventData()
                {
                    ClientId = 1,
                    EventTimestamp = DateTime.Now,
                    EventType = "PackageDelivered",
                    TrackResponse = new TrackResponse()
                    {
                        TrackEvents = new TrackEvent[] { new TrackEvent{
                            DateTime=DateTime.Now,
                            Event= eventStatus,
                            Location=new Location()
                            {
                                Country="US"
                            } }
                        },
                        TrackSummary = new TrackSummary()
                        {
                            CarrierId = "FedEx",
                            CarrierStatus = eventStatus,
                            DateTime = DateTime.Now,
                            Location = new Location() { Country = "US" },
                            OrderId = "01234567890101",
                            ShippingDateTime = Convert.ToDateTime(shipDatet.ToMilitaryFormat()),
                            SiteId = 100,
                            Status = eventStatus,
                            TrackingId = "1Z6RA0680335272916"
                        }
                    }
                }
            };
            return trackingUpdateRequest;
        }
    }
}
