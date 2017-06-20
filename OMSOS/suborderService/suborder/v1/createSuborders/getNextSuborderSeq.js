var mongorepository = require('./../../../dataProviders/mongoRep');
var constants = require('./constants.js');
var getNextSuborderSeq = {}
var resourceLogger = require('./logger').logger;

getNextSuborderSeq.getNextSuborderIdByOrderId = function (id) {
    return new Promise(function (resolve, reject) {
        var repository = new mongorepository();
        resourceLogger.verbose('getNextSuborderSeq.getNextSuborderIdByOrderId executing for OrderId - ' + id);

        repository.find('suborders', { orderId: id }, {}).then((suborders) => {
            let maxSuborderId;
            if (suborders != null && suborders != undefined) {
                if (suborders.length > 0) {
                    maxSuborderId = Math.max.apply(Math, suborders.map(function (suborder) {
                        return suborder.suborderId;
                    }));
                    //TODO: Need some more work with creating next suborderID
                    maxSuborderId++;
                } else {
                    maxSuborderId = ++id;
                }
            } else
                maxSuborderId++;
            resolve(maxSuborderId);
        }).catch((err) => {
            let message = `getNextSuborderSeq.getNextSuborderIdByOrderId(): reject ${JSON.stringify(err)}`;
            resourceLogger.error(message);
            var response = {};
            response.result = constants.results.Failed;
            response.errorMessage = message;
            resolve(response);
        });
    });
};

module.exports = getNextSuborderSeq;