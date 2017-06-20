var restClient = require('node-rest-client').Client;
var config = require('./../oapConfig');
var logger = require('./logger');

class suborders {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
        this.client = new restClient();
    }

    get(orderId) {
        let startTime = new Date();
        let args = {
            path: { orderid: orderId },
            requestConfig: { timeout: config.workflowCreationAPITimeOut },
            responseConfig: { timeout: config.workflowCreationAPITimeOut },
        };
        var _this = this;
        return new Promise(function (resolve, reject) {
            var req = _this.client.get(config.suborderAPI, args, function (data, svcResponse) {
                if (svcResponse.statusCode >= 200 && svcResponse.statusCode < 300) {
                    logger.verbose(`GET Suborders for ${orderId} took: ${(new Date() - startTime)}ms`);
                    return resolve(data);
                }
                else {
                    return reject(`Failed to GET suborders for ${orderId}. http status code ${svcResponse.statusCode}; status message: ${svcResponse.statusMessage}`);
                }
            });

            req.on('requestTimeout', function (req) {
                req.abort();
                return reject(`GET suborders for ${orderId} API timed out`);
            });

            req.on('error', function (err) {
                return reject(`GET suborders for ${orderId} API Error: ${err}`);
            });
        });
    }
}

module.exports = suborders;