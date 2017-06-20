var _this, trackingDetailObj;
var moment = require('moment-timezone');
var config = require('../config.js');
var logger = require('../utils/logger.js');
var common = require('../utils/common.js');
var validator = require('validator');
var deasync = require('deasync');
var trackingDetailModule = require('./trackingDetail.js');
var trackingDetailProvider = require('../dataProviders/trackingDetailProvider.js');
var trackingDetailProviderObj = new trackingDetailProvider();
var clientConfigurationProvider = require('../dataProviders/clientConfigurationProvider.js');
var clientConfigurationProviderObj = new clientConfigurationProvider();
var carrierConfigurationProvider = require('../dataProviders/carrierConfigurationProvider.js');
var carrierConfigurationProviderObj = new carrierConfigurationProvider();
var titleCase = require('change-case').titleCase;

class TrackingDetailHandler {
    constructor() {
        _this = this;

        //loading carrier configurations
        _this.CarrierConfigs = [];
        _this.CarrierConfigs = _this.getCarriersSync();

        //loading client configurations
        _this.ClientConfigs = [];
        _this.ClientConfigs = _this.getClientsSync();

    }

    getTrackingStatus(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId) {
        return new Promise(function(resolve, reject) {
            _this.validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
                .then(function(validate) {
                    var trackingDetail = {};

                    trackingDetail.ClientId = ClientId;
                    trackingDetail.ClientRequestReferenceId = ClientRequestReferenceId;
                    trackingDetail.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                    trackingDetail.ResultCode = validate.isValid == true ? 0 : 1; //0 – Success; 1 – Failure;
                    if (validate.isValid == false) {
                        trackingDetail.FailureDescription = validate.message;
                    }

                    if (validate.isValid == true) {

                        trackingDetailObj = new trackingDetailModule(_this.getByCarrierId(CarrierId));

                        //var shippingDtTime = moment(ShippingDateTime.replace(' ', '+'), "YYYY-MM-DDTHH:mm:ss.SSSZ", true).toDate();
                        var shippingDtTime = ShippingDateTime.replace(' ', '+');
                        trackingDetailProviderObj.getTrackingDetail(SiteId, OrderId, shippingDtTime, CarrierId, TrackingId)
                            .then(function(data) {
                                if (data.length > 0) {
                                    var row = data[0];

                                    var clientIds = row.PTS_CLIENT_IDS;
                                    var clientIdsArr = clientIds.split(',');
                                    if (clientIdsArr.indexOf(trackingDetail.ClientId) <= -1) {
                                        clientIds = row.PTS_CLIENT_IDS + "," + trackingDetail.ClientId;
                                    }

                                    var waitTime = new Date(row.TRACKING_DATE.getTime() + (1000 * 60 * config.default.trackingDetail.waitDuration));
                                    var terminalStatus = config.default.trackingDetail.terminalStatuses.filter(function (x) { return titleCase(x) == titleCase(row.TRACKING_STATUS) });
                                    if (waitTime > new Date() || (terminalStatus && terminalStatus.length > 0)) {

                                        trackingDetail.TrackResponse = JSON.parse(row.TRACKING_DATA);
                                        trackingDetail.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                                        resolve(trackingDetail);

                                        if (clientIdsArr.indexOf(trackingDetail.ClientId) <= -1) {
                                            trackingDetailProviderObj.updateTrackingDetail(SiteId, OrderId, shippingDtTime, CarrierId, TrackingId, trackingDetail.TrackResponse, clientIds, row.TRACKING_DATE)
                                                .then(function(result) {
                                                    logger.verbose("ClientIds updated Successfully!!");
                                                })
                                                .catch(function(err) {
                                                    logger.error(err.message);
                                                });
                                        }
                                        else {
                                            trackingDetailProviderObj.updateTrackingDetail(SiteId, OrderId, shippingDtTime, CarrierId, TrackingId, trackingDetail.TrackResponse, clientIds, row.TRACKING_DATE)
                                                .then(function (result) {
                                                    logger.verbose("UpdateDate updated Successfully!!");
                                                    resolve(trackingDetail);
                                                })
                                                .catch(function (err) {
                                                    logger.error(err.message);
                                                    resolve(trackingDetail);
                                                });
                                        }
                                    }
                                    else {
                                        trackingDetailObj.getTrackingDetail(SiteId, OrderId, shippingDtTime, _this.getByCarrierId(CarrierId), TrackingId)
                                            .then(function(data) {
                                                trackingDetail.TrackResponse = data;
                                                trackingDetail.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";                                                
                                                trackingDetailProviderObj.updateTrackingDetail(SiteId, OrderId, shippingDtTime, CarrierId, TrackingId, data, clientIds, new Date())
                                                    .then(function(result) {
                                                        logger.verbose("Rows updated Successfully!!");
                                                        resolve(trackingDetail);
                                                    })
                                                    .catch(function(err) {
                                                        logger.error(err.message);
                                                        resolve(trackingDetail);
                                                    });
                                            })
                                            .catch(function(err) {
                                                logger.error(err);
                                                trackingDetail.ResultCode = 1; //0 – Success; 1 – Failure;
                                                trackingDetail.FailureDescription = err;
                                                reject(trackingDetail);
                                            });
                                    }
                                }
                                else {
                                    trackingDetailObj.getTrackingDetail(SiteId, OrderId, shippingDtTime, _this.getByCarrierId(CarrierId), TrackingId)
                                        .then(function(data) {
                                            trackingDetail.TrackResponse = data;
                                            trackingDetail.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";                                            
                                            trackingDetailProviderObj.addTrackingDetail(ClientId, SiteId, OrderId, shippingDtTime, CarrierId, TrackingId, data, new Date())
                                                .then(function(result) {
                                                    logger.verbose("Rows inserted Successfully!!");
                                                    resolve(trackingDetail);
                                                })
                                                .catch(function(err) {
                                                    logger.error(err.message);
                                                    resolve(trackingDetail);
                                                });
                                        })
                                        .catch(function(err) {
                                            logger.error(err);
                                            trackingDetail.ResultCode = 1; //0 – Success; 1 – Failure;
                                            trackingDetail.FailureDescription = err;
                                            trackingDetail.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                                            reject(trackingDetail);
                                        });
                                }
                            })
                            .catch(function(err) {
                                logger.error(err.message);
                                trackingDetail.ResultCode = 1; //0 – Success; 1 – Failure;
                                trackingDetail.FailureDescription = err.message;
                                trackingDetail.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                                reject(trackingDetail);
                            });
                    } else {
                        trackingDetail.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                        reject(trackingDetail);
                    }
                })
                .catch(function(err) {
                    logger.error(err.message);
                    var trackingSubscriptions = {};

                    trackingSubscriptions.ClientId = ClientId;
                    trackingSubscriptions.ClientRequestReferenceId = ClientRequestReferenceId;
                    trackingSubscriptions.ResponseTimestamp = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
                    trackingSubscriptions.ResultCode = 1; //0 – Success; 1 – Failure;
                    trackingSubscriptions.FailureDescription = err.message;
                    reject(trackingSubscriptions);
                });
        });

    }

    validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId) {
        return new Promise(function(resolve, reject) {
            var validate = {};
            var message = "";
            var isValid = true;

            if (ClientId != undefined) {
                if (validator.isInt(ClientId) == false) {
                    message = "ClientId should be valid integer";
                    validate.isValid = false;
                    validate.message = message;
                    resolve(validate);
                }
                else {
                    var clientConfiguration = _this.getByClientIds(ClientId);
                    if (clientConfiguration.length > 0) {

                        if (SiteId === undefined) {
                            isValid = false;
                            message = "SiteId is required";
                        }
                        else if (validator.isInt(SiteId) == false) {
                            isValid = false;
                            message = "SiteId should be valid integer";
                        }
                        else if (!clientConfiguration[0].SITE_IDS || clientConfiguration[0].SITE_IDS.split(',').indexOf(SiteId) <= -1) {
                            message = "Unauthorized access";
                            isValid = false;
                        }
                        else if (OrderId === undefined) {
                            isValid = false;
                            message = "OrderId is required";
                        }
                        else if (validator.isLength(OrderId, { min: 1, max: 32 }) == false) {
                            isValid = false;
                            message = "OrderId should be of 1-32 char";
                        }
                        else if (ShippingDateTime === undefined) {
                            isValid = false;
                            message = "ShippingDateTime is required";
                        }
                        else if (moment(ShippingDateTime.replace(' ', '+'), "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid() == false) {
                            isValid = false;
                            message = "ShippingDateTime should be valid date";
                        }
                        else if (TrackingId === undefined) {
                            isValid = false;
                            message = "TrackingId is required";
                        }
                        else if (validator.isLength(TrackingId, { min: 1, max: 32 }) == false) {
                            isValid = false;
                            message = "TrackingId should be of 1-32 char";
                        }
                        else if (ClientRequestReferenceId != undefined && validator.isLength(ClientRequestReferenceId, { min: 1, max: 32 }) == false) {
                            isValid = false;
                            message = "ClientRequestReferenceId should be 1-32 char";
                        }
                        else if (CarrierId === undefined) {
                            isValid = false;
                            message = "CarrierId is required";
                        }
                        else if (validator.isLength(CarrierId, { min: 1, max: 32 }) == false) {
                            isValid = false;
                            message = "CarrierId should be of 1-32 char";
                        }
                        else if (!_this.getByCarrierId(CarrierId)){
                            message = "Unauthorized access to carrier";
                            isValid = false;
                        }

                        validate.isValid = isValid;
                        validate.message = message;
                        resolve(validate);
                    }
                    else {
                        message = "Unauthorized access";
                        isValid = false;
                        validate.isValid = isValid;
                        validate.message = message;
                        resolve(validate);
                    }
                }
            } else {
                isValid = false;
                message = "ClientId is required";
                validate.isValid = isValid;
                validate.message = message;

                resolve(validate);
            }
        });
    }

    getByCarrierId(carrierId){
        var carrierConfig = null;
        var carrierConfiguration = _this.CarrierConfigs.filter(function(x){return titleCase(x.CARRIER_ID) == titleCase(carrierId)});
        if(carrierConfiguration.length > 0){
            carrierConfig = carrierConfiguration[0];
            var credentials = [];
            for (var creIndex = 0; creIndex < carrierConfiguration.length; creIndex++) {
                var credential = {};
                credential.Key = carrierConfiguration[creIndex].KEY;
                credential.Value = carrierConfiguration[creIndex].VALUE;
                credentials.push(credential);
            }
            carrierConfig.Credentials = credentials;
        }
        return carrierConfig;
    }

    getByClientIds(clientIds){
        var clientConfig = null;
        var clientConfiguration = _this.ClientConfigs.filter(function(x){return clientIds.split(",").indexOf(x.PTS_CLIENT_ID.toString()) >= 0});

        return clientConfiguration;
    }

    getCarriersSync() {
        var sync = true;
        var data = null;
        carrierConfigurationProviderObj.getCarriers()
            .then(function (carrierConfiguration) {
                data = carrierConfiguration;
                sync = false;
            })
            .catch(function (err) {
                sync = false;
                logger.error('Error occurred while getting carrier configuration from database', err);
                console.log('Exiting process');
                process.exit(0);
            });
        //while (sync) { deasync.sleep(100); }
        deasync.loopWhile(function () { return sync; });
        return data;
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

module.exports = TrackingDetailHandler;