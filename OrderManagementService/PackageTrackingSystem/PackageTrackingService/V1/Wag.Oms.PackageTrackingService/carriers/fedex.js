var fs = require('fs');
var common = require('../utils/common.js');
var Builder, Parser, ShipperClient, find, moment, ref, titleCase;

ref = require('xml2js'), Builder = ref.Builder, Parser = ref.Parser;

find = require('underscore').find;

moment = require('moment-timezone');

titleCase = require('change-case').titleCase;

ShipperClient = require('./shipper').ShipperClient;

var fedExStatusLookup = require('./fedExStatusLookup.json');

class FedexClient extends ShipperClient {

    constructor(arg, options) {
        super();
        this.key = arg.key, this.password = arg.password, this.account = arg.account, this.meter = arg.meter;
        this.options = options;
        this.parser = new Parser();
        this.builder = new Builder({
            renderOpts: {
                pretty: false
            },
            xmldec: {
                version: '1.0',
                encoding: 'utf-8'
            }
        });
    }

    generateRequest(trk) {
        return this.builder.buildObject({
            'soapenv:Envelope': {
                '$': {
                    'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
                    'xmlns:v10': 'http://fedex.com/ws/track/v10'
                },
                'soapenv:Header': {},
                'soapenv:Body': {
                    'v10:TrackRequest': {
                        'v10:WebAuthenticationDetail': {
                            'v10:UserCredential': {
                                'v10:Key': this.key,
                                'v10:Password': this.password
                            }
                        },
                        'v10:ClientDetail': {
                            'v10:AccountNumber': this.account,
                            'v10:MeterNumber': this.meter
                        },
                        'v10:Version': {
                            'v10:ServiceId': 'trck',
                            'v10:Major': 10,
                            'v10:Intermediate': 0,
                            'v10:Minor': 0
                        },
                        'v10:SelectionDetails': {
                            'v10:PackageIdentifier': {
                                'v10:Type': 'TRACKING_NUMBER_OR_DOORTAG',
                                'v10:Value': trk
                            }
                        },
                        'v10:ProcessingOptions': 'INCLUDE_DETAILED_SCANS'
                    }
                }
            }
        });
    }

