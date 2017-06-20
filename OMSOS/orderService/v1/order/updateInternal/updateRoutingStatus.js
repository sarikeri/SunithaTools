var _this;
var mongoDataProvider = require('./../dataProviders/mongoDataProvider');
var enums = require('./../utils/enums');
var constants = require('./../utils/constants');
var logger = require('./../utils/logger');
var moment = require('moment');

class updateRoutingStatus {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
        _this = this;
    }

    execute() {
        return new Promise(function (resolve, reject) {
            let response = {};
            response.result = enums.result.success;

            let query = {
                orderId: _this.metadata.orderId
            };

            let update = {
                $set: {
                    status: _this.metadata.status,
                    reason: _this.metadata.reason,
                    updateDate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                }
            };

            let dataProvider = new mongoDataProvider();
            dataProvider.update('orders', query, update, false, false)
                .then((cancelResult) => {
                    response.responseTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                    return resolve(response);
                })
                .catch((err) => {
                    return _this.unexpectedError(err, response, reject);
                });

        });
    }

    unexpectedError(error, response, reject) {
        logger.error(error.stack);
        response.errorMessage = 'An unexpected error has occurred.';
        return _this.failureHandler(response, reject);
    }

    failureHandler(response, reject) {
        response.responseTimeStamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        response.result = enums.result.failure;
        response.failureDescription = constants.ORDER_MODIFY_FAILURE_MESSAGE;
        return reject(response);
    }
}

module.exports = updateRoutingStatus;