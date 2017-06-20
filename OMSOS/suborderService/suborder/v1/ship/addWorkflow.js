var _this;
var restClient = require('node-rest-client').Client;
var resourceConfig = require('./config');
var resourceLogger = require('./logger').logger;
var lib = require('./lib');
let constants = require('./constants');
var resourceLogger = require('./logger').logger;

class addWorkflow {

    constructor(ctx, metadata) {
        this.Context = ctx;
        this.Metadata = metadata;

        this.client = new restClient();
        _this = this;
    }

    execute() {
        return new Promise(function (resolve, reject) {
            let helper = new lib();
            let metadata = _this.Metadata;
            let context = _this.Context;
            let data;
            let errorMessage = undefined;
            let promises = [];
            try {
                if (context.shouldAddCloseOrderWF || context.shouldAddBackOrderWF) {
                    //if (context.hasOwnProperty("shouldAddCloseOrderWF") && context.shouldAddCloseOrderWF == true) {
                    if (context.shouldAddCloseOrderWF) {
                        data = {};
                        data.name = "CloseOrder";
                        data.version = "v1";
                        data.tags = ['orderId'];
                        data.metadata = {}
                        data.metadata.orderId = metadata.orderId;
                        resourceLogger.verbose('addWorkflow: Executing for orderid - ' + metadata.orderId);
                    } else if (context.shouldAddBackOrderWF) {
                        data = {};
                        data.name = "RouteBackorder";
                        data.version = "v1";
                        data.tags = ['suborderId'];
                        data.metadata = {}
                        data.metadata.orderId = metadata.orderId;
                        data.metadata.suborderId = metadata.suborderId;
                        resourceLogger.verbose('addWorkflow: Executing for suborderId - ' + metadata.suborderId);
                    }

                    var args = {
                        data: data,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };

                    promises.push(_this.post(args));

                    if (context.SuborderEvent.status) {
                        var suborderEventData = {};
                        suborderEventData.metadata = {};
                        suborderEventData.name = (context.SuborderEvent.Event == constants.suborderEvents.Shipped) ?
                            "SuborderShippedEvent" : "SuborderCancelledEvent";
                        suborderEventData.version = "v1";
                        suborderEventData.tags = ['suborderId'];
                        suborderEventData.metadata.orderId = metadata.orderId;
                        suborderEventData.metadata.suborderId = metadata.suborderId;

                        let argsEvent = {
                            data: suborderEventData,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };

                        promises.push(_this.post(argsEvent));
                    }

                    Promise.all(promises).then((result) => {
                        var response = {};
                        response.result = constants.results.Success;
                        response.errorMessage = '';
                        resolve(response);
                    }).catch((err) => {
                        let message = `addWorkflow.execute(): reject ${JSON.stringify(err)}`;
                        resourceLogger.error(message);
                        var response = {};
                        response.result = constants.results.Failed;
                        response.errorMessage = message;
                        resolve(response);
                    });
                    //if (data != null && data != undefined) {

                    //}
                }
            } catch (exception) {
                let errorMessage = `addWorkflow: execute(): reject ${JSON.stringify(exception.message)} for suborderId = ${metadata.suborderId}`;
                resourceLogger.error(errorMessage);
                let response = {};
                response.result = constants.results.Failed;
                response.errorMessage = errorMessage;
                resolve(response);
            }
        });
    }

    post(args) {
        return new Promise((resolve, reject) => {
            let errorMessage = undefined;
            var req = _this.client.post(resourceConfig.OrchestrationBaseUrl, args, function (data, response) {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    if (data._id) {
                        resolve(true);
                    } else {
                        resourceLogger.error(`API Failed to create workflow.`);
                        reject(`API Failed to create workflow.`);
                    }
                } else {
                    resourceLogger.error(`http status code ${response.statusCode}; status message: ${response.statusMessage}`);
                    reject(`http status code ${response.statusCode}; status message: ${response.statusMessage}`);
                }
            });

            req.on('requestTimeout', function (req) {
                resourceLogger.debug('request has expired');
                req.abort();
                reject(`API timed out`);
            });

            req.on('responseTimeout', function (res) {
                resourceLogger.debug('response has expired');
                reject(`API timed out`);
            });

            req.on('error', function (err) {
                reject(`API Error: ${err}`);
            });
        })
    }
}

module.exports = addWorkflow;