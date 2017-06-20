var restClient = require('node-rest-client').Client;
var moment = require("moment-timezone");
var config = require('./../config');
var logger = require('./../utils/logger');

class trackingDetailsClient {
    constructor() {
        this.client = new restClient();
    }

    // This getter is to support unit testing. Creating sinon.stub of get method using node rest client's prototype does not work.
    // https://github.com/aacerox/node-rest-client/issues/71
    getRestClient() {
        return this.client;
    }

    getTrackingDetails(clientId, siteId, orderId, shippingDateTime, carrierId, trackingId) {
        logger.verbose(`Calling tracking detail API: ${siteId}, ${orderId}, ${moment(shippingDateTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ')}, ${carrierId}, ${trackingId}`);
        var args = {
            path: { clientId: clientId, siteId: siteId, orderId: orderId, shippingDateTime: moment(shippingDateTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'), carrierId: carrierId, trackingId: trackingId },
            requestConfig: { timeout: config.trackingDetailAPITimeOut },
            responseConfig: { timeout: config.trackingDetailAPITimeOut }
        };
        return new Promise((resolve, reject) => {
            var req = this.client.get(config.trackingDetailAPI, args, function (data, response) {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    if (data.ResultCode == 0) {
                        resolve({ status: data.TrackResponse.TrackSummary.Status, trackingData: data.TrackResponse });
                    }
                    else {
                        reject(`API Failure Description: ${data.FailureDescription}`);
                    }
                }
                else {
                    reject(`http status code ${response.statusCode}; status message: ${response.statusMessage}`);
                }
            });

            req.on('requestTimeout', function (req) {
                logger.debug('request has expired');
                req.abort();
                reject(`Tracking detail API timed out`);
            });

            req.on('responseTimeout', function (res) {
                logger.debug('response has expired');
                reject(`Tracking detail API timed out`);
            });

            req.on('error', function (err) {
                reject(`API Error: ${err}`);
            });
        });
    }
}

module.exports = trackingDetailsClient;