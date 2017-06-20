var _this;
var moment = require('moment-timezone');
var config = require('../config.js');
var logger = require('../utils/logger.js');
var common = require('../utils/common.js');
var validator = require('validator');
var deasync = require('deasync');
var trackingsubscriptionsProvider = require('../dataProviders/trackingsubscriptionsProvider.js');
var trackingsubscriptionsProviderObj = new trackingsubscriptionsProvider();
var clientConfigurationProvider = require('../dataProviders/clientConfigurationProvider.js');
var clientConfigurationProviderObj = new clientConfigurationProvider();

class TrackingSubscriptionsHandler {
    constructor() {
        _this = this;

        //loading client configurations
        _this.ClientConfigs = [];
        _this.ClientConfigs = _this.getClientsSync();
    }

    setTrackingSubscriptions(ClientId, ClientRequestReferenceId, PackageDetails) {
        return new Promise(function (resolve, reject) {
            for (var pd = 0, packagelen = PackageDetails.length; pd < packagelen; pd++) {
                PackageDetails[pd].DestinationZipCode = common.get5DigitZipCode(PackageDetails[pd].DestinationZipCode);
            }
            _this.validateParameters(ClientId, ClientRequestReferenceId, PackageDetails)
                .then(function (validate) {
                    var trackingSubscriptions = {};

                    trackingSubscriptions.ClientId = ClientId;
                    trackingSubscriptions.ClientRequestReferenceId = ClientRequestReferenceId;
                    trackingSubscriptions.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                    trackingSubscriptions.ResultCode = validate.ValidPackateDetails.length > 0 ? 0 : 1;
                    trackingSubscriptions.FailureDescription = validate.FailureDescription;
                    trackingSubscriptions.FailedPackageDetails = validate.message;
                    if (validate.ValidPackateDetails.length > 0) {

                        trackingsubscriptionsProviderObj.setTrackingSubscriptions(ClientId, validate.ValidPackateDetails)
                            .then(function (data) {
                                trackingSubscriptions.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                                resolve(trackingSubscriptions);
                            })
                            .catch(function (err) {
                                //logger.error(err.ErrorMessages[0]);
                                trackingSubscriptions.ResultCode = err.successCount.length > 0 ? 0 : 1; //0 – Success; 1 – Failure;
                                for (var e = 0; e < err.failedSubscriptions.length; e++) {
                                    err.failedSubscriptions[e].ShippingDateTime = moment(err.failedSubscriptions[e].ShippingDateTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                                    var errClient = trackingSubscriptions.FailedPackageDetails.find(x => x.ClientId === err.failedSubscriptions[e].ClientId && x.SiteId === err.failedSubscriptions[e].SiteId && x.OrderId === err.failedSubscriptions[e].OrderId && x.ShippingDateTime === err.failedSubscriptions[e].ShippingDateTime && x.CarrierId === err.failedSubscriptions[e].CarrierId && x.TrackingId === err.failedSubscriptions[e].TrackingId);
                                    if (!errClient) {
                                        trackingSubscriptions.FailedPackageDetails.push(err.failedSubscriptions[e]);
                                    }
                                    else {
                                        if (!errClient.FailureDescription) {
                                            errClient.FailureDescription = err.failedSubscriptions[e].FailureDescription.toString();
                                        }
                                        else {
                                            errClient.FailureDescription = errClient.FailureDescription + ", " + err.failedSubscriptions[e].FailureDescription.toString();
                                        }
                                    }
                                }
                                trackingSubscriptions.FailureDescription = "Failed in packageDetails processing";
                                trackingSubscriptions.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                                reject(trackingSubscriptions);
                            });
                    } else {
                        trackingSubscriptions.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                        reject(trackingSubscriptions);
                    }
                })
                .catch(function (err) {
                    logger.error("Exception while validation");
                    var trackingSubscriptions = {};

                    trackingSubscriptions.ClientId = ClientId;
                    trackingSubscriptions.ClientRequestReferenceId = ClientRequestReferenceId;
                    trackingSubscriptions.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                    trackingSubscriptions.ResultCode = 1; //0 – Success; 1 – Failure;
                    trackingSubscriptions.FailureDescription = err.toString();
                    trackingSubscriptions.FailedPackageDetails = [];
                    reject(trackingSubscriptions);
                });
        });
    }

    validateParameters(ClientId, ClientRequestReferenceId, PackageDetails) {

        return new Promise(function (resolve, reject) {
            var validate = {};
            var validPackateDetails = [];
            var isValid = true;
            var failedSubscriptions = [];
            var failedSubscription = {};
            var errorMessages = [];
            var errorMessage = "";

            if (ClientId === undefined || ClientId === null) {
                isValid = false;
                validate.FailureDescription = "ClientId is required";
                validate.isValid = isValid;
                validate.message = [];
                validate.ValidPackateDetails = [];
                resolve(validate);
            }
            else {
                if (validator.isInt(ClientId.toString()) == false) {
                    isValid = false;
                    errorMessage = "ClientId should be valid integer";
                }
                else if (ClientRequestReferenceId && validator.isLength(ClientRequestReferenceId, { min: 1, max: 32 }) == false) {
                    isValid = false;
                    errorMessage = "ClientRequestReferenceId should be 1-32 char";
                }
                else if (!PackageDetails) {
                    isValid = false;
                    errorMessage = "PackageDetails is required";
                }
                else if (PackageDetails.length === undefined) {
                    isValid = false;
                    errorMessage = "Invalid packageDetails";
                }
                else if (PackageDetails.length <= 0) {
                    isValid = false;
                    errorMessage = "PackageDetails length should be more than zero";
                }

                if (isValid == false) {
                    validate.FailureDescription = errorMessage;
                    validate.isValid = isValid;
                    validate.message = [];
                    validate.ValidPackateDetails = [];
                    resolve(validate);
                }
                else {
                    var pkgDetails = [];
                    for (var pd = 0, packagelen = PackageDetails.length; pd < packagelen; pd++) {
                        var pkgDetail = {};
                        pkgDetail.ClientId = ClientId;
                        pkgDetail.SiteId = PackageDetails[pd].SiteId;
                        pkgDetail.OrderId = PackageDetails[pd].OrderId;
                        pkgDetail.ShippingDateTime = PackageDetails[pd].ShippingDateTime;
                        pkgDetail.CarrierId = PackageDetails[pd].CarrierId;
                        pkgDetail.TrackingId = PackageDetails[pd].TrackingId;
                        pkgDetail.SecondarySubscribingClientIds = PackageDetails[pd].SecondarySubscribingClientIds;
                        pkgDetail.DestinationZipCode = PackageDetails[pd].DestinationZipCode;
                        pkgDetails.push(pkgDetail);

                        if (PackageDetails[pd].SecondarySubscribingClientIds && Array.isArray(PackageDetails[pd].SecondarySubscribingClientIds) && PackageDetails[pd].SecondarySubscribingClientIds.length > 0) {
                            for (var sc = 0, sclen = PackageDetails[pd].SecondarySubscribingClientIds.length; sc < sclen; sc++) {
                                pkgDetail = {};
                                pkgDetail.ClientId = PackageDetails[pd].SecondarySubscribingClientIds[sc];
                                pkgDetail.SiteId = PackageDetails[pd].SiteId;
                                pkgDetail.OrderId = PackageDetails[pd].OrderId;
                                pkgDetail.ShippingDateTime = PackageDetails[pd].ShippingDateTime;
                                pkgDetail.CarrierId = PackageDetails[pd].CarrierId;
                                pkgDetail.TrackingId = PackageDetails[pd].TrackingId;
                                pkgDetail.SecondarySubscribingClientIds = null;
                                pkgDetail.DestinationZipCode = PackageDetails[pd].DestinationZipCode;
                                pkgDetails.push(pkgDetail);
                            }
                        }
                    }
                    var clients = [];
                    for (var j = 0, pkgDetailslen = pkgDetails.length; j < pkgDetailslen; j++) {
                        if (!clients.find(x => x == pkgDetails[j].ClientId) && validator.isInt(pkgDetails[j].ClientId.toString()) === true) {
                            clients.push(pkgDetails[j].ClientId);
                        }
                    }
                    var clientConfiguration = _this.getByClientIds(clients.join());
                    if (clientConfiguration.find(x => x.PTS_CLIENT_ID === ClientId)) {
                        //Start: Remove Invalid Client Ids//
                        for (var invalidClientCount = pkgDetails.length; invalidClientCount--;) {
                            var clientConfigPkg = clientConfiguration.find(x => x.PTS_CLIENT_ID == pkgDetails[invalidClientCount].ClientId);
                            if (!clientConfigPkg) {
                                pkgDetails.splice(invalidClientCount, 1);
                            }
                        }
                        //End: Remove Invalid Client Ids//
                        for (var pds = 0, psdslen = pkgDetails.length; pds < psdslen; pds++) {
                            isValid = true;
                            var message = "";
                            errorMessages = [];
                            var clientConfig = clientConfiguration.find(x => x.PTS_CLIENT_ID == pkgDetails[pds].ClientId);

                            if (!clientConfig) {
                                isValid = false;
                                errorMessage = "Unauthorized access";
                                errorMessages.push(errorMessage);
                            }

                            if (pkgDetails[pds].SiteId === undefined || pkgDetails[pds].SiteId === null) {
                                isValid = false;
                                message = "SiteId is required";
                                errorMessages.push(message);
                            }
                            else if (validator.isInt(pkgDetails[pds].SiteId.toString()) == false) {
                                isValid = false;
                                message = "SiteId should be valid integer";
                                errorMessages.push(message);
                            }
                            else if (clientConfig && (!clientConfig.SITE_IDS || clientConfig.SITE_IDS.split(',').indexOf(pkgDetails[pds].SiteId.toString()) <= -1)) {
                                message = "Unauthorized access";
                                isValid = false;
                                errorMessages.push(message);
                            }

                            if (!pkgDetails[pds].OrderId) {
                                isValid = false;
                                message = "OrderId is required";
                                errorMessages.push(message);
                            }
                            else if (validator.isLength(pkgDetails[pds].OrderId, { min: 1, max: 32 }) == false) {
                                isValid = false;
                                message = "OrderId should be of 1-32 char";
                                errorMessages.push(message);
                            }

                            if (!pkgDetails[pds].ShippingDateTime) {
                                isValid = false;
                                message = "ShippingDateTime is required";
                                errorMessages.push(message);
                            }
                            else if (moment(pkgDetails[pds].ShippingDateTime.replace(' ', '+'), "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() == false) {
                                isValid = false;
                                message = "ShippingDateTime should be valid date";
                                errorMessages.push(message);
                            }

                            if (!pkgDetails[pds].CarrierId) {
                                isValid = false;
                                message = "CarrierId is required";
                                errorMessages.push(message);
                            }
                            else if (validator.isLength(pkgDetails[pds].CarrierId, { min: 1, max: 32 }) == false) {
                                isValid = false;
                                message = "CarrierId should be of 1-32 char";
                                errorMessages.push(message);
                            }

                            if (!pkgDetails[pds].TrackingId) {
                                isValid = false;
                                message = "TrackingId is required";
                                errorMessages.push(message);
                            }
                            else if (validator.isLength(pkgDetails[pds].TrackingId, { min: 1, max: 32 }) == false) {
                                isValid = false;
                                message = "TrackingId should be of 1-32 char";
                                errorMessages.push(message);
                            }

                            if (!pkgDetails[pds].DestinationZipCode) {
                                isValid = false;
                                message = "DestinationZipCode is required";
                                errorMessages.push(message);
                            }
                            else if (validator.isLength(pkgDetails[pds].DestinationZipCode, { min: 1, max: 20 }) == false) {
                                isValid = false;
                                message = "DestinationZipCode should be of 1-20 char";
                                errorMessages.push(message);
                            }

                            if (pkgDetails[pds].SecondarySubscribingClientIds != undefined && pkgDetails[pds].SecondarySubscribingClientIds != null) {
                                if (Array.isArray(pkgDetails[pds].SecondarySubscribingClientIds)) {
                                    if (pkgDetails[pds].SecondarySubscribingClientIds.length > 0) {
                                        var validSecClientIds = [], notIntSecClntId = [], notAuthSecClntId = [];
                                        for (var i = 0, scelen = pkgDetails[pds].SecondarySubscribingClientIds.length; i < scelen; i++) {
                                            if (validator.isInt(pkgDetails[pds].SecondarySubscribingClientIds[i].toString()) == false) {
                                                message = "SecondarySubscribingClientId " + pkgDetails[pds].SecondarySubscribingClientIds[i] + " should be valid integer";
                                                notIntSecClntId.push(pkgDetails[pds].SecondarySubscribingClientIds[i]);
                                            }
                                            else if (!clientConfig || !clientConfig.SCDY_SUBSCRIBING_CLIENT_IDS || clientConfig.SCDY_SUBSCRIBING_CLIENT_IDS.split(",").indexOf(pkgDetails[pds].SecondarySubscribingClientIds[i].toString()) <= -1) {
                                                message = "SecondarySubscribingClientId " + pkgDetails[pds].SecondarySubscribingClientIds[i] + " is not authorized";
                                                notAuthSecClntId.push(pkgDetails[pds].SecondarySubscribingClientIds[i]);
                                            }
                                            else {
                                                validSecClientIds.push(pkgDetails[pds].SecondarySubscribingClientIds[i]);
                                            }
                                        }
                                        if (notIntSecClntId.length > 0) {
                                            message = "SecondarySubscribingClientId(s) [" + notIntSecClntId.join() + "] should be valid integer";
                                            if (notAuthSecClntId.length > 0) {
                                                message = message + " and [" + notAuthSecClntId.join() + "] is/are not authorized";
                                            }
                                            errorMessages.push(message);
                                        }
                                        else if (notAuthSecClntId.length > 0) {
                                            message = "SecondarySubscribingClientId(s) [" + notAuthSecClntId.join() + "] is/are not authorized";
                                            errorMessages.push(message);
                                        }

                                        pkgDetails[pds].SecondarySubscribingClientIds = validSecClientIds;
                                    }
                                }
                                else {
                                    message = "SecondarySubscribingClientId is not in proper format";
                                    errorMessages.push(message);
                                }
                            }

                            if (isValid == false) {
                                failedSubscription = {};
                                failedSubscription.ClientId = pkgDetails[pds].ClientId;
                                failedSubscription.SiteId = pkgDetails[pds].SiteId;
                                failedSubscription.ShippingDateTime = pkgDetails[pds].ShippingDateTime;
                                failedSubscription.CarrierId = pkgDetails[pds].CarrierId;
                                failedSubscription.TrackingId = pkgDetails[pds].TrackingId;
                                failedSubscription.OrderId = pkgDetails[pds].OrderId;
                                failedSubscription.FailureDescription = errorMessages.toString();

                                failedSubscriptions.push(failedSubscription);
                            }
                            else {
                                var validPackage = PackageDetails.find(x => x.SiteId === pkgDetails[pds].SiteId && x.OrderId === pkgDetails[pds].OrderId && x.ShippingDateTime === pkgDetails[pds].ShippingDateTime && x.CarrierId === pkgDetails[pds].CarrierId && x.TrackingId === pkgDetails[pds].TrackingId);
                                if (validPackateDetails.length == 0 || !validPackateDetails.find(x => x.SiteId === pkgDetails[pds].SiteId && x.OrderId === pkgDetails[pds].OrderId && x.ShippingDateTime === pkgDetails[pds].ShippingDateTime && x.CarrierId === pkgDetails[pds].CarrierId && x.TrackingId === pkgDetails[pds].TrackingId)) {
                                    validPackage.SecondarySubscribingClientIds = pkgDetails[pds].SecondarySubscribingClientIds;
                                    validPackateDetails.push(validPackage);
                                }
                                if (message) {
                                    failedSubscription = {};
                                    failedSubscription.ClientId = pkgDetails[pds].ClientId;
                                    failedSubscription.SiteId = pkgDetails[pds].SiteId;
                                    failedSubscription.ShippingDateTime = pkgDetails[pds].ShippingDateTime;
                                    failedSubscription.CarrierId = pkgDetails[pds].CarrierId;
                                    failedSubscription.TrackingId = pkgDetails[pds].TrackingId;
                                    failedSubscription.OrderId = pkgDetails[pds].OrderId;
                                    failedSubscription.FailureDescription = errorMessages.toString();

                                    failedSubscriptions.push(failedSubscription);
                                }
                            }
                        }

                        if (failedSubscriptions.length > 0) {
                            validate.FailureDescription = "Some validation failed in packageDetails";
                        }
                        else {
                            validate.FailureDescription = "";
                        }
                        validate.isValid = isValid;
                        validate.message = failedSubscriptions;
                        validate.ValidPackateDetails = validPackateDetails;
                        resolve(validate);
                    }
                    else {
                        isValid = false;
                        validate.FailureDescription = "Unauthorized access";
                        validate.isValid = isValid;
                        validate.message = [];
                        validate.ValidPackateDetails = [];
                        resolve(validate);
                    }
                }
            }
        });
    }

    getByClientIds(clientIds){
        var clientConfig = null;
        var clientConfiguration = _this.ClientConfigs.filter(function(x){return clientIds.split(",").indexOf(x.PTS_CLIENT_ID.toString()) >= 0});

        return clientConfiguration;
    }

    getClientsSync() {
        var sync = true;
        var data = null;
        clientConfigurationProviderObj.getClients()
            .then(function (clientConfiguration) {
                data = clientConfiguration;
                sync = false;
            })
            .catch(function (err) {
                sync = false;
                logger.error('Error occurred while getting client configuration from database', err);
                console.log('Exiting process');
                process.exit(0);
            });
        //while (sync) { deasync.sleep(100); }
        deasync.loopWhile(function(){return sync;});
        return data;
    }
}

module.exports = TrackingSubscriptionsHandler;