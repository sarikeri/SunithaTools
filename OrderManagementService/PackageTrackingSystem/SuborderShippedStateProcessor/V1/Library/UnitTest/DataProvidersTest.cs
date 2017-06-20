using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Wag.Oms.OrderRouterClient.DataProviders.Common;
using Wag.Oms.OrderRouterClient.DataProviders.Contracts;
using Wag.Oms.OrderRouterClient.DataProviders.Contracts.BusinessObjects;

namespace UnitTest
{
    [TestClass]
    public class DataProvidersTest
    {
        string connString = "Data Source=x1a1_10g.world;User ID=svc_oms;Password=svc_oms1;";

        #region Providers decl
        IOrderProvider provOrders = null;
        IDcDefinitionProvider provDcDefinitions = null;
        IOrderRoutingFailureProvider provORFailures = null;
        IOrderRoutingDiscrepancyProvider provORDiscrepancies = null;
        IRoutingQueueProvider provRoutingQueue = null;
        #endregion

        [TestInitialize]
        public void Init()
        {
            provOrders = Container.Resolve<IOrderProvider>();
            provDcDefinitions = Container.Resolve<IDcDefinitionProvider>();
            provORFailures = Container.Resolve<IOrderRoutingFailureProvider>();
            provORDiscrepancies = Container.Resolve<IOrderRoutingDiscrepancyProvider>();
            provRoutingQueue = Container.Resolve<IRoutingQueueProvider>();
        }

        #region IDcDefinitionProvider methods

        [TestMethod]
        public void DcDefinitionProvider_GetByDcId()
        {
            provDcDefinitions.ConnectionString = connString;

            DcDefinition def = provDcDefinitions.GetByDcId(10);

            Assert.IsNotNull(def);
            Assert.IsTrue(def.DcId == 10);
        }

        #endregion

        #region IOrderRoutingFailureProvider methods

        //[TestMethod]
        //public void ORFailureProvider_PersistAndGet()
        //{
        //    provORFailures.ConnectionString = connString;

        //    OrderRoutingFailure a = new OrderRoutingFailure
        //    {
        //        OrderId = "11127421850100",
        //        LineItemId = 2,
        //        ProductId = 45008,
        //        FailureCodes = 1024,
        //        RetryCount = 10,
        //        RetryErrorText = "error",
        //        Status = 3,
        //        ResolvedDate = DateTime.Now,
        //        LastRetryDate = DateTime.Now.AddDays(1)
        //    };
        //    OrderRoutingFailure b = new OrderRoutingFailure
        //    {
        //        OrderId = "11127421850100",
        //        LineItemId = 2,
        //        ProductId = 45008,
        //        FailureCodes = 512,
        //        RetryCount = 106,
        //        RetryErrorText = "error6",
        //        Status = 1,
        //        ResolvedDate = DateTime.Now,
        //        LastRetryDate = DateTime.Now.AddDays(16)
        //    };

        //    bool persistSucceeded = true;
        //    try
        //    {
        //        provORFailures.Persist(a, b);
        //    }
        //    catch { persistSucceeded = false; }

        //    Assert.AreEqual<bool>(true, persistSucceeded);

        //    List<OrderRoutingFailure> failures = provORFailures.GetByOrderId("11127421850100");

        //    Assert.IsNotNull(failures);
        //    Assert.IsTrue(failures.Count > 0);
        //    Assert.IsTrue(failures[0].OrderId == "11127421850100");
        //}

        #endregion

        #region IOrderRoutingDiscrepancyProvider methods

        [TestMethod]
        public void ORDiscrepancyProvider_Persist()
        {
            provORDiscrepancies.ConnectionString = connString;

            OrderRoutingDiscrepancy obj = new OrderRoutingDiscrepancy
                                            {
                                                OrderId = "11111111111111",
                                                DcId = 10,
                                                DemandDcId = 17,
                                                DiscrepancyCode = 32,
                                                DiscrepancyId = DateTime.Now.ToString("yyyyMMMddHHmmss"),
                                                LineItemId = 1,
                                                PrimaryDcId = 10,
                                                ProductId = 12345,
                                                SuborderId = "12345",
                                                QtyAvailable = 100,
                                                QtyOrdered = 50,
                                                QtyReserved = 40,
                                                QtyAvailableInDemandDc = 200,
                                                QtyAvailableInPrimaryDc = 0,
                                                QtyReservedInDemandDc = 40,
                                                QtyReservedInPrimaryDc = 30
                                            };

            bool persisted = true;
            try
            {
                provORDiscrepancies.Persist(null, obj);
            }
            catch { persisted = false; }

            Assert.IsTrue(persisted);
        }

        #endregion

        #region IOrderProvider methods
        
