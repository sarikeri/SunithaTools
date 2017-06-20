var moment = require('moment');
var mongoDataProvider = require('./../dataProviders/mongoDataProvider');
var businessValidations = require('./businessValidations');
var enums = require('./../utils/enums');
var constants = require('./../utils/constants');
var logger = require('./../utils/logger');
var os = require('os');
var getNextOrderSeq = require('./getNextOrderSeq');
var validateSchema = require('./../utils/validateSchema');
var createOrderSchema = require('./createOrderSchema.json');

class createOrder {
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
            response.order.clientOrderRefId = order.clientOrderRefId;

            let v = new validateSchema();
            try {
                let validationErrors = v.validate(order, createOrderSchema);
                if (validationErrors != null && validationErrors.length > 0) {
                    response.order.errorMessage = '';
                    validationErrors.forEach((vError) => {
                        response.order.errorMessage += vError.dataPath + ' ' + vError.message + ' ';
                    });
                    return _this.failureHandler(response, resolve, reject);
                }

                let b = new businessValidations();
                let result = b.validate(order);
                if (result.errorFlags != 0) {
                    response.order.errorFlags = result.errorFlags;
                    response.order.errorMessage = result.errorMessage;
                    return _this.failureHandler(response, resolve, reject);
                }

                // TODO: Evaluate if obtaining the sequence number in an async manner is better.
                // Pros: It will improve performance slightly (may be 20 ms) - may not be much since the counter collection does not have many rows
                // Cons: If schema and business validation is run in parallel with order sequence generation, there is a chance that validation fails and
                // sequence generation succeeds. If this happens, we will not create the order and so the sequence number will be unused.
                let orderSeq = new getNextOrderSeq();
                orderSeq.execute()
                    .then((orderId) => {
                        order.orderId = orderId;
                        _this.setOrderProps(order);
                        let dataProvider = new mongoDataProvider();
                        dataProvider.insert('orders', order)
                            .then((data) => {
                                response.order.orderId = order.orderId;
                                response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                                resolve(response);
                            })
                            .catch((err) => {
                                // 11000 is the error code that indicates unique constraint violation
                                if (err.code == "11000") {
                                    response.responseTimeStamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                                    response.order.errorFlags = constants.INITIALIZE_DUPLICATE_ORDER_GROUP;
                                    response.order.errorMessage = constants.INITIALIZE_DUPLICATE_ORDER_GROUP_MESSAGE;
                                    return resolve(response);
                                }
                                return _this.unexpectedError(err, response, resolve, reject);
                            });
                    })
                    .catch((orderSeqErr) => {
                        return _this.unexpectedError(orderSeqErr, response, resolve, reject);
                    });
            }
            catch (ex) {
                return _this.unexpectedError(ex, response, resolve, reject);
            }
        });
    }

    setOrderProps(order) {
        order.orderPlacedDate = new Date(order.orderPlacedDate);
        order.status = enums.orderStatus.mus;
        order.createDate = new Date();
        order.createdServer = os.hostname();
        for (let i = 0; i < order.groups.length; i++) {
            let group = order.groups[i];
            group.groupId = i + 1;
            group.shipAddr.addr1 = group.shipAddr.addr1.trim();
            if (group.shipAddr.addr2) {
                group.shipAddr.addr2 = group.shipAddr.addr2.trim();
            }
            group.shipAddr.city = group.shipAddr.city.trim();
            group.shipAddr.countryCode = group.shipAddr.countryCode.trim();
            group.shipAddr.fullName = group.shipAddr.fullName.trim();
            group.shipAddr.state = group.shipAddr.state.trim();
            group.shipAddr.postalCode = group.shipAddr.postalCode.trim();
            if (group.shipAddr.phones.length > 0) {
                group.shipAddr.phones[0].num = group.shipAddr.phones[0].num.trim();
            }
            if (group.shipAddr.phones.length > 1) {
                group.shipAddr.phones[1].num = group.shipAddr.phones[1].num.trim();
            }
            group.billAddr.addr1 = group.billAddr.addr1.trim();
            if (group.billAddr.addr2) {
            group.billAddr.addr2 = group.billAddr.addr2.trim();
            }
            group.billAddr.city = group.billAddr.city.trim();
            group.billAddr.countryCode = group.billAddr.countryCode.trim();
            group.billAddr.fullName = group.billAddr.fullName.trim();
            group.billAddr.state = group.billAddr.state.trim();
            group.billAddr.postalCode = group.billAddr.postalCode.trim();
            if (group.billAddr.phones.length > 0) {
                group.billAddr.phones[0].num = group.billAddr.phones[0].num.trim();
            }
            if (group.billAddr.phones.length > 1) {
                group.billAddr.phones[1].num = group.billAddr.phones[1].num.trim();
            }
            if (group.isGift) {
                group.giftMsgInfo.senderName = group.giftMsgInfo.senderName.trim();
                if (group.giftMsgInfo.msg) {
                    group.giftMsgInfo.msg = group.giftMsgInfo.msg.trim();
                }
            }
            for (let j = 0; j < group.lineItems.length; j++) {
                group.lineItems[j].lineItemId = j + 1;
            }
        }
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
        response.failureDescription = constants.ORDER_INJECTION_FAILURE_MESSAGE;
        return resolve(response);
    }
}

module.exports = createOrder;