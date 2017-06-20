var restClient = require('node-rest-client').Client;
var uuid = require("uuid");
var moment = require("moment");
var config = require('./../config');
var logger = require('./../utils/logger');

class eventGeneratorClient {
    constructor() {
        this.client = new restClient();
    }

    // This getter is to support unit testing. Creating sinon.stub of get method using node rest client's prototype does not work.
    // https://github.com/aacerox/node-rest-client/issues/71
    getRestClient() {
        return this.client;
    }

    generateEvent(siteId, orderId, trackingId, eventName, trackingData, secondaryEpClientId) {
        logger.verbose(`Calling event generator API: ${config.epClientId}, ${orderId}, ${trackingId}, ${eventName}, ${secondaryEpClientId}`);
        var event = this.buildEvent(eventName, secondaryEpClientId, trackingData);
        var args = {
            data: { "ClientId": config.epClientId, "SiteId": siteId, "KeyValue1": orderId, "KeyValue2": trackingId, 
                "EventName": eventName, "EventData": JSON.stringify(event), "SecondarySubscribingClientIds": [secondaryEpClientId], 
                "ClientReferenceId": uuid.v1().replace(/-/g,'') },
            headers: { "Content-Type": "application/json"},
            requestConfig: { timeout: config.eventGeneratorAPITimeOut },
            responseConfig: { timeout: config.eventGeneratorAPITimeOut }
        };

        return new Promise((resolve, reject) => {
            var req = this.client.post(config.eventGeneratorAPI, args, function (data, response) {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    if (data.ResultCode == 0) {
                        resolve(true);
                    }
                    else {
                        reject(`${data.FailureDescription}`);
                    }
                }
                else {
                    reject(`http status code ${response.statusCode}; status message: ${response.statusMessage}`);
                }
            });

            req.on('requestTimeout', function (req) {
                logger.debug('request has expired');
                req.abort();
                reject(`Event Generation API timed out`);
            });

            req.on('responseTimeout', function (res) {
                logger.debug('response has expired');
                reject(`Event Generation API timed out`);
            });

            req.on('error', function (err) {
                reject(`${err}`);
            });
        });
    }

    buildEvent(eventName, clientId, trackingData) {
        var event = {};
        var eventData = {};
        eventData.EventType = eventName;
        eventData.EventTimeStamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        eventData.ClientId = clientId;
        eventData.TrackResponse = trackingData;
        event.EventData = eventData;

        return event;
    }
}

module.exports = eventGeneratorClient;