var mongorepository = require('./../../../dataProviders/mongoRep');
var resourceLogger = require('./logger').logger;
var constants = require('./constants.js');
var moment = require('moment');
var _this;

class getSubOrderDetails {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
        _this = this;
    }

    execute() {
        resourceLogger.verbose('getSubOrderDetails called');
        return new Promise(function (resolve, reject) {
            try {
                console.log('cancel getSubOrderDetails');
                if (_this.metadata && _this.metadata.length) {
                    resourceLogger.verbose('getSubOrderDetails executing');
                    let context = _this.context;
                    let isValid = true;
                    let suborderIds = [];
                    //Validating
                    _this.metadata.forEach(function (suborder) {
                        if (!suborder.suborderId)
                            isValid = false;
                        else
                            suborderIds.push(suborder.suborderId);
                    });

                    if (!isValid) {
                        let response = {};
                        response.result = constants.results.Failed;
                        response.errorMessage = "SuborderId is missing";
                        return resolve(response);
                    }

                    /*
                    let suborderIds = _this.metadata.map(function (suborder) {
                        return suborder.suborderId;
                    })
                    */

                    let query = {
                        suborderId: {
                            $in: suborderIds
                        }
                    };

                    let projection = {};
                    let repository = new mongorepository();
                    repository.find('suborders', query, projection)
                        .then((suborders) => {
                            /*Remove
                            for (let suborder of suborders) {
                                suborder.shippedDate = moment(suborder.shippedDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                                suborder.packages = suborder.packages.map((eachPackage) => {
                                    eachPackage.estimatedArrivalDate = moment(eachPackage.estimatedArrivalDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                                    return eachPackage;
                                });
                            }
                            */

                            _this.metadata.forEach(function (suborder) {
                                let sub = suborders.find(o => o.suborderId == suborder.suborderId);
                                if (sub) {
                                    if (!suborder.cancellationReason)
                                        sub.cancellationReason = "Cancellation requested";
                                    else
                                        sub.cancellationReason = suborder.cancellationReason;

                                    if (!suborder.cancelledBy)
                                        sub.cancelledBy = "SuborderCancellationHandler";
                                    else
                                        sub.cancelledBy = suborder.cancelledBy;
                                } else {
                                    var response = {};
                                    response.result = constants.results.Failed;
                                    response.errorMessage = 'Unable to get suborder details from database';
                                    return resolve(response);
                                }
                            });

                            context.Suborders = suborders;

                            var response = {};
                            response.result = constants.results.Success;
                            response.errorMessage = '';
                            resolve(response);
                        }).catch((err) => {
                            let message = `getSubOrderDetails.execute(): reject ${JSON.stringify(err)}`;
                            resourceLogger.error(message);
                            var response = {};
                            response.result = constants.results.Failed;
                            response.errorMessage = message;
                            resolve(response);
                        });
                } else {
                    let message = "Message is null";
                    resourceLogger.error(message);
                    let response = {};
                    response.result = constants.results.ValidationFailed;
                    response.errorMessage = message;
                    resolve(response);
                }
            } catch (exception) {
                let message = `getSubOrderDetails.execute(): reject ${JSON.stringify(exception)}`;
                resourceLogger.error(message);
                var response = {};
                response.result = constants.results.Failed;
                response.errorMessage = message;
                resolve(response);
            }
        });
    }
}

module.exports = getSubOrderDetails;