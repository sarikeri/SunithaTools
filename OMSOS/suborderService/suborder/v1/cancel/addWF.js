var _this;
var restClient = require('node-rest-client').Client;
var resourceConfig = require('./config');
var resourceLogger = require('./logger').logger;
var constants = require('./constants.js');

class addWF {

    constructor(ctx, metadata) {
        this.Context = ctx;
        this.Metadata = metadata;

        this.client = new restClient();
        _this = this;
    }


    execute() {
        resourceLogger.verbose('addWF called');
        return new Promise(function (resolve, reject) {
            try {
                console.log('addWF called');
                let context = _this.Context;
                //let orderId = _this.Metadata.orderId;
                //suborders of single order
                let orderId = _this.Context.Suborders[0].orderId;
                if (context.shouldAddCancelSuborderWF || context.shouldAddCloseOrderWF) {
                    resourceLogger.verbose('addWF executing for OrderId - ' + orderId);
                    var data;
                    if (context.shouldAddCloseOrderWF) {
                        data = {};
                        data.metadata = {};
                        data.name = "CloseOrder";
                        data.version = "v1";
                        data.tags = ['suborderId'];
                        data.metadata.orderId = orderId;
                        resourceLogger.verbose('addWF.CloseOrder executing for OrderId - ' + orderId);
                    } else if (context.shouldAddCancelSuborderWF) {
                        data = [];
                        for (let _suborder of context.CancelSubordersList) {
                            let _data = {};
                            _data.metadata = {};
                            _data.name = "DCCancelRequest";
                            _data.version = "v1";
                            _data.tags = ['suborderId'];
                            _data.metadata.messageBody = _suborder.xmlBody;
                            _data.metadata.suborderId = _suborder.suborderId;
                            resourceLogger.verbose('addWF.DCCancelRequest executing for SuborderId - ' + _suborder.suborderId);
                            data.push(_data);
                        }                        
                    }

                    let promises = [];

                    if (context.SuborderCloseEventsData.length) {
                        for (let suborder in context.SuborderCloseEventsData) {
                            var CloseSuborderEventData = {};
                            CloseSuborderEventData.metadata = {};
                            CloseSuborderEventData.name = "SuborderCancelledEvent";
                            CloseSuborderEventData.version = "v1";
                            CloseSuborderEventData.tags = ['suborderId'];
                            CloseSuborderEventData.metadata.orderId = suborder.orderId;
                            CloseSuborderEventData.metadata.suborderId = suborder.suborderId;

                            let argsEvent = {
                                data: CloseSuborderEventData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };

                            promises.push(_this.post(argsEvent));
                        }
                    }

                    if (!data.length) {
                        let args = {
                            data: data,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        promises.push(_this.post(args));
                    } else {
                        for (let dataObj of data) {
                            let args = {
                                data: dataObj,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            promises.push(_this.post(args));
                        }
                    }

                    Promise.all(promises).then((result) => {
                        var response = {};
                        response.result = constants.results.Success;
                        response.errorMessage = '';
                        resolve(response);
                    }).catch((err) => {
                        let message = `addWF.execute(): reject ${JSON.stringify(err)}`;
                        resourceLogger.error(message);
                        var response = {};
                        response.result = constants.results.Failed;
                        response.errorMessage = message;
                        resolve(response);
                    });
                } else {
                    if (context.response)
                        resolve(context.response);
                    else
                        resolve({ result: constants.results.Failed, errorMessage: 'Suborder in in uncancellable status' })
                }
            } catch (exception) {
                let message = `addWF.execute(): reject ${JSON.stringify(exception)}`;
                resourceLogger.error(message);
                var response = {};
                response.result = constants.results.Failed;
                response.errorMessage = message;
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

module.exports = addWF;