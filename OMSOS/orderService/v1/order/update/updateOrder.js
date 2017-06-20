var moment = require('moment');
var os = require('os');
var merge = require('merge');
var async = require("async");
var mongoDataProvider = require('./../dataProviders/mongoDataProvider');
var vSchema = require('./../utils/validateSchema');
var businessValidations = require('./businessValidations');
var enums = require('./../utils/enums');
var constants = require('./../utils/constants');
var logger = require('./../utils/logger');
var getOrder = require('./../getInternal/getOrder');
var updateSchema = require('./updateOrderSchema.json');
var cancelSchema = require('./cancelOrderSchema.json');
var injectWF = require('./../utils/injectWorkflow');
var gSuborders = require('./../utils/suborders');
var mapping = require('./../get/mapping.json');

var getOrderInfo = function (orderId, callback) {
    let g = new getOrder('', { orderId: orderId }, {});
    g.execute()
        .then((existingOrder) => {
            return callback(null, existingOrder);
        })
        .catch((err) => {
            return callback(err, null);
        });
}

var validateSchema = function (order, schema, callback) {
    let v = new vSchema();
    let vResults = v.validate(order, schema);
    callback(null, vResults);
}

var getSuborders = function (orderId, callback) {
    let g = new gSuborders();
    g.get(orderId)
        .then((suborders) => {
            return callback(null, suborders);
        })
        .catch((err) => {
            return callback(err, null);
        });
}

