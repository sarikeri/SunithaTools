var moment, request, titleCase;
var config = require('../config.js');
var zipcodeDatabase = require('./zipcodes.json');
var logger = require('../utils/logger.js');

titleCase = require('change-case').titleCase;

request = require('request');

moment = require('moment-timezone');

class ShipperClient {
    constructor() {
        this.STATUS_TYPES = {
            UNKNOWN: 0,
            AWAITING_CARRIER_PICKUP: 1,
            IN_TRANSIT: 2,
            OUT_FOR_DELIVERY: 3,
            DELIVERED: 4,
            NOT_DELIVERABLE: 5,
            RETURN_TO_SENDER: 6
        };
    }

    presentStatus(statusType) {
        var statusText;
        switch (statusType) {
            case this.STATUS_TYPES.AWAITING_CARRIER_PICKUP:
                statusText = "AwaitingCarrierPickup";
                break;
            case this.STATUS_TYPES.IN_TRANSIT:
                statusText = "InTransit";
                break;
            case this.STATUS_TYPES.OUT_FOR_DELIVERY:
                statusText = "OutForDelivery";
                break;
            case this.STATUS_TYPES.DELIVERED:
                statusText = "Delivered";
                break;
            case this.STATUS_TYPES.NOT_DELIVERABLE:
                statusText = "NotDeliverable";
                break;
            case this.STATUS_TYPES.RETURN_TO_SENDER:
                statusText = "ReturnToSender";
                break;
            default:
                statusText = "InTransit";
        }
        return statusText;
    }

    presentPostalCode(rawCode) {
        rawCode = rawCode != null ? rawCode.trim() : void 0;
        if (/^\d{9}$/.test(rawCode)) {
            return rawCode.slice(0, 5) + "-" + rawCode.slice(5);
        } else {
            return rawCode;
        }
    }

    presentLocationString(location) {
        var field, i, len, newFields, ref;
        newFields = [];
        ref = (location != null ? location.split(',') : void 0) || [];
        for (i = 0, len = ref.length; i < len; i++) {
            field = ref[i];
            field = field.trim();
            if (field.length > 2) {
                field = titleCase(field);
            }
            newFields.push(field);
        }
        return newFields.join(', ');
    }

    presentLocation(arg) {
        var address, city, countryCode, postalCode, stateCode;
        city = arg.city, stateCode = arg.stateCode, countryCode = arg.countryCode, postalCode = arg.postalCode;
        if (city != null ? city.length : void 0) {
            city = titleCase(city);
        }
        if (stateCode != null ? stateCode.length : void 0) {
            stateCode = stateCode.trim();
            if (stateCode.length > 3) {
                stateCode = titleCase(stateCode);
            }
        }

        postalCode = this.presentPostalCode(postalCode);

        if (countryCode != null ? countryCode.length : void 0) {
            countryCode = countryCode.trim();
            if (countryCode.length > 3) {
                countryCode = titleCase(countryCode);
            }
        }

        return {
            City: city,
            State: stateCode,
            Country: countryCode,
            ZipCode: postalCode
        };
    }

    presentResponse(response, requestData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.validateResponse(response, function (err, shipment) {
                var activities, adjustedEta, eta, presentedResponse, ref, ref1, status, adjustedstatusDateTime, statusDateTime;
                if ((err != null) || (shipment == null)) {
                    reject(err);
                }
                ref = _this.getActivitiesAndStatus(shipment), activities = ref.activities, status = ref.status;

                eta = _this.getEta(shipment);
                
                statusDateTime = _this.getStatusDateTime(shipment);
                
                var statusLocation = _this.getStatusLocation(shipment);

                var carrierStatus = _this.getCarrierStatus(shipment);

                var carrierNotes;
                if (status == _this.presentStatus(_this.STATUS_TYPES.DELIVERED)) {
                    carrierNotes = _this.getCarrierNotes(shipment);
                }

                presentedResponse = {
                    TrackSummary: {
                        SiteId: requestData.SiteId,
                        OrderId: requestData.OrderId,
                        ShippingDateTime: moment.parseZone(requestData.ShippingDateTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"), //"YYYY-MM-DDTHH:mm:ss.SSSZ"
                        CarrierId: requestData.CarrierConfig.CARRIER_ID,
                        TrackingId: requestData.TrackingId,
                        EstimatedDeliveryDateTime: eta != null ? moment(eta).format("YYYY-MM-DDTHH:mm:ss.SSSZ") :  void 0 , //"YYYY-MM-DDTHH:mm:ss.SSSZ"
                        Status: status,
                        CarrierStatus: carrierStatus,
                        CarrierNotes: carrierNotes,
                        DateTime: moment(statusDateTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"), //"YYYY-MM-DDTHH:mm:ss.SSSZ"
                        Location: statusLocation
                    },
                    TrackEvents: activities
                };
                if ((requestData != null ? requestData.raw : void 0) != null) {
                    if (requestData.raw) {
                        presentedResponse.raw = response;
                    }
                } else {
                    if ((ref1 = _this.options) != null ? ref1.raw : void 0) {
                        presentedResponse.raw = response;
                    }
                }
                resolve(presentedResponse);
            });
        });
    }

    requestData(requestData) {
        var opts, ref, _this = this;
        opts = this.requestOptions(requestData);
        opts.timeout = (requestData != null ? requestData.timeout : void 0) || ((ref = this.options) != null ? ref.timeout : void 0);

        if (config.proxyServer) {
            opts.proxy = config.proxyServer;
            if (!opts.headers) {
                opts.headers = { Connection: 'keep-alive' };
            }
            else {
                opts.headers.Connection = 'keep-alive'
            };
        }

        return new Promise(function (resolve, reject) {
            request(opts, function (err, response, body) {
                if ((body == null) || (err != null)) {
                    reject(JSON.stringify(err));
                }
                else if (response.statusCode !== 200) {
                    reject("response status " + response.statusCode);
                }
                else {
                    _this.presentResponse(body, requestData)
                        .then(function (data) {
                            resolve(data);
                        })
                        .catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                }
            });

        });

    }

    getTimeZoneFromZip(zipCode) {
        var timeZone;

        if (zipCode != null && zipCode.length > 5) {
            zipCode = zipCode.slice(0, 5);
        }
        if (zipcodeDatabase.hasOwnProperty(zipCode)) {
            timeZone = zipcodeDatabase[zipCode];
        } else {
            timeZone = config.defaultTimeZone;
            logger.verbose(`Did not find timezone mapping for zipcode ${zipCode}.`);
        }
        return timeZone;
    }
}

module.exports = {
    ShipperClient: ShipperClient
};
