var enums = require('./../utils/enums');
var constants = require('./../utils/constants');
var logger = require('./../utils/logger');
var moment = require('moment');
var mapping = require('./mapping.json');
var gOrder = require('./../getInternal/getOrder');
var gSuborders = require('./../utils/suborders');
var async = require("async");

var getOrderInfo = function (orderId, callback) {
    let g = new gOrder('', { orderId: orderId }, {});
    g.execute()
        .then((order) => {
            return callback(null, order);
        })
        .catch((err) => {
            return callback(err, null);
        });
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

class getOrder {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
    }

    execute() {
        var _this = this;
        let response = {};
        return new Promise(function (resolve, reject) {
            async.parallel([getOrderInfo.bind(null, _this.metadata.orderId), getSuborders.bind(null, _this.metadata.orderId)], function (err, results) {
                if (err) {
                    return _this.unexpectedError(err, response, resolve, reject);
                }
                let order = results[0];
                let suborders = results[1];
                if (order == null) {
                    response.errorFlags = constants.ORDER_ID_INVALID;
                    response.errorMessage = constants.ORDER_ID_INVALID_MESSAGE + constants.ERROR_MESSAGE_SEPARATOR;
                    return _this.failureHandler(response, resolve, reject);
                }
                order.orderPlacedDate = moment(order.orderPlacedDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                order.createDate = moment(order.createDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                response.clientId = order.clientId;
                response.resultCode = enums.resultCodes.success;
                response.failureDescription = '';
                response.order = {};
                response.order.siteId = order.siteId;
                response.order.clientOrderId = order.clientOrderId;
                response.order.clientOrderRefId = order.clientOrderRefId;
                response.order.orderId = order.orderId;
                response.order.fulfillmentStatus = mapping.orderFulfillmentStatus[order.status] != undefined ? mapping.orderFulfillmentStatus[order.status] : "In Progress";
                response.order.billingStatus = enums.orderBillingStatus.notApplicable;
                response.order.errorMessage = '';
                response.order.groups = [];
                order.groups.forEach((group) => {
                    let orderGroup = _this.buildGroup(group, suborders);
                    response.order.groups.push(orderGroup);
                });
                response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                return resolve(response);
            });
        });
    }

    buildGroup(group, suborders) {
        let orderGroup = {};
        orderGroup.groupId = group.groupId;
        orderGroup.clientGroupId = group.clientGroupId;
        orderGroup.clientGroupRefId = group.clientGroupRefId;
        orderGroup.subGroups = [];
        if (suborders != null) {
            let filteredSuborders = suborders.filter(function (so) {
                return (so.groupId == group.groupId);
            });
            filteredSuborders.forEach((suborder) => {
                let subGroup = {};
                subGroup.subGroupId = suborder.suborderId;
                subGroup.targetedFulfillmentDate = null;
                subGroup.targetedFulfillmentCenter = enums.targetedFulfillmentCenter[suborder.location.id];
                subGroup.fulfillmentStatus = mapping.subGroupFulfillmentStatus[suborder.status] != undefined ? mapping.subGroupFulfillmentStatus[suborder.status] : "In Progress"
                subGroup.billingStatus = enums.orderBillingStatus.notApplicable;
                if (suborder.status == enums.suborderStatus.cancelled) {
                    subGroup.reason = suborder.cancellationReason;
                    subGroup.performedBy = suborder.cancelledBy;
                    subGroup.performedDateTime = suborder.cancelledDate;
                }
                else {
                    subGroup.performedBy = constants.OMS;
                    subGroup.performedDateTime = suborder.updateDate;
                }
                subGroup.packages = [];
                if (suborder.packages != null) {
                    suborder.packages.forEach((soPackage) => {
                        let pkg = {};
                        pkg.packageId = soPackage.packageId;
                        pkg.carrierAndService = soPackage.carrierName;
                        pkg.carrierName = ''; // TODO: Do a pts_carrier_id mapping here soPackage.carrierId
                        pkg.shippedDateTime = suborder.shippedDate;
                        pkg.carrierMethod = soPackage.carrierMethod;
                        pkg.trackingURL = soPackage.trackingURL;
                        pkg.trackingNum = soPackage.trackingNumber;
                        pkg.shipCost = soPackage.shipCost;
                        pkg.boxMeasure = {};
                        pkg.boxMeasure.value = soPackage.weight;
                        pkg.boxMeasure.units = enums.units.lbs;
                        pkg.estimatedDeliveryDate = soPackage.expectedArrivalDate;
                        pkg.receivingBarcode = soPackage.receivingBarcode;
                        pkg.lineItems = [];
                        if (soPackage.lineItems) {
                            soPackage.lineItems.forEach((soPackageLi) => {
                                let lineItem = {};
                                lineItem.qty = soPackageLi.qty;
                                lineItem.unitCost = soPackageLi.unitCost;
                                group.lineItems.forEach((gLi) => {
                                    if (gLi.lineItemId === soPackageLi.lineItemId) {
                                        lineItem.clientLineItemId = gLi.clientLineItemId;
                                        lineItem.clientLineItemRefId = gLi.clientLineItemRefId;
                                        return;
                                    }
                                });
                                pkg.lineItems.push(lineItem);
                            });
                        }
                        subGroup.packages.push(pkg);
                    });
                }
                else {
                    subGroup.lineItems = [];
                    suborder.lineItems.forEach((soLi) => {
                        let lineItem = {};
                        lineItem.quantity = soLi.qtyOrdered;
                        group.lineItems.forEach((gLi) => {
                            if (gLi.lineItemId === soLi.lineItemId) {
                                lineItem.clientLineItemId = gLi.clientLineItemId;
                                lineItem.clientLineItemRefId = gLi.clientLineItemRefId;
                                return;
                            }
                        });
                        subGroup.lineItems.push(lineItem);
                    });
                }
                orderGroup.subGroups.push(subGroup);
            });
        }
        return orderGroup;
    }

    unexpectedError(error, response, resolve, reject) {
        if (error.stack) {
            logger.error(error.stack);
        } else {
            logger.error(error);
        }
        response.errorFlags = -1;
        response.errorMessage = 'An unexpected error has occurred.';
        return this.failureHandler(response, resolve, reject);
    }

    failureHandler(response, resolve, reject) {
        response.responseTimeStamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        response.resultCode = enums.resultCodes.failure;
        response.failureDescription = constants.ORDER_RETRIEVAL_FAILURE_MESSAGE;
        return resolve(response);
    }
}

module.exports = getOrder;