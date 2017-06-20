var _this;
var mongorepository = require('./../../../dataProviders/mongoRep');
var resourceConfig = require('./config');
var resourceLogger = require('./logger').logger;
var constants = require('./constants.js');
var xmlBuilder = require('xmlbuilder');
var moment = require('moment');

class cancel {

    constructor(ctx, metadata) {
        this.Context = ctx;
        this.Metadata = metadata;
        _this = this;
    }


    execute() {
        resourceLogger.verbose('cancel called');
        return new Promise(function (resolve, reject) {
            try {
                console.log('cancel called');
                if (_this.Context.Suborders != null && _this.Context.Suborders != undefined) {
                    resourceLogger.verbose('cancel executing for OrderId - ' + _this.Metadata.orderId);
                    var context = _this.Context;
                    var errorMessage = undefined;
                    var taskResult = {};
                    let Suborders = context.Suborders;
                    let query = {
                        suborderId: {
                            $in: []
                        }
                    };
                    /*let update = {
                        $set: {
                            flag: { isCancelPending: true }
                        }
                    };*/
                    context.SuborderCloseEventsData = [];
                    context.CancelledCount = 0;
                    context.DelayedCancelledCount = 0;
                    context.ImmediateCancelCount = 0;
                    context.NotCancelled = {};
                    context.NotCancelled.count = 0;
                    context.NotCancelled.message = 'Not all suborders are cancelled : ';
                    context.DelayedCancel = [];
                    let promises = [];

                    for (let Suborder of Suborders) {

                        switch (Suborder.status) {
                            case constants.subOrderStatus.Cancelled:
                                context.CancelledCount++;
                                break;
                            case constants.subOrderStatus.Shipped:
                                query.suborderId.$in.push(Suborder.suborderId);
                                context.DelayedCancel.push(_this.build20605(Suborder));
                                context.DelayedCancelledCount++;
                                break;
                            case constants.subOrderStatus.BackOrdared:
                                Suborder.cancellationReason = (Suborder.cancellationReason) ? Suborder.cancellationReason : "Cancellation requested";
                                Suborder.cancelledBy = (Suborder.cancelledBy) ? Suborder.cancelledBy : "SuborderCancellationService";
                                promises.push(_this.doImmediateCancel(Suborder));
                                context.SuborderCloseEventsData.push({orderId: Suborder.orderId, suborderId: Suborder.suborderId});
                                context.ImmediateCancelCount++;
                                break;
                            default:
                                context.NotCancelled.count++;
                                context.NotCancelled.message += 'Suborder-' + Suborder.suborderId + ' in status-' + Suborder.status;
                        }
                    }

                    /*
                    if (query.suborderId.$in.length > 0)
                        promises.push(_this.update(query, update))
                    */
                    if (context.DelayedCancelledCount > 0 && context.ImmediateCancelCount > 0) {
                        Promise.all(promises).then((results) => {
                            let status = true;
                            var response = {};
                            response.result = constants.results.Success;
                            response.errorMessage = '';

                            for (let result of results) {
                                if (result.result == constants.results.Fail) {
                                    status = false;
                                    response.errorMessage += ' | ' + result.errorMessage;
                                }
                            }
                            if (status) {
                                context.shouldAddCancelSuborderWF = true;
                                context.CancelSubordersList = context.DelayedCancel;
                                response.result = constants.results.Success;
                                response.errorMessage = '';
                            } else {
                                context.shouldAddCancelSuborderWF = false;
                            }

                            resolve(response);
                        }).catch((err) => {                            
                            let message = `cancel.execute(): reject ${JSON.stringify(err)}`;
                            resourceLogger.error(message);
                            var response = {};
                            response.result = constants.results.Failed;
                            response.errorMessage = message;
                            resolve(response);
                        });
                    } else if (context.DelayedCancelledCount > 0) {
                        /*Promise.all(promises).then((results) => {                            
                        let status = true;
                        var response = {};
                        response.result = constants.results.Success;
                        response.errorMessage = '';

                        for (let result of results) {
                            if (result.result == constants.results.Fail) {
                                status = false;
                                response.errorMessage += ' | ' + result.errorMessage;
                            }
                        }
                        if (status) {*/
                        var response = {};
                        context.shouldAddCancelSuborderWF = true;
                        context.CancelSubordersList = context.DelayedCancel;
                        response.result = constants.results.Success;
                        response.errorMessage = '';
                        /* } else {
                             context.shouldAddCancelSuborderWF = false;
                         }*/
                        resolve(response);
                        /* }).catch((err) => {
                             let message = `cancel.execute(): reject ${JSON.stringify(err)}`;
                             resourceLogger.error(message);
                             var response = {};
                             response.result = constants.results.Retry;
                             response.errorMessage = message;
                             resolve(response);
                         });*/
                    } else if (context.ImmediateCancelCount > 0) {
                        Promise.all(promises).then((results) => {
                            let status = true;
                            var response = {};
                            response.result = constants.results.Success;
                            response.errorMessage = '';

                            for (let result of results) {
                                if (result.result == constants.results.Fail) {
                                    status = false;
                                    response.errorMessage += ' | ' + result.errorMessage;
                                }
                            }
                            if (status) {
                                context.CancelSubordersList = context.DelayedCancel;
                                response.result = constants.results.Success;
                                response.errorMessage = '';

                                if ((context.CancelledCount + context.ImmediateCancelCount) == Suborders.length)
                                    context.shouldAddCloseOrderWF = true;
                            } else {
                                context.shouldAddCancelSuborderWF = false;
                            }
                            resolve(response);
                        }).catch((err) => {
                            let message = `cancel.execute(): reject ${JSON.stringify(err)}`;
                            resourceLogger.error(message);
                            var response = {};
                            response.result = constants.results.Failed;
                            response.errorMessage = message;
                            resolve(response);
                        });
                    } else if (context.CancelledCount == Suborders.length) {
                        context.shouldAddCloseOrderWF = true;
                        var response = {};
                        response.result = constants.results.Success;
                        response.errorMessage = '';
                        resolve(response);
                    } else if (context.NotCancelled.count > 0 && context.NotCancelled.count != Suborders.length) {
                        var response = {};
                        response.result = constants.results.Success;
                        response.errorMessage = '';
                        context.response = response;
                        resolve(response);
                    } else if (context.NotCancelled.count > 0) {
                        var response = {};
                        response.result = constants.results.Failed;
                        response.errorMessage = context.NotCancelled.message;
                        context.response = response;
                        resolve(response);
                    } else {
                        var response = {};
                        response.result = constants.results.Failed;
                        response.errorMessage = 'Suborders have uncancellable status';
                        context.response = response;
                        resolve(response);
                    }
                } else {
                    let message = "Message is null";
                    resourceLogger.error(message);
                    let response = {};
                    response.result = constants.results.ValidationFailed;
                    response.errorMessage = message;
                    resolve(response);
                }

            } catch (exception) {
                let message = `cancel.execute(): reject ${JSON.stringify(exception)}`;
                resourceLogger.error(message);
                var response = {};
                response.result = constants.results.Failed;
                response.errorMessage = message;
                resolve(response);
            }
        });
    }

