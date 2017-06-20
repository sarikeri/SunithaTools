var mongoDataProvider = require('./../dataProviders/mongoDataProvider');
var enums = require('./../utils/enums');
var logger = require('./../utils/logger');
var constants = require('./../utils/constants');
var moment = require('moment');

class closeOrder {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
    }

    execute() {
        var orderId = this.metadata.orderId;
        var _this = this;
        return new Promise(function (resolve, reject) {
            let response = {};
            response.orderId = orderId;
            let dataProvider = new mongoDataProvider();
            let query = { orderId: orderId };
            let update = { $set: { status: enums.orderStatus.completed } };
            dataProvider.update('orders', query, update, false, false)
                .then((closeResult) => {
                    if (closeResult.result.ok == 1 && closeResult.result.n == 1) {
                        if(closeResult.result.nModified == 1){
                            logger.verbose(`Order ${orderId} is set to ${enums.orderStatus.completed} status.`);  
                            response.result = enums.result.success;
                            response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                            return resolve(response);
                        } else if (closeResult.result.nModified == 0){
                            logger.verbose(`Order ${orderId} was already set to ${enums.orderStatus.completed} status. No modifications done.`);  
                            response.result = enums.result.success;
                            response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                            return resolve(response);
                        } 
                    } else {
                        logger.error(`Failed to close order for the order: ${orderId}. Close result: ${closeResult}`);
                        return _this.failureHandler(response, resolve);
                    }
                })
                .catch((err) => {
                    logger.error(`Failed to close order for the order: ${orderId}. Error: ${err}`);
                    return _this.failureHandler(response, resolve);
                });
        });
    }

    failureHandler(response, resolve) {
        response.responseTimeStamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        response.result = enums.result.failure;
        response.errorMessage = constants.ORDER_CLOSE_FAILURE_MESSAGE;
        return resolve(response);
    }
}

module.exports = closeOrder;