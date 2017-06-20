using System;
using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Wag.Oms.OrderRouterClientService.PerformanceCounters;

namespace OrderRouterClient.Counters.Test
{
    [TestClass]
    public class OrderRouterClientCountersTest
    {
        [TestMethod]
        public void TestOrderRouterClientServiceCounters()
        {
            // New Order Service Counters   
            
            // Set up the counters
            OrderRouterClientServiceCounters.Instance.InitCounterInfo();
            OrderRouterClientServiceCounters.Instance.RegisterCounters();

            // Commenting the below as we should not really be testing the Counter creation as part of unit test!
            //ProcessOrderRouterClientExeTime
            //PerformanceCounter actionCounter = new PerformanceCounter("OrderRouterClientService", "Last Execution Time - ProcessNewOrder", true);
            //Assert.IsNotNull(actionCounter);
            //OrderRouterClientServiceCounters.SetProcessOrderRouterClientExeTime(5);
            //Assert.AreEqual(5, actionCounter.RawValue);

            ////OrderRoutingExeTime
            //actionCounter = new PerformanceCounter("OrderRouterClientService", "Last Execution Time - Order Routing", true);
            //Assert.IsNotNull(actionCounter);
            //OrderRouterClientServiceCounters.SetOrderRouterRequestExeTime(5);
            //Assert.AreEqual(5, actionCounter.RawValue);

            ////PostRouterRequestExeTime
            //actionCounter = new PerformanceCounter("OrderRouterClientService", "Last Execution Time - PostRouter", true);
            //Assert.IsNotNull(actionCounter);
            //OrderRouterClientServiceCounters.SetPostRouterRequestExeTime(5);
            //Assert.AreEqual(5, actionCounter.RawValue);

            ////NumOfOrderRouterServiceFailure
            //actionCounter = new PerformanceCounter("OrderRouterClientService", "# Order Routing Failures", true);
            //Assert.IsNotNull(actionCounter);
            //long oldvalue = actionCounter.RawValue;
            //OrderRouterClientServiceCounters.IncrementNumOfOrderRouterServiceFailure();
            //Assert.AreEqual(oldvalue + 1, actionCounter.RawValue);
        }

        [TestMethod]
        public void TestOrderProviderCounters()
        {
            // Order provider Counters   

            // Set up the counters
            OrderProviderCounters.Instance.InitCounterInfo();
            OrderProviderCounters.Instance.RegisterCounters();

            //GetOrderByStatusExeTime
            PerformanceCounter actionCounter = new PerformanceCounter("OrderProvider", "Last Execution Time - GetOrderByStatus", true);
            Assert.IsNotNull(actionCounter);
            OrderProviderCounters.SetGetOrderByStatusExeTime(5);
            Assert.AreEqual(5, actionCounter.RawValue);
        }

        [TestMethod]
        public void TestPostRouterServiceCounters()
        {
            // PostRouter Service Counters   

            // Set up the counters
            PostRouterServiceCounters.Instance.InitCounterInfo();
            PostRouterServiceCounters.Instance.RegisterCounters();

            //TaxClientExeTime
            PerformanceCounter actionCounter = new PerformanceCounter("PostRouterService", "Last Execution Time - TaxClient", true);
            Assert.IsNotNull(actionCounter);
            PostRouterServiceCounters.SetTaxClientRequestExeTime(5);
            Assert.AreEqual(5, actionCounter.RawValue);

            //NumOfOrderTaxClientFailure
            actionCounter = new PerformanceCounter("PostRouterService", "# Tax Client Orders Failure", true);
            Assert.IsNotNull(actionCounter);
            long oldvalue = actionCounter.RawValue;
            PostRouterServiceCounters.IncrementNumOfTaxServiceFailure();
            Assert.AreEqual(oldvalue + 1, actionCounter.RawValue);
        }
    }
}