class updateOrder {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
    }

    execute() {
        var order = this.metadata;
        var _this = this;
        return new Promise(function (resolve, reject) {
            let response = {};
            response.clientId = order.clientId;
            response.resultCode = enums.resultCodes.success;
            response.order = {};
            response.order.clientOrderId = order.clientOrderId;
            response.order.orderId = order.orderId;
            response.order.clientOrderRefId = order.clientOrderRefId;
            response.order.errorFlags = 0;
            response.order.errorMessage = '';
            let validationSchema = cancelSchema;
            if (order.action == enums.action.release) {
                validationSchema = updateSchema;
            }
            async.parallel([getOrderInfo.bind(null, order.orderId), getSuborders.bind(null, order.orderId), validateSchema.bind(null, order, validationSchema)], function (err, results) {
                try {
                    if (err) {
                        return _this.unexpectedError(err, response, resolve, reject);
                    } else {
                        let existingOrder = results[0];
                        if (existingOrder == null || existingOrder.clientId != order.clientId) {
                            response.order.errorFlags = constants.ORDER_ID_INVALID;
                            response.order.errorMessage = constants.ORDER_ID_CLIENT_ID_INVALID_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
                            return _this.failureHandler(response, resolve, reject);
                        }
                        let suborders = results[1];
                        response.order.clientOrderId = existingOrder.clientOrderId;

                        // handle schema validation errors
                        let validationErrors = results[2];
                        if (validationErrors != null && validationErrors.length > 0) {
                            response.order.errorMessage = '';
                            validationErrors.forEach((vError) => {
                                response.order.errorMessage += vError.dataPath + ' ' + vError.message + ' ';
                            });
                            return _this.failureHandler(response, resolve, reject);
                        }

                        // biz validations
                        let b = new businessValidations();
                        let result = b.validateOrderStatus(existingOrder.status, order.action);
                        if (result.errorFlags != 0) {
                            response.order.errorFlags = result.errorFlags;
                            response.order.errorMessage = result.errorMessage;
                            return _this.failureHandler(response, resolve, reject);
                        }

                        if (!existingOrder.modificationsByClient) {
                            existingOrder.modificationsByClient = [];
                        }
                        existingOrder.modificationsByClient.push({ action: order.action, reason: order.modifyReason, source: order.modifiedBy, date: new Date() });

                        if (order.action == enums.action.cancelAll) {
                            _this.cancelOrder(existingOrder, suborders, existingOrder.modificationsByClient, response, resolve, reject);
                        } else {
                            _this.updateAndReleaseOrder(order, existingOrder, suborders, response, resolve, reject)
                        }
                    }
                }
                catch (ex) {
                    return _this.unexpectedError(ex, response, resolve, reject);
                }
            });
        });
    }

    cancelOrder(existingOrder, suborders, modifications, response, resolve, reject) {
        let orderStatus = enums.orderStatus.cancelPending;
        if (!suborders.length) {
            orderStatus = enums.orderStatus.completed;
        }
        // Update the order status if the order is not already in cancel pending or completed
        let query = { orderId: existingOrder.orderId, status: { $nin: [enums.orderStatus.cancelPending, enums.orderStatus.completed] } };
        let update = { $set: { status: orderStatus, modificationsByClient: modifications } };
        let dataProvider = new mongoDataProvider();
        let startTime = new Date();
        dataProvider.update('orders', query, update, false, false)
            .then((cancelResult) => {
                logger.verbose(`Order document update (cancel request) for ${existingOrder.orderId} took: ${(new Date() - startTime)}ms`);
                response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                if (cancelResult.result.n == 1 && cancelResult.result.ok == 1 && cancelResult.result.nModified == 1) {
                    logger.info(`Order ${existingOrder.orderId} is set to ${orderStatus} status.`);
                    this.buildResponse(existingOrder, suborders, response);
                    if (suborders.length) {
                        return this.injectCancelOrderWorkflow(existingOrder.orderId, modifications.modifiedBy,
                            modifications.modifyReason, response, resolve, reject);
                    }
                    response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                    return resolve(response);
                } else {
                    logger.error(`Failed to attempt order cancellation for the order: ${existingOrder.orderId}. Cancel result: ${cancelResult}`);
                    return this.failureHandler(response, resolve, reject);
                }
            })
            .catch((err) => {
                return this.unexpectedError(err, response, resolve, reject);
            });
    }

    injectCancelOrderWorkflow(orderId, cancelledBy, cancelReason, response, resolve, reject) {
        let metadata = {};
        metadata.orderId = orderId;
        metadata.cancellationReason = cancelReason;
        metadata.cancelledBy = cancelledBy;
        metadata.cancelDateTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        let injectWorkflow = new injectWF();
        injectWorkflow.inject('CancelOrder', metadata)
            .then(() => {
                logger.info(`Cancel order workflow injected for order id: ${orderId}`);
            })
            .catch((err) => {
                if (err.stack) {
                    logger.error(err.stack);
                } else {
                    logger.error(err);
                }
            })
            .then(() => {
                response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                return resolve(response);
            });
    }

    updateAndReleaseOrder(order, existingOrder, suborders, response, resolve, reject) {
        let b = new businessValidations();
        let result = b.validateGroups(order, existingOrder.groups);
        if (result.errorFlags != 0) {
            response.order.errorFlags = result.errorFlags;
            response.order.errorMessage = result.errorMessage;
            return this.failureHandler(response, resolve, reject);
        }

        let query = { orderId: order.orderId, status: enums.orderStatus.mus };
        // merge and persist order
        this.mergeOrder(existingOrder, order);
        existingOrder.status = enums.orderStatus.musExpired;

        let dataProvider = new mongoDataProvider();
        let startTime = new Date();
        dataProvider.update('orders', query, existingOrder, false, false)
            .then((updateResult) => {
                logger.verbose(`Order document update for ${existingOrder.orderId} took: ${(new Date() - startTime)}ms`);
                if (updateResult.result.n == 1 && updateResult.result.ok == 1 && updateResult.result.nModified == 1) {
                    logger.info(`Order ${order.orderId} is updated and released successfully.`);
                    this.buildResponse(existingOrder, suborders, response);
                    return this.injectRouteOrderWorkflow(existingOrder.orderId, response, resolve, reject);
                } else {
                    logger.error(`Failed to update the order: ${order.orderId}. Update result: ${updateResult}`);
                    return this.failureHandler(response, resolve, reject);
                }
            })
            .catch((err) => {
                return this.unexpectedError(err, response, resolve, reject);
            });
    }

    mergeOrder(existingOrder, order) {
        existingOrder.total = merge(existingOrder.total, order.total);
        if (order.groups == null) {
            return;
        }
        order.groups.forEach((group) => {
            for (let i = 0; i < existingOrder.groups.length; i++) {
                if (group.clientGroupId == existingOrder.groups[i].clientGroupId) {
                    existingOrder.groups[i].shipMethodId = group.shipMethodId;
                    if (group.shipAddr) {
                        existingOrder.groups[i].shipAddr.addr1 = group.shipAddr.addr1.trim();
                        if (group.shipAddr.addr2) {
                            existingOrder.groups[i].shipAddr.addr2 = group.shipAddr.addr2.trim();
                        }
                    }
                    existingOrder.groups[i].extraPackingSlipInfo = merge(existingOrder.groups[i].extraPackingSlipInfo, group.extraPackingSlipInfo);
                    existingOrder.groups[i].lineItems.forEach((lineItem) => {
                        for (let j = 0; j < group.lineItems.length; j++) {
                            if (lineItem.clientLineItemId == group.lineItems[j].clientLineItemId) {
                                lineItem = merge(lineItem, group.lineItems[j]);
                                break;
                            }
                        }
                    });
                    break;
                }
            }
        });
    }

    buildResponse(existingOrder, suborders, response) {
        response.order.groups = [];
        for (let i = 0; i < existingOrder.groups.length; i++) {
            let group = existingOrder.groups[i];
            let orderGroup = {};
            orderGroup.clientGroupId = group.groupId;
            orderGroup.clientGroupRefId = group.clientGroupRefId;
            orderGroup.subGroups = [];
            if (suborders != null) {
                let subGroups1 = suborders.filter(function (so) {
                    return (so.groupId == group.groupId);
                });
                let suborder = {};
                for (let k = 0; k < subGroups1.length; k++) {
                    let suborderGroup = {};
                    let suborder = suborders[k];
                    suborderGroup.subGroupId = suborder.suborderId;
                    suborderGroup.fulfillmentStatus = mapping.subGroupFulfillmentStatus[suborder.status] != undefined ? mapping.subGroupFulfillmentStatus[suborder.status] : "In Progress";
                    if (suborder.lineItems != null) {
                        suborderGroup.lineItems = [];
                        for (let j = 0; j < suborder.lineItems.length; j++) {
                            let lineItem = {};
                            lineItem.quantity = suborder.lineItems[j].qtyOrdered;
                            lineItem.clientLineItemId = group.lineItems.filter(x => { x.lineitemId == suborder.lineItems[j].lineitemId; return x.clientLineItemId; })[0].clientLineItemId;
                            lineItem.clientLineItemRefId = group.lineItems.filter(x => { x.lineitemId == suborder.lineItems[j].lineitemId; return x.clientLineItemRefId; })[0].clientLineItemRefId;
                            suborderGroup.lineItems.push(lineItem);
                        }
                        orderGroup.subGroups.push(suborderGroup);
                    }
                }
            }
            response.order.groups.push(orderGroup);
        }
    }

    injectRouteOrderWorkflow(orderId, response, resolve, reject) {
        let metadata = {};
        metadata.orderId = orderId;
        let injectWorkflow = new injectWF();
        injectWorkflow.inject('RouteOrder', metadata)
            .then(() => {
                logger.info(`Route order workflow injected for order id: ${orderId}`);
            })
            .catch((err) => {
                if (err.stack) {
                    logger.error(err.stack);
                } else {
                    logger.error(err);
                }
            })
            .then(() => {
                response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                return resolve(response);
            });
    }

    unexpectedError(error, response, resolve, reject) {
        if (error.stack) {
            logger.error(error.stack);
        } else {
            logger.error(error);
        }
        response.order.errorFlags = -1;
        response.order.errorMessage = 'An unexpected error has occurred.';
        return this.failureHandler(response, resolve, reject);
    }

    failureHandler(response, resolve, reject) {
        response.responseTimeStamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        response.resultCode = enums.resultCodes.failure;
        response.failureDescription = constants.ORDER_MODIFY_FAILURE_MESSAGE;
        return resolve(response);
    }
}

module.exports = updateOrder;