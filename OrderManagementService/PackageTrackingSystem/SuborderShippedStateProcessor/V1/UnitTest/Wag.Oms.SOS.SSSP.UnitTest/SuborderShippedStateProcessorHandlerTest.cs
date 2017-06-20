using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Wag.Oms.SOS.DAL.Contracts;
using Wag.Oms.SOS.Handler;
using Microsoft.QualityTools.Testing.Fakes;
using Wag.Oms.SOS.Common;
using System.Net.Http;
using System.Text;

namespace Wag.Oms.SOS.SuborderShippedStateProcessorService.UnitTest
{
    [TestClass]
    public class SuborderShippedStateProcessorHandlerTest
    {
        private List<Suborder> SuborderList()
        {
            var suborderLst = new List<Suborder>();
            var suborder = new Suborder()
            {
                OrderId = "1000000000",
                SecondarySubscribingClientids = null,
                ShippedDate = DateTime.UtcNow,
                ShippingCarrierId = "FedEx",
                ShippingTrackingInfo = "1111111111",
                ShipZip = "562413",
                SiteId = 100,
                SuborderId = "1000000001"
            };
            suborderLst.Add(suborder);

            return suborderLst;
        }

        [TestMethod]
        public void ProcessShippedOrders_No_ShippedSuborders()
        {
            using (ShimsContext.Create())
            {
                DAL.Repositories.Fakes.ShimSuborderLoader.AllInstances.GetShippedSuborders = (a) => new List<Suborder>();

                var suborderShippedStateProcessorHandler = new SuborderShippedStateProcessorHandler();
                suborderShippedStateProcessorHandler.ProcessShippedOrders(new CancellationTokenSource());
                Assert.AreEqual(true, suborderShippedStateProcessorHandler.HasNoNewRecords);
            }
        }

        [TestMethod]
        public void ProcessShippedOrders_With_ShippedSuborders_InvalidPackage()
        {
            using (ShimsContext.Create())
            {
                var suborderLst = SuborderList();
                suborderLst[0].SecondarySubscribingClientids = "1";
                var ptsNextRetryDate = DateTime.Now;

                DAL.Repositories.Fakes.ShimSuborderLoader.AllInstances.GetShippedSuborders = (a) => suborderLst;
                DAL.Repositories.Fakes.ShimShippedSuborderRepository.AllInstances.TryLockingStringInt32 = (a, b, c) => true;
                DAL.Repositories.Fakes.ShimShippedSuborderRepository.AllInstances.UpdatePtsNextRetryDateStringDateTime =
                    (a, b, c) =>
                    {
                        ptsNextRetryDate = c;
                        return 1;
                    };

                var suborderShippedStateProcessorHandler = new SuborderShippedStateProcessorHandler();
                suborderShippedStateProcessorHandler.ProcessShippedOrders(new CancellationTokenSource());

                Assert.IsTrue(DateTime.Now < ptsNextRetryDate);
            }
        }

        [TestMethod]
        public void ProcessShippedOrders_With_ShippedSuborders_ValidPackage()
        {
            using (ShimsContext.Create())
            {
                var suborderLst = SuborderList();
                var shippedSuborderStatus = (int)PTSStatus.New;

                DAL.Repositories.Fakes.ShimSuborderLoader.AllInstances.GetShippedSuborders = (a) => suborderLst;
                DAL.Repositories.Fakes.ShimShippedSuborderRepository.AllInstances.TryLockingStringInt32 = (a, b, c) => true;
                DAL.Repositories.Fakes.ShimShippedSuborderRepository.AllInstances.UpdateStatusStringInt32 =
                    (a, b, c) =>
                    {
                        shippedSuborderStatus = c;
                        return 1;
                    };

                var suborderShippedStateProcessorHandler = new SuborderShippedStateProcessorHandler();
                suborderShippedStateProcessorHandler.ProcessShippedOrders(new CancellationTokenSource());

                Assert.AreEqual((int)PTSStatus.SuborderTrackingSubscribed, shippedSuborderStatus);
            }
        }

        [TestMethod]
        public void ProcessShippedOrders_With_ShippedSuborders_ValidPackage_Failed_Locking()
        {
            using (ShimsContext.Create())
            {
                var suborderLst = SuborderList();

                DAL.Repositories.Fakes.ShimSuborderLoader.AllInstances.GetShippedSuborders = (a) => suborderLst;
                DAL.Repositories.Fakes.ShimShippedSuborderRepository.AllInstances.TryLockingStringInt32 = (a, b, c) => false;

                var suborderShippedStateProcessorHandler = new SuborderShippedStateProcessorHandler();
                suborderShippedStateProcessorHandler.ProcessShippedOrders(new CancellationTokenSource());

                Assert.IsNotNull(suborderShippedStateProcessorHandler);
            }
        }

        [TestMethod]
        public void ProcessShippedOrders_With_ShippedSuborders_ValidPackage_GetShippedSuborders_Exception()
        {
            using (ShimsContext.Create())
            {
                DAL.Repositories.Fakes.ShimSuborderLoader.AllInstances.GetShippedSuborders =
                    (a) =>
                    {
                        throw new Exception();
                    };

                var suborderShippedStateProcessorHandler = new SuborderShippedStateProcessorHandler();
                suborderShippedStateProcessorHandler.ProcessShippedOrders(new CancellationTokenSource());

                Assert.IsNotNull(suborderShippedStateProcessorHandler);
            }
        }

        [TestMethod]
        public void ProcessShippedOrders_With_ShippedSuborders_ValidPackage_StopProcessingFurtherOrders()
        {
            using (ShimsContext.Create())
            {
                var suborderLst = SuborderList();

                DAL.Repositories.Fakes.ShimSuborderLoader.AllInstances.GetShippedSuborders = (a) => suborderLst;

                var suborderShippedStateProcessorHandler = new SuborderShippedStateProcessorHandler();
                SuborderShippedStateProcessorHandler.StopProcessingFurtherOrders();
                suborderShippedStateProcessorHandler.ProcessShippedOrders(new CancellationTokenSource());

                Assert.AreEqual(true, suborderShippedStateProcessorHandler.HasNoNewRecords);
            }
        }
    }
}
