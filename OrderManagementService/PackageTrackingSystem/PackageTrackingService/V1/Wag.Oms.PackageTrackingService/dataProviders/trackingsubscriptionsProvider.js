var _this;
var trackingSubscriptionsRepository = require('../dalRepositories/trackingSubscriptionsRepository.js');
var trackingSubscriptionsRepositoryObj = new trackingSubscriptionsRepository();

class TrackingSubscriptionsProvider {
    constructor() {
        _this = this;
    }

    setTrackingSubscriptions(ClientId, PackageDetails) {
        return new Promise(function (resolve, reject) {
            var failedSubscriptions = [];
            var loopLength = 0;
            var loopCount = 0;
            var successCount = 0;
            for (var i = 0, packLen = PackageDetails.length; i < packLen; i++) {
                var packageDetail = PackageDetails[i];

                var clientIds = [];
                if (packageDetail.SecondarySubscribingClientIds && Array.isArray(packageDetail.SecondarySubscribingClientIds) && packageDetail.SecondarySubscribingClientIds.length > 0) {
                    clientIds = clientIds.concat(packageDetail.SecondarySubscribingClientIds);
                }
                clientIds.push(ClientId);

                loopLength = PackageDetails.length * clientIds.length;

                for (var c = 0, clientLen = clientIds.length; c < clientLen; c++) {
                    trackingSubscriptionsRepositoryObj.getTrackingSubscriptions(clientIds[c], packageDetail)
                        .then(function (data) {
                            if (data.data.length > 0) {
                                //resolve(data.data);
                                successCount++;
                                loopCount++;
                                _this.returnPromise(loopLength, loopCount, resolve, reject, failedSubscriptions, successCount);
                            }
                            else {
                                trackingSubscriptionsRepositoryObj.addTrackingSubscriptions(data.ClientId, data.PackageDetail)
                                    .then(function (result) {
                                        //resolve(result);
                                        successCount++;
                                        loopCount++;
                                        _this.returnPromise(loopLength, loopCount, resolve, reject, failedSubscriptions, successCount);
                                    })
                                    .catch(function (err) {
                                        //reject(err);
                                        var failedSubscription = {};
                                        var errorMessages = [];
                                        errorMessages.push(err.err.message);
                                        failedSubscription.ClientId = err.data.ClientId;
                                        failedSubscription.SiteId = err.data.SiteId;
                                        failedSubscription.ShippingDateTime = err.data.ShippingDateTime;
                                        failedSubscription.CarrierId = err.data.CarrierId;
                                        failedSubscription.TrackingId = err.data.TrackingId;
                                        failedSubscription.OrderId = err.data.OrderId;
                                        failedSubscription.FailureDescription = errorMessages.toString();

                                        failedSubscriptions.push(failedSubscription);
                                        //reject(failedSubscriptions);
                                        loopCount++;
                                        _this.returnPromise(loopLength, loopCount, resolve, reject, failedSubscriptions, successCount);
                                    });
                            }
                        })
                        .catch(function (err) {
                            //reject(err);
                            var failedSubscription = {};
                            var errorMessages = [];
                            errorMessages.push(err.err.message);
                            failedSubscription.ClientId = err.data.ClientId;
                            failedSubscription.SiteId = err.data.SiteId;
                            failedSubscription.ShippingDateTime = err.data.ShippingDateTime;
                            failedSubscription.CarrierId = err.data.CarrierId;
                            failedSubscription.TrackingId = err.data.TrackingId;
                            failedSubscription.OrderId = err.data.OrderId;
                            failedSubscription.FailureDescription = errorMessages.toString();

                            failedSubscriptions.push(failedSubscription);
                            //reject(failedSubscriptions);
                            loopCount++;
                            _this.returnPromise(loopLength, loopCount, resolve, reject, failedSubscriptions, successCount);
                        });
                }
            }
        });
    }

    returnPromise(loopLength, loopCount, resolve, reject, failedSubscriptions, successCount) {
        if (loopCount >= loopLength) {
            if (failedSubscriptions.length > 0) {
                var err = {
                    successCount: successCount,
                    failedSubscriptions: failedSubscriptions
                };

                reject(err);
            }
            resolve("OK");
        }
    }
}

module.exports = TrackingSubscriptionsProvider;