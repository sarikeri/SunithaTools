
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Xml;
using Wag.Oms.EGWS.ApiContract.Entities;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.Repositories;
using Wag.Oms.EGWS.RepositoryContracts.Entities;

namespace Wag.Oms.EGWS.ApiImplementation
{
    public class EventGenerationHandler
    {
        /// <summary>
        /// Generate the event and return the result
        /// </summary>
        /// <returns>Event generation result</returns>
        public void HandleEventGenerationRequest(EventRequest eventRequest)
        {
            string errorMessage;
            var validRequest = IsValidRequest(eventRequest, out errorMessage);
            if (!validRequest)
            {
                Helper.LogAndThrowLibraryException(null, $"{errorMessage} Client Reference Id: {eventRequest.ClientReferenceId}");
            }
            GenerateEvent(eventRequest.ClientId, eventRequest);
            if (eventRequest.SecondarySubscribingClientIds != null)
            {
                foreach (var clientId in eventRequest.SecondarySubscribingClientIds)
                {
                    GenerateEvent(clientId, eventRequest);
                }
            }
        }

        private void GenerateEvent(int clientId, EventRequest eventRequest)
        {
            try
            {
                var eventConfigurationRepository = new EventConfigurationRepository();
                var eventConfigEntity = eventConfigurationRepository.Get(eventRequest.EventName, eventRequest.SiteId, clientId);
                if (eventConfigEntity != null)
                {
                    var validData = IsValidData(eventRequest.EventData, eventConfigEntity.Encoding, eventConfigEntity.MsgBodyNotRequired);
                    if (!validData)
                    {
                        throw new EGWSException(null, "Invalid Event Data");
                    }
                    EGWSLogger.TransactionLog(Constants.EGWS_TRACE,
                        $"Start: EventGenerationHandler.GenerateEvent for client id {clientId}, site id {eventRequest.SiteId}, event name {eventRequest.EventName}," +
                            $" keyValue1 {eventRequest.KeyValue1}, keyValue2 {eventRequest.KeyValue2}, reference id {eventRequest.ClientReferenceId}");
                    var messageId = Guid.NewGuid().ToString("N");
                    var eventOutboundEntity = new EventOutboundEntity
                    {
                        MessageId = messageId,
                        MessageType = eventConfigEntity.MessageType,
                        KeyValue1 = eventRequest.KeyValue1,
                        KeyValue2 = eventRequest.KeyValue2,
                        RequestEndPointId = eventConfigEntity.EndPointId,
                        RetryCount = 0,
                        StatusId = 1
                    };
                    using (var transaction = new TransactionScope())
                    {
                        new EventOutboundRepository().Add(eventOutboundEntity);
                        new EventOutboundDataRepository().Add(new EventOutboundDataEntity { MessageId = messageId, MessageData = eventRequest.EventData });
                        transaction.Complete();
                    }
                    EGWSLogger.TransactionLog(Constants.EGWS_TRACE,
                        $"End: EventGenerationHandler.GenerateEvent successful for client id {clientId}, site id {eventRequest.SiteId}, event name {eventRequest.EventName}," +
                            $" keyValue1 {eventRequest.KeyValue1}, keyValue2 {eventRequest.KeyValue2}, reference id {eventRequest.ClientReferenceId}");
                }
            }
            catch(EGWSException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                var message = $"Error while creating an event for client id {clientId}, site id {eventRequest.SiteId}, event name {eventRequest.EventName}," +
                            $" keyValue1 {eventRequest.KeyValue1}, keyValue2 {eventRequest.KeyValue2}, reference id {eventRequest.ClientReferenceId}";
                Helper.LogAndThrowLibraryException(ex, message);
            }
        }

        private bool IsValidRequest(EventRequest request, out string errorMessage)
        {
            errorMessage = string.Empty;
            var clientConfigurationEntities = GetClientConfiguration();

            var clientConfiguration = clientConfigurationEntities.SingleOrDefault(x => x.ClientId == request.ClientId);
            if (clientConfiguration == null)
            {
                errorMessage = $"Invalid Client Id: {request.ClientId}.";
                return false;
            }

            var eventsConfigured = GetEventsConfigured();
            if(!eventsConfigured.ToList().Exists(x => x.EventName == request.EventName))
            {
                errorMessage = $"Invalid Event Name: {request.EventName}.";
                return false;
            }

            if (request.SecondarySubscribingClientIds != null)
            {
                var secondarySubscribingClientIds = clientConfiguration.SecondarySubscribingClientIds.Replace(" ", string.Empty).Split(',').ToList();
                foreach (var clientId in request.SecondarySubscribingClientIds)
                {
                    if (!secondarySubscribingClientIds.Exists(x => x == clientId.ToString()))
                    {
                        errorMessage = $"Invalid Secondary Subscribing Client Id: {clientId}.";
                        return false;
                    }
                }
            }

            if (!clientConfiguration.SiteIds.Replace(" ", string.Empty).Split(',').ToList().Exists(x => x == request.SiteId.ToString()))
            {
                errorMessage = $"Invalid Site Id: {request.SiteId}.";
                return false;
            }

            return true;
        }

        private bool IsValidData(string data, EncodingType encoding, bool msgBodyNotRequired)
        {
            if (msgBodyNotRequired)
                return true;

            switch (encoding)
            {
                case EncodingType.XML:
                    return ValidateXmlData(data);
                case EncodingType.JSON:
                    return ValidateJsonData(data);
                default:
                    return true;
            }
        }

        private bool ValidateXmlData(string data)
        {
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(data);
                return true;
            }
            catch (Exception ex)
            {
                Helper.LogLibraryException(ex, "Invalid XML data");
                return false;
            }
        }

        private bool ValidateJsonData(string data)
        {
            try
            {
               var j = JObject.Parse(data);
               return true;
            }
            catch (Exception ex)
            {
                Helper.LogLibraryException(ex, "Invalid JSON data");
                return false;
            }
        }

        private IEnumerable<ClientConfigurationEntity> GetClientConfiguration()
        {
            var clientConfigurationRepository = new ClientConfigurationRepository();
            return EGWSCacheProvider.Get("ClientConfiguration", clientConfigurationRepository);
        }

        private IEnumerable<EventDefinitionEntity> GetEventsConfigured()
        {
            var eventDefinitionRepository = new EventDefinitionRepository();
            return EGWSCacheProvider.Get("EventsConfigured", eventDefinitionRepository);
        }
    }
}
