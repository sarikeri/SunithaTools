var config = require('../config.js'),
    util = require('util');
var common = require('../utils/common.js');
var zipcodeDatabase = require('./zipcodes.json');

var Builder, Parser, ShipperClient, moment,

    ref = require('xml2js'), Builder = ref.Builder, Parser = ref.Parser;

moment = require('moment-timezone');

ShipperClient = require('./shipper').ShipperClient;

var lasershipStatusLookup = require('./lasershipStatusLookup.json');

class LasershipClient extends ShipperClient {

    constructor(arg, options) {
        super();
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

    validateResponse(response, cb) {
        var handleResponse;
        handleResponse = function (xmlErr, trackResult) {
            var ref2, shipment;
            shipment = trackResult != null ? (ref2 = trackResult['Tracking']) != null ? ref2 : void 0 : void 0;
            if ((xmlErr != null) || (shipment == null)) {
                return cb(xmlErr);
            }
            return cb(null, shipment);
        };
        this.parser.reset();
        return this.parser.parseString(response, handleResponse);
    }

    getEta(shipment) {
        var rawEta, ref2, ref3, location;

        location = this.getDestination(shipment);
        rawEta = ((ref2 = shipment['EstimatedDeliveryDate']) != null ? ref2[0] : void 0);
        if (rawEta != null) {
            return this.presentTimestamp(rawEta + ' 12:00 pm', location != null ? location.ZipCode : void 0);
        }
    }
/*
    getService(shipment) {
        var ref2, service;
        service = (ref2 = shipment['Class']) != null ? ref2[0] : void 0;
        if (service != null) {
            return service.replace(/\<SUP\>.*\<\/SUP\>/, '');
        }
    }
    

    getWeight(shipment) { }
    */

    presentTimestamp(dateTimeString, locationZip) {
        var locationTimeZone, locationTimeOffset;
        if (dateTimeString == null) {
            return;
        }

        if (locationZip == null) {
            locationTimeZone = config.defaultTimeZone;
        }
        else {
            locationTimeZone = this.getTimeZoneFromZip(locationZip);
        }
        locationTimeOffset = moment(dateTimeString).tz(locationTimeZone).format('Z');
        return moment(dateTimeString + locationTimeOffset).toDate();
    }

    getDestination(shipment) {
        var city, postalCode, ref2, ref3, ref4, ref5, stateCode, destination;
        destination = shipment != null ? (ref5 = shipment['Destination']) != null ? ref5[0] : void 0 : void 0; 
        city = destination != null ? (ref2 = destination['City']) != null ? ref2[0] : void 0 : void 0;
        stateCode = destination != null ? (ref3 = destination['State']) != null ? ref3[0] : void 0 : void 0;
        postalCode = destination != null ? (ref4 = destination['PostalCode']) != null ? common.get5DigitZipCode(ref4[0]) : void 0 : void 0;
        return this.presentLocation({
            city: city,
            stateCode: stateCode,
            postalCode: postalCode
        });
    }
/*
    getOrigin(shipment) {
        var city, postalCode, ref2, ref3, ref4, stateCode;
        city = (ref2 = shipment['OriginCity']) != null ? ref2[0] : void 0;
        stateCode = (ref3 = shipment['OriginState']) != null ? ref3[0] : void 0;
        postalCode = (ref4 = shipment['OriginZip']) != null ? ref4[0] : void 0;
        return this.presentLocation({
            city: city,
            stateCode: stateCode,
            postalCode: postalCode
        });
    }
*/
    getStatus(shipment) {
        var ref1, ref2, ref3, statusCode, eventType, eventModifier;
        eventType = shipment != null ? (ref1 = shipment['Events']) != null ? (ref2 = ref1[0]['Event']) ? ref2[0]['EventType'][0] : void 0 : void 0 : void 0;
        eventModifier = shipment != null ? (ref1 = shipment['Events']) != null ? (ref2 = ref1[0]['Event']) ? (ref3 = ref2[0]['EventModifier']) ? ref3[0]: void 0 : void 0 : void 0 : void 0;
        statusCode = eventType;

        if (eventModifier) {
            statusCode = statusCode + '-' + eventModifier;
        }

        if (statusCode == null) {
            return this.presentStatus(this.STATUS_TYPES.AWAITING_CARRIER_PICKUP);
        }
        return this.presentStatus(this.LookupStatus(statusCode));
    }

    LookupStatus(statusText) {
        var i = null;
        for (i = 0; lasershipStatusLookup.length > i; i += 1) {
            if (lasershipStatusLookup[i].StatusCode.toUpperCase() == statusText.toUpperCase()) {
                return this.STATUS_TYPES[lasershipStatusLookup[i].OMSStatus.toUpperCase()];
            }
        }
        return this.STATUS_TYPES.IN_TRANSIT;
    }

    presentActivity(rawActivity) {
        var TrackEvent, datetime, city, countryCode, details, location, postalCode, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11, ref12, ref13, ref14, ref15, stateCode, timestamp;
        if (rawActivity == null) {
            return;
        }
        if ((ref2 = rawActivity['City']) != null ? (ref1 = ref2[0]) != null ? ref1.length : void 0 : void 0) {
            city = (ref15 = rawActivity['City']) != null ? ref15[0] : void 0;
        }
        if ((ref3 = rawActivity['State']) != null ? (ref4 = ref3[0]) != null ? ref4.length : void 0 : void 0) {
            stateCode = (ref5 = rawActivity['State']) != null ? ref5[0] : void 0;
        }
        if ((ref6 = rawActivity['PostalCode']) != null ? (ref7 = ref6[0]) != null ? ref7.length : void 0 : void 0) {
            postalCode = (ref8 = rawActivity['PostalCode']) != null ? common.get5DigitZipCode(ref8[0]) : void 0;
        }
        if ((ref9 = rawActivity['Country']) != null ? (ref10 = ref9[0]) != null ? ref10.length : void 0 : void 0) {
            countryCode = (ref11 = rawActivity['Country']) != null ? ref11[0] : void 0;
        }
        location = this.presentLocation({
            city: city,
            stateCode: stateCode,
            countryCode: countryCode,
            postalCode: postalCode
        });
        datetime = this.presentTimestamp(rawActivity != null ? (ref12 = rawActivity['DateTime']) != null ? ref12[0] : void 0 : void 0, location != null ? location.ZipCode : void 0);
        details = rawActivity != null ? (ref14 = rawActivity['EventShortText']) != null ? ref14[0] : void 0 : void 0;
        if ((details != null) && (datetime != null)) {
            TrackEvent = {
                Event: details,
                DateTime: moment(datetime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"), //"YYYY-MM-DDTHH:mm:ss.SSSZ"
                Location: location
            };
        }
        return TrackEvent;
    }

    getActivitiesAndStatus(shipment) {
        var activities, activity, i, len, rawActivity, ref2, ref3;
        activities = [];
        ref3 = (shipment != null ? (ref2 = shipment['Events']) != null ? ref2[0]['Event'] : void 0 : void 0) || [];
        for (i = 0, len = ref3.length; i < len; i++) {
            rawActivity = ref3[i];
            activity = this.presentActivity(rawActivity);
            if (activity != null) {
                activities.push(activity);
            }
        }
        return {
            activities: activities,
            status: this.getStatus(shipment)
        };
    }

    requestOptions(arg) {
        var carrierUrl;
        carrierUrl = util.format(arg.CarrierConfig.CARRIER_URL, arg.TrackingId);
        return {
            method: 'GET',
            uri: carrierUrl
        };
    }

    getCarrierStatus(shipment) {
        var finalEvent, carrierStatus, ref1, ref2, ref3;
        finalEvent = shipment != null ? (ref1 = shipment['Events']) != null ? (ref3 = ref1[0]['Event']) ? ref3[0] : void 0 : void 0 : void 0;
        carrierStatus = finalEvent ? (ref2 = finalEvent['EventShortText']) != null ? ref2[0] : void 0 : void 0;
        return carrierStatus;
    }

    getCarrierNotes(shipment) {
        var finalEvent, ref1, ref2, ref3, carrierNotes;
        finalEvent = shipment != null ? (ref2 = shipment['Events']) != null ? (ref3 = ref2[0]['Event']) ? ref3[0] : void 0 : void 0 : void 0;
        carrierNotes = finalEvent != null ? (ref1 = finalEvent['Location']) != null ? ref1[0] : void 0 : void 0;
        return carrierNotes;
    }

    getStatusLocation(shipment) {
        var finalEvent, city, stateCode, countryCode, postalCode, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, location, ref11, ref12, ref13;

        finalEvent = shipment != null ? (ref1 = shipment['Events']) != null ? (ref11 = ref1[0]['Event']) ? ref11[0] : void 0 : void 0 : void 0;
        
        if ((ref2 = finalEvent['City']) != null ? (ref12 = ref2[0]) != null ? ref12.length : void 0 : void 0) {
            city = (ref13 = finalEvent['City']) != null ? ref13[0] : void 0;
        }
        if (ref3 = finalEvent ? (ref3 = finalEvent['State']) != null ? (ref4 = ref3[0]) != null ? ref4.length : void 0 : void 0 : void 0) {
            stateCode = (ref5 = finalEvent['State']) != null ? ref5[0] : void 0;
        }
        if (ref6 = finalEvent ? (ref6 = finalEvent['PostalCode']) != null ? (ref7 = ref6[0]) != null ? ref7.length : void 0 : void 0 : void 0) {
            postalCode = (ref8 = finalEvent['PostalCode']) != null ? common.get5DigitZipCode(ref8[0]) : void 0;
        }
        if (ref9 = finalEvent ? (ref9 = finalEvent['Country']) != null ? (ref10 = ref9[0]) != null ? ref10.length : void 0 : void 0 : void 0) {
            countryCode = (ref11 = finalEvent['Country']) != null ? ref11[0] : void 0;
        }

        location = this.presentLocation({
            city: city,
            stateCode: stateCode,
            countryCode: countryCode,
            postalCode: postalCode
        });

        return location;
    }

    getStatusDateTime(shipment) {
        var finalEvent, timestamp, ref1, ref2, ref3, ref4, location;

        finalEvent = shipment != null ? (ref1 = shipment['Events']) != null ? (ref4 = ref1[0]['Event']) ? ref4[0] : void 0 : void 0 : void 0;
        location = this.getDestination(finalEvent ? finalEvent : void 0);
        timestamp = this.presentTimestamp(finalEvent ? (ref2 = finalEvent['DateTime']) != null ? ref2[0] : void 0 : void 0, location != null ? location.ZipCode : void 0);
        return timestamp;
    };

}

module.exports = {
    LasershipClient: LasershipClient
};