        [TestMethod]
        public void OrderProvider_GetByStatusId()
        {
            provOrders.ConnectionString = connString;
            List<Order> orders = provOrders.GetByStatusId(7, 2);

            Assert.IsNotNull(orders);
            Assert.AreEqual<int>(2, orders.Count);
            Assert.AreEqual<int>(7, orders[0].StatusId ?? 0);
        }

        [TestMethod]
        public void OrderProvider_GetByOrderId()
        {
            provOrders.ConnectionString = connString;
            var order = provOrders.GetByStatusId(7, 1).First();
            order = provOrders.GetByOrderId(order.OrderId);
            Assert.IsNotNull(order);
            Assert.AreEqual(7, order.StatusId ?? 0);
        }

        [TestMethod]
        public void OrderProvider_GetAllSuborderVersionMaps()
        {
            provOrders.ConnectionString = connString;
            List<SuborderVersionMap> list = provOrders.GetAllSuborderVersionMaps();

            Assert.IsNotNull(list);
            Assert.IsTrue(list.Count > 0);
        }

        //[TestMethod]
        //public void OrderProvider_Persist()
        //{
        //    provOrders.ConnectionString = connString;

        //    Order oldBO = null;
        //    Order newBO = null;

        //    GetTestOrders(out oldBO, out newBO);

        //    bool persisted = true;
        //    try
        //    {
        //        provOrders.Persist(oldBO, newBO);
        //    }
        //    catch { persisted = false; }

        //    Assert.IsTrue(persisted);
        //}

        private void GetTestOrders(out Order oldBO, out Order newBO)
        {
            Order ord1 = new Order
            {
                OrderId = "05327420100100",
                SiteId = 1,
                StatusId = 5,
                Tax = 1,
                TaxRate = 1,
                TaxRateProvider = -1,
                CcCurId = "11122233344466",
                ShipAddress1 = "abc",
                ShipAddress2 = "def",
                ShipCity = "Bellevue",
                ShipState = "WA",
                ShipZip = "98007",
                ShipCountryCode = "us",
                ShipName = "ship1",
                ShipPhone = "1234567890",
                CcBillingAddress1 = "xyz",
                CcBillingAddrZip = "98052",
                CcCardholderName = "ram",
                CcCurToken = "1111111111",
                CcExpirationMonth = 1,
                CcExpirationYear = 2019,
                CcTypeId = 1,
                CurrencyId = 1,
                DateReceived = DateTime.Now,
                MemberId = "11111222223333",
                OrderFlags = 1111,
                OrderType = 1,
                OrderTotal = 100,
                ShippingTypeId = 2,
                Suborders = new System.Collections.Generic.List<Suborder> { new Suborder { SuborderId="05327420100101", SuborderStatusId=1, SuborderType=1, SuborderFSAType=1, SuborderFlags=1, TaxableTotal=1, TaxAmount=1, BaseShipping=1, BillingStatus=2, CcId="660D4470AC4643BEA16BAEB0B5E9A804", DcId=17, DistCenterType=2, 
                                            FsaPaymentTotal=1, GroupId=2, OrderId="05327420100100", PrimaryDcId=17, ShippingCarrierId=1, ShippingTaxableAmount=1, ShippingTypeId=1, TaxRateProvider=1, Total=1, Version=2, 
                                            //SuborderLineItems = new System.Collections.Generic.List<SuborderLineitem> { new SuborderLineitem { LineItemId=1, SuborderId="09999999999999", Quantity=5, QuantityReserved=4, TaxableAmount=20, TaxRate=(decimal)0.1, OpsFlags=1234}},
                                            SuborderLineItems = new System.Collections.Generic.List<SuborderLineitem> { new SuborderLineitem { LineItemId=1, SuborderId="05327420100101", Quantity=1, QuantityReserved=1, TaxableAmount=1, TaxRate=(decimal)0.2, OpsFlags=1}},
                                    }
                            }
            };

            Order ord2 = new Order
            {
                OrderId = "05327420100100",
                SiteId = 1,
                StatusId = 5,
                Tax = 2,
                TaxRate = 2,
                TaxRateProvider = -1,
                CcCurId = "660D4470AC4643BEA16BAEB0B5E9A804",
                CcNumberHint = "123",
                ShipAddress1 = "abcd",
                ShipAddress2 = "defg",
                ShipCity = "Bellevue",
                ShipState = "WA",
                ShipZip = "98007",
                ShipCountryCode = "us",
                ShipName = "ship1",
                ShipPhone = "1234567890",
                CcBillingAddress1 = "xyza",
                CcBillingAddrZip = "98052",
                CcCardholderName = "ramk",
                CcCurToken = "1111111111",
                CcExpirationMonth = 2,
                CcExpirationYear = 2020,
                CcTypeId = 1,
                CurrencyId = 1,
                DateReceived = DateTime.Now,
                MemberId = "F54D0316B7E54C91AB6D4F8CE35A7597",
                OrderFlags = 1112,
                OrderType = 1,
                OrderTotal = 100,
                ShippingTypeId = 2,
                Suborders = new System.Collections.Generic.List<Suborder> { new Suborder { SuborderId="05327420100101", SuborderStatusId=35, SuborderType=1, SuborderFSAType=2, SuborderFlags=3333, TaxableTotal=8, TaxAmount=2, BaseShipping=2, BillingStatus=2, CcId="660D4470AC4643BEA16BAEB0B5E9A804", DcId=30, DistCenterType=2, 
                                            FsaPaymentTotal=500, GroupId=2, OrderId="05327420100100", PrimaryDcId=30, ShippingCarrierId=2, ShippingTaxableAmount=25, ShippingTypeId=2, TaxRateProvider=22, Total=290, Version=3, 
                                            //SuborderLineItems = new System.Collections.Generic.List<SuborderLineitem> { new SuborderLineitem { LineItemId=1, SuborderId="09999999999999", Quantity=5, QuantityReserved=4, TaxableAmount=20, TaxRate=(decimal)0.1, OpsFlags=1234}},
                                            SuborderLineItems = new System.Collections.Generic.List<SuborderLineitem> { new SuborderLineitem { LineItemId=1, SuborderId="05327420100101", Quantity=25, QuantityReserved=24, TaxableAmount=220, TaxRate=(decimal)2.1, OpsFlags=2}},
                                    }
            }
            };

            oldBO = ord1;
            newBO = ord2;
        }