    doImmediateCancel(suborder) {
        return new Promise((resolve, reject) => {
            var query = {
                suborderId: suborder.suborderId
            };
            let now = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            let update = {
                '$set': {
                    status: constants.subOrderStatus.Cancelled,
                    cancellationReason: suborder.cancellationReason,
                    cancelledBy: suborder.cancelledBy,
                    cancellationDate: now,
                    updateDate: now,
                    updateBy: 'CancellationHandler'
                }
            };
            let repository = new mongorepository();

            repository.update('suborders', query, update)
                .then((data) => {
                    resolve({
                        //suborderId: suborder.suborderId,
                        result: constants.results.Success,
                        errorMessage: ''
                    });
                })
                .catch((err) => {
                    let message = `cancel.doImmediateCancel(): reject ${JSON.stringify(err)}`;
                    resourceLogger.error(message);
                    var response = {};
                    response.result = constants.results.Failed;
                    response.errorMessage = message;
                    resolve(response);
                });
        });
    }

    build20605(suborder) {
        /*<Message MsgType="20605" Flow="FEToDC" Version="1" DCType="8"><DCID>8</DCID><SuborderID>05163512256101</SuborderID></Message>*/
        let body = {};
        body.Message = {};
        body.Message = {
            '@MsgType': '20605',
            '@Flow': 'FEToDC',
            '@Version': '1',
            '@LocationType': suborder.location.type,
        };
        body.Message.LocationId = suborder.location.id;
        body.Message.SuborderID = suborder.suborderId;
        let xmlBody = xmlBuilder.create(body).end({
            pretty: true,
            newline: '',
        }).replace(/<\?xml version=\"1.0\"\?>/g, '').replace(/\\/g, '');
        return {
            suborderId: suborder.suborderId,
            xmlBody: xmlBody
        };
    }

    update(query, update) {
        console.log('Update called');
        var _this = this;
        return new Promise(function (resolve, reject) {
            let repository = new mongorepository();
            repository.update('suborders', query, update)
                .then((data) => {
                    if (data.result.n > 0 && data.result.ok == 1 && data.result.nModified > 0)
                        resolve({
                            status: constants.results.Success,
                            errorMessage: ''
                        });
                    else if (data.result.n > 0 && data.result.ok == 1 && data.result.nModified == 0)
                        resolve({
                            status: constants.results.Success,
                            errorMessage: ''
                        });
                    else
                        resolve({
                            status: constants.results.Failed,
                            errorMessage: 'Unable to update suborder'
                        });
                })
                .catch((err) => {
                    resolve({
                        status: constants.results.Failed,
                        errorMessage: JSON.stringify(err)
                    });
                });

        });
    }

}

module.exports = cancel;