using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Wag.Oms.EGWS.ApiImplementation;
using Wag.Oms.EGWS.ApiContract.Entities;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces.Fakes;
using Wag.Oms.EGWS.RepositoryContracts.Entities;
using System.Collections.Generic;
using Microsoft.QualityTools.Testing.Fakes;
using Wag.Oms.EGWS.Repositories.Fakes;
using Wag.Oms.EGWS.Common.Fakes;

namespace Wag.Oms.EGWS.Test
{
    [TestClass]
    public class TestEventGenerationHandler
    {
        [TestMethod]
        public void TestEventGenerationRequestHandling_InvalidClientId()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest();
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                }
            }
            catch (EGWSException ex)
            {
                Assert.AreEqual("Invalid Client Id: 0. Client Reference Id: ", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_InvalidEventName()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 1, EventName = "ABCDEvent" };
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                }
            }
            catch (EGWSException ex)
            {
                Assert.AreEqual("Invalid Event Name: ABCDEvent. Client Reference Id: ", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_InvalidSecondarySubscribingClientId()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 1, EventName = "PackageDelivered", SiteId = 100, SecondarySubscribingClientIds = new List<int> { 2 } };
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                }
            }
            catch (EGWSException ex)
            {
                Assert.AreEqual("Invalid Secondary Subscribing Client Id: 2. Client Reference Id: ", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_InvalidSiteId()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 1, EventName = "Shipped", SiteId = 0 };
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                }
            }
            catch (EGWSException ex)
            {
                Assert.AreEqual("Invalid Site Id: 0. Client Reference Id: ", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_HappyPath()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 3, EventName = "PackageDelivered", SiteId = 0, SecondarySubscribingClientIds= new List<int>{ 1 }, EventData = "{\"EventData\":{\"EventType\":\"PackageDelivered\"}}" };
            bool eventOutboundInserted = false;
            bool eventOutboundDataInserted = false;
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEventConfigurationRepository.AllInstances.GetStringInt32Int32 = (a, b, c, d) => GetFakeEventConfiguration(EncodingType.JSON);
                    ShimEventOutboundRepository.AllInstances.AddEventOutboundEntity = (a, b) => { eventOutboundInserted = true; };
                    ShimEventOutboundDataRepository.AllInstances.AddEventOutboundDataEntity = (a, b) => { eventOutboundDataInserted = true; };
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimEGWSLogger.TransactionLogStringString = (a, b) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                    Assert.IsTrue(eventOutboundInserted);
                    Assert.IsTrue(eventOutboundDataInserted);
                }
            }
            catch (EGWSException ex)
            {
                Assert.IsFalse(true);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_InvalidJSONData()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 3, EventName = "PackageDelivered", SiteId = 0, EventData = "{\"EventData\":\"EventType\":\"PackageDelivered\"}}" };
           
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEventConfigurationRepository.AllInstances.GetStringInt32Int32 = (a, b, c, d) => GetFakeEventConfiguration(EncodingType.JSON);
                    ShimEventOutboundRepository.AllInstances.AddEventOutboundEntity = (a, b) => { };
                    ShimEventOutboundDataRepository.AllInstances.AddEventOutboundDataEntity = (a, b) => { };
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimEGWSLogger.TransactionLogStringString = (a, b) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                }
            }
            catch (EGWSException ex)
            {
                Assert.AreEqual("Invalid Event Data", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_TransactionRollback()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 3, EventName = "PackageDelivered", SiteId = 0, EventData = "{\"EventData\":{\"EventType\":\"PackageDelivered\"}}" };
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEventConfigurationRepository.AllInstances.GetStringInt32Int32 = (a, b, c, d) => GetFakeEventConfiguration(EncodingType.JSON);
                    ShimEventOutboundRepository.AllInstances.AddEventOutboundEntity = (a, b) => { };
                    ShimEventOutboundDataRepository.AllInstances.AddEventOutboundDataEntity = (a, b) => { throw new Exception("DB Exception"); };
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimEGWSLogger.TransactionLogStringString = (a, b) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                }
            }
            catch (EGWSException ex)
            {
                Assert.AreEqual("Error while creating an event for client id 3, site id 0, event name PackageDelivered, keyValue1 , keyValue2 , reference id ", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_InvalidEventData()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 1, EventName = "Shipped", SiteId = 100, EventData = "{\"EventData\":{\"EventType\":\"PackageDelivered\"}}" };
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEventConfigurationRepository.AllInstances.GetStringInt32Int32 = (a, b, c, d) => GetFakeEventConfiguration(EncodingType.XML);
                    ShimEventOutboundRepository.AllInstances.AddEventOutboundEntity = (a, b) => { };
                    ShimEventOutboundDataRepository.AllInstances.AddEventOutboundDataEntity = (a, b) => { };
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimEGWSLogger.TransactionLogStringString = (a, b) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                }
            }
            catch (EGWSException ex)
            {
                Assert.AreEqual("Invalid Event Data", ex.ErrorMessage);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        [TestMethod]
        public void TestEventGenerationRequestHandling_HappyPath_MsgBodyNotRequired()
        {
            var eventGenHandler = new EventGenerationHandler();
            var eventRequest = new EventRequest { ClientId = 1, EventName = "Shipped", SiteId = 100 };
            bool eventOutboundInserted = false;
            bool eventOutboundDataInserted = false;
            try
            {
                using (ShimsContext.Create())
                {
                    ShimClientConfigurationRepository.AllInstances.Get = (a) => GetFakeClientConfiguration();
                    ShimEventDefinitionRepository.AllInstances.Get = (a) => GetFakeEventDefinition();
                    ShimEventConfigurationRepository.AllInstances.GetStringInt32Int32 = (a, b, c, d) => GetFakeEventConfiguration(EncodingType.JSON, true);
                    ShimEventOutboundRepository.AllInstances.AddEventOutboundEntity = (a, b) => { eventOutboundInserted = true; };
                    ShimEventOutboundDataRepository.AllInstances.AddEventOutboundDataEntity = (a, b) => { eventOutboundDataInserted = true; };
                    ShimEGWSLogger.LogItStringEGWSEventIdTraceEventTypeExceptionString = (a, b, c, d, e) => { };
                    ShimEGWSLogger.TransactionLogStringString = (a, b) => { };
                    eventGenHandler.HandleEventGenerationRequest(eventRequest);
                    Assert.IsTrue(eventOutboundInserted);
                    Assert.IsTrue(eventOutboundDataInserted);
                }
            }
            catch (EGWSException ex)
            {
                Assert.IsFalse(true);
            }
            catch (Exception)
            {
                Assert.IsFalse(true);
            }
        }

        private IEnumerable<ClientConfigurationEntity> GetFakeClientConfiguration()
        {
            var clientConfigurationEntities = new List<ClientConfigurationEntity> {
                new ClientConfigurationEntity { ClientId = 1, SecondarySubscribingClientIds = "", SiteIds = "100,101" },
                new ClientConfigurationEntity { ClientId = 2, SecondarySubscribingClientIds = "", SiteIds = "0" },
                new ClientConfigurationEntity { ClientId = 3, SecondarySubscribingClientIds = "1,2", SiteIds = "0,100,101" }
            };
            return clientConfigurationEntities;
        }

        private IEnumerable<EventDefinitionEntity> GetFakeEventDefinition()
        {
            var eventDefinitionEntities = new List<EventDefinitionEntity> {
                new EventDefinitionEntity { EventName = "Cancelled" },
                new EventDefinitionEntity { EventName = "PackageDelivered" },
                new EventDefinitionEntity { EventName = "Shipped" }
            };
            return eventDefinitionEntities;
        }

        private EventConfigurationEntity GetFakeEventConfiguration(EncodingType encoding, bool msgNotBodyRequired = false)
        {
            return new EventConfigurationEntity {Encoding = encoding, EndPointId = 3, MessageType = "OmsPackageDelivered", MsgBodyNotRequired = msgNotBodyRequired };
        }
    }
}