        #endregion

        #region IRoutingQueueProvider methods

        [TestMethod]
        public void RoutingQueueProvider_GetRoutingQueue()
        {
            provRoutingQueue.ConnectionString = connString;
            List<RoutingQueue> routingQueues = provRoutingQueue.GetRoutingQueue(3);

            Assert.IsNotNull(routingQueues);
            Assert.AreEqual<int>(3, routingQueues[0].StatusId);
        }

        [TestMethod]
        public void RoutingQueueProvider_Update()
        {
            provRoutingQueue.ConnectionString = connString;
            var routingQueue = provRoutingQueue.GetRoutingQueue(3).First();
            routingQueue.UpdateDate = DateTime.Now;
            var result = provRoutingQueue.Update(routingQueue);
            Assert.AreNotEqual(result, -1);
        }

        [TestMethod]
        public void RoutingQueueProvider_TryLocking()
        {
            provRoutingQueue.ConnectionString = connString;
            var routingQueue = provRoutingQueue.GetRoutingQueue(3).First();
            bool result;
            using (var transaction = new TransactionScope())
            {
                result = provRoutingQueue.TryLocking(routingQueue.Id, 3, routingQueue.UpdateDate,routingQueue.LastRoutingTime);
            }
            Assert.AreEqual(result, true);
        }


        [TestMethod]
        public void RoutingQueueProvider_GetRoutingQueue_Test_Grouping()
        {
            provRoutingQueue.ConnectionString = connString;
            List<RoutingQueue> routingQueues = provRoutingQueue.GetRoutingQueue(3);

            Assert.IsNotNull(routingQueues);
            Assert.AreEqual<int>(3, routingQueues[0].StatusId);
        }


        [TestMethod]
        public void RoutingQueueProvider_GetRoutingQueue_Test_Join()
        {
            var routingQueue = new List<RoutingQueue>();
            routingQueue.Clear();
            RoutingQueue rq1 = new RoutingQueue { Id = "1", IsCompeting = false, RouteCandidateLineitems = new List<RouteCandidateLineitem>() };
            rq1.RouteCandidateLineitems.Add(new RouteCandidateLineitem { ProductId = 1 });
            rq1.RouteCandidateLineitems.Add(new RouteCandidateLineitem { ProductId = 2 });
            routingQueue.Add(rq1);
            RoutingQueue rq2 = new RoutingQueue { Id = "2", IsCompeting = false, RouteCandidateLineitems = new List<RouteCandidateLineitem>() };
            rq2.RouteCandidateLineitems.Add(new RouteCandidateLineitem { ProductId = 2 });
            rq2.RouteCandidateLineitems.Add(new RouteCandidateLineitem { ProductId = 3 });
            routingQueue.Add(rq2);
            
            var competingRroutingQueueIds = new[] { new { RoutingQueueId = ""} }.ToList();
            competingRroutingQueueIds.Clear();
            competingRroutingQueueIds.Add(new { RoutingQueueId = "1" });

            var competingRoutingQueueCandidates = from a in routingQueue join b in competingRroutingQueueIds on a.Id equals b.RoutingQueueId select (a);

            competingRoutingQueueCandidates.ToList().ForEach(a=>a.IsCompeting = true);

            Assert.IsNotNull(competingRoutingQueueCandidates.Count() == 1);
        }

       
                
        #endregion
    }
}
