var mongoDataProvider = require('./../dataProviders/mongoDataProvider');
var logger = require('./../utils/logger');
var enums = require('./../utils/enums');

class getOrder {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
    }

    execute() {
        let startTime = new Date();
        var _this = this;
        return new Promise(function (resolve, reject) {
            let response = {};
            // this condition is to avoid query injection attack
            if (!(new RegExp(/^\d{14}$/).test(_this.metadata.orderId))) {
                logger.info(`Invalid order id: ${_this.metadata.orderId}`);
                response.result = enums.result.failure;
                response.errorMessage = `Invalid order id: ${_this.metadata.orderId}`;
                return resolve(response);
            }

            let dataProvider = new mongoDataProvider();
            let query = { orderId: _this.metadata.orderId };
            dataProvider.findOne('orders', query, _this.metadata.projection)
                .then((order) => {
                    response.result = enums.result.success;
                    response.order = order;
                })
                .catch((err) => {
                    if (err.stack) {
                        logger.error(err.stack);
                    } else {
                        logger.error(err);
                    }
                    response.result = enums.result.failure;
                    response.errorMessage = `There was an error retrieving the order ${_this.metadata.orderId}`;
                })
                .then(() => {
                    logger.verbose(`Order document fetch took: ${(new Date() - startTime)}ms`);
                    return resolve(response);
                });
        });
    }
}

module.exports = getOrder;