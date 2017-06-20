using System.Collections.Generic;
using Microsoft.QualityTools.Testing.Fakes;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Wag.Oms.OrderRouterClient.Common;
using Wag.Oms.OrderRouterClient.DataProviders.Contracts;
using Wag.Oms.OrderRouterClient.DataProviders.Contracts.Fakes;
using Wag.Oms.OrderRouterClient.Logging.Fakes;
using Wag.Oms.PostRouter.Webservice.Rest.Proxy;

namespace Wag.Oms.OrderRouterClient.UnitTest
{
    [TestClass]
    public class RoutingFailureAndDiscrepancyHandlerTest
    {
        [TestMethod]
        public void TestPersistRoutingFailures_DifferentFailureCode()
        {
            // Arrange
            var persistNewRecordCount = 0;
            var persistOldRecordCount = 0;
            var oldFailureRecordStatus = 0m;
            var newFailureRecordStatus = 0m;
            var oldFailureCode = 0m;
            var newFailureCode = 0m;

            var orderRoutingFailureOld = new OrderRoutingFailure { OrderId = "12345678901234", LineItemId = 1234, FailureCodes = 999 };

            var orderRoutingFailureNewList = new List<OrderRoutingFailure>
            {
                new OrderRoutingFailure { OrderId = "12345678901234", LineItemId = 1234, FailureCodes = 888 }
            };

            var routingFailureProvider = new StubIOrderRoutingFailureProvider
            {
                GetByOrderIdString = (orderId) => new List<OrderRoutingFailure>{ orderRoutingFailureOld },
                PersistOrderRoutingFailureOrderRoutingFailure = (oldFailure, newFailure) =>
                {
                    if (oldFailure == null)
                    {
                        persistNewRecordCount++;
                        newFailureRecordStatus = newFailure.Status;
                        newFailureCode = newFailure.FailureCodes;
                    }
                    else
                    {
                        persistOldRecordCount++;
                        oldFailureRecordStatus = newFailure.Status;
                        oldFailureCode = newFailure.FailureCodes;
                    }
                }
            };

            using (ShimsContext.Create())
            {
                ShimLogger.StaticConstructor = () => { };
                ShimLogger.LogLogLevelLogBagStringObjectArray = (level, bag, arg3, arg4) => { /* do nothing */ };

                // Execute
                var handler = new RoutingFailureAndDiscrepancyHandler(null, routingFailureProvider);
                handler.PersistRoutingFailures(orderRoutingFailureNewList, new Order(), true);
            }

            // Assert
            Assert.AreEqual(persistNewRecordCount, 1);
            Assert.AreEqual(persistOldRecordCount, 1);
            Assert.AreEqual(oldFailureRecordStatus, (decimal) RetryFailureStatus.RFS_REPLACED);
            Assert.AreEqual(newFailureRecordStatus, (decimal) RetryFailureStatus.RFS_NEW);
            Assert.AreEqual(oldFailureCode, 999);
            Assert.AreEqual(newFailureCode, 888);
        }

        [TestMethod]
        public void TestPersistRoutingFailures_SameFailureCode()
        {
            // Arrange
            var persistNewRecordCount = 0;
            var persistOldRecordCount = 0;
            var oldFailureRecordStatus = 0m;
            var newFailureRecordStatus = 0m;
            var oldFailureCode = 0m;
            var newFailureCode = 0m;

            var orderRoutingFailureOld = new OrderRoutingFailure { OrderId = "12345678901234", LineItemId = 1234, FailureCodes = 999 };

            var orderRoutingFailureNewList = new List<OrderRoutingFailure>
            {
                new OrderRoutingFailure { OrderId = "12345678901234", LineItemId = 1234, FailureCodes = 999, Status = 1}
            };

            var routingFailureProvider = new StubIOrderRoutingFailureProvider
            {
                GetByOrderIdString = (orderId) => new List<OrderRoutingFailure> { orderRoutingFailureOld },
                PersistOrderRoutingFailureOrderRoutingFailure = (oldFailure, newFailure) =>
                {
                    if (oldFailure == null)
                    {
                        persistNewRecordCount++;
                        newFailureRecordStatus = newFailure.Status;
                        newFailureCode = newFailure.FailureCodes;
                    }
                    else
                    {
                        persistOldRecordCount++;
                        oldFailureRecordStatus = newFailure.Status;
                        oldFailureCode = newFailure.FailureCodes;
                    }
                }
            };

            using (ShimsContext.Create())
            {
                ShimLogger.StaticConstructor = () => { };
                ShimLogger.LogLogLevelLogBagStringObjectArray = (level, bag, arg3, arg4) => { /* do nothing */ };

                // Execute
                var handler = new RoutingFailureAndDiscrepancyHandler(null, routingFailureProvider);
                handler.PersistRoutingFailures(orderRoutingFailureNewList, new Order(), true);
            }

            // Assert
            Assert.AreEqual(persistNewRecordCount, 0);
            Assert.AreEqual(persistOldRecordCount, 1);
            Assert.AreEqual(oldFailureRecordStatus, (decimal)RetryFailureStatus.RFS_NEW);
            Assert.AreEqual(newFailureRecordStatus, 0);
            Assert.AreEqual(oldFailureCode, 999);
            Assert.AreEqual(newFailureCode, 0);
        }
    }
}