    validateResponse(response, cb) {
        var handleResponse;
        handleResponse = function (xmlErr, trackResult) {
            var notifications, ref1, ref2, ref3, success;
            if ((xmlErr != null) || (trackResult == null)) {
                return cb(xmlErr);
            }
            var resultJson = JSON.stringify(trackResult);

            notifications = (ref1 = trackResult["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]['TrackReply'][0]) != null ? ref1['Notifications'] : void 0;
            success = find(notifications, function (notice) {
                var ref2;
                return (notice != null ? (ref2 = notice['Code']) != null ? ref2[0] : void 0 : void 0) === '0';
            });
            if (!success) {
                return cb(notifications || 'invalid reply');
            }
            return cb(null, (ref2 = trackResult["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]['TrackReply'][0]) != null ? (ref3 = ref2['CompletedTrackDetails'][0]['TrackDetails']) != null ? ref3[0] : void 0 : void 0);
        };
        this.parser.reset();
        return this.parser.parseString(response, handleResponse);
    }

    presentAddress(address) {
        var city, countryCode, postalCode, ref1, ref2, ref3, ref4, stateCode;
        if (address == null) {
            return;
        }
        city = (ref1 = address['City']) != null ? ref1[0] : void 0;
        if (city != null) {
            city = city.replace('FEDEX SMARTPOST ', '');
        }
        stateCode = (ref2 = address['StateOrProvinceCode']) != null ? ref2[0] : void 0;
        countryCode = (ref3 = address['CountryCode']) != null ? ref3[0] : void 0;
        postalCode = (ref4 = address['PostalCode']) != null ? common.get5DigitZipCode(ref4[0]) : void 0;
        return this.presentLocation({
            city: city,
            stateCode: stateCode,
            countryCode: countryCode,
            postalCode: postalCode
        });
    }
        
    getStatus(shipment) {
        var ref1, statusCode, statusDescription;
        statusCode = shipment != null ? (ref1 = shipment['StatusDetail'][0]['Code']) != null ? ref1[0] : void 0 : void 0;
        statusDescription = shipment != null ? (ref1 = shipment['StatusDetail'][0]['Description']) != null ? ref1[0] : void 0 : void 0;

        if (statusCode == null) {
            return this.presentStatus(this.STATUS_TYPES.AWAITING_CARRIER_PICKUP);
        }        
        return this.presentStatus(this.LookupStatus(statusCode, statusDescription));        
    }

    LookupStatus(statusCode, statusDescription) {
        var i = null;
        for (i = 0; fedExStatusLookup.length > i; i += 1) {
            if (fedExStatusLookup[i].StatusCode.toUpperCase() == statusCode.toUpperCase() && fedExStatusLookup[i].StatusDescription.toUpperCase() == statusDescription.toUpperCase()) {
                return this.STATUS_TYPES[fedExStatusLookup[i].OMSStatus.toUpperCase()];
            }        
        }
        return this.STATUS_TYPES.IN_TRANSIT;
    }

    getCarrierStatus(shipment) {
        var ref1;
        return shipment != null ? (ref1 = shipment['StatusDetail'][0]['Description']) != null ? ref1[0] : void 0 : void 0;
    }

    getActivitiesAndStatus(shipment) {
        var activities, activity, datetime, details, event_time, i, len, location, rawActivity, raw_timestamp, ref1, ref2, ref3, ref4, status, timestamp, TrackEvent, locationTimeZone;
        activities = [];
        status = null;
        ref1 = shipment['Events'] || [];
        for (i = 0, len = ref1.length; i < len; i++) {
            rawActivity = ref1[i];
            location = this.presentAddress((ref2 = rawActivity['Address']) != null ? ref2[0] : void 0);
           
            raw_timestamp = (ref3 = rawActivity['Timestamp']) != null ? ref3[0] : void 0;
            if (raw_timestamp != null) {
                event_time = moment.parseZone(raw_timestamp);
            }
            details = (ref4 = rawActivity['EventDescription']) != null ? ref4[0] : void 0;            

            if ((details != null) && (event_time != null)) {
                TrackEvent = {
                    Event: details,
                    DateTime: event_time.format("YYYY-MM-DDTHH:mm:ss.SSSZ"), //"YYYY-MM-DDTHH:mm:ss.SSSZ"
                    Location: location
                };
                activities.push(TrackEvent);
            }
        }
        return {
            activities: activities,
            status: this.getStatus(shipment)
        };
    }

    getEta(shipment) {
        var ref1, ts;

        ts = shipment != null ? (ref1 = shipment['EstimatedDeliveryTimestamp']) != null ? ref1[0] : void 0 : void 0;

        if (ts == null) {
            return void 0;
        }
        return moment(ts).set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    }

    getCarrierNotes(shipment) {
        var ref1, ref2;
        return shipment != null ? (ref1 = shipment['StatusDetail'][0]['AncillaryDetails']) != null ? (ref2 = ref1[0]["ReasonDescription"]) != null ? ref2[0] : void 0 : void 0 : void 0;
    }

    getService(shipment) {
        var ref1;
        return shipment != null ? (ref1 = shipment['ServiceInfo']) != null ? ref1[0] : void 0 : void 0;
    }

    getWeight(shipment) {
        var ref1, ref2, ref3, units, value, weightData;
        weightData = shipment != null ? (ref1 = shipment['PackageWeight']) != null ? ref1[0] : void 0 : void 0;
        if (weightData == null) {
            return;
        }
        units = (ref2 = weightData['Units']) != null ? ref2[0] : void 0;
        value = (ref3 = weightData['Value']) != null ? ref3[0] : void 0;
        if ((units != null) && (value != null)) {
            return value + " " + units;
        }
    }

    getDestination(shipment) {
        var ref1;
        return this.presentAddress((ref1 = shipment['DestinationAddress']) != null ? ref1[0] : void 0);
    }

    getStatusLocation(shipment) {
        var ref1;
        return this.presentAddress((ref1 = shipment['StatusDetail'][0]['Location']) != null ? ref1[0] : void 0);
    }

    getStatusDateTime(shipment) {
        var ref1, ts, location, locationTimeZone, i, len, ref3, event_timestamp, event;

        var statusCode = shipment != null ? (ref1 = shipment['StatusDetail'][0]['Code']) != null ? ref1[0] : void 0 : void 0;
        if (statusCode != null && statusCode == 'DL') {
            ref1 = shipment['Events'] || [];
            for (i = 0, len = ref1.length; i < len; i++) {
                event = ref1[i];
                if (event['EventType'] == statusCode) {
                    event_timestamp = (ref3 = event['Timestamp']) != null ? ref3[0] : void 0;
                    if (event_timestamp != null) {
                        return moment.parseZone(event_timestamp);
                    }
                }                
            }
        }
        
        ts = shipment != null ? (ref1 = shipment['StatusDetail'][0]['CreationTime']) != null ? ref1[0] : void 0 : void 0;
        if (ts == null) {
            return;
        }

        return moment(ts);
    }

    requestOptions(arg) {
        var reference, TrackingId;
        TrackingId = arg.TrackingId, reference = arg.reference;
        return {
            method: 'POST',
            uri: arg.CarrierConfig.CARRIER_URL,
            body: this.generateRequest(TrackingId)
        };
    }

}

module.exports = {
    FedexClient: FedexClient
};
