var fs = require('fs');
var config = require('../config.js');
var common = require('../utils/common.js');

var Builder, Parser, ShipperClient, find,lowerCase, moment, ref, ref1, request, titleCase, upperCaseFirst,

ref = require('xml2js'), Builder = ref.Builder, Parser = ref.Parser;

find = require('underscore').find;

moment = require('moment-timezone');

titleCase = require('change-case').titleCase;

ShipperClient = require('./shipper').ShipperClient;

ref1 = require('change-case'), titleCase = ref1.titleCase, upperCaseFirst = ref1.upperCaseFirst, lowerCase = ref1.lowerCase;

ShipperClient = require('./shipper').ShipperClient;

var uspsStatusLookup = require('./uspsStatusLookup.json');

class UspsClient extends ShipperClient {

    constructor(arg, options) {
        super();
        this.userId = arg.userId;
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

    generateRequest(trk, clientIp) {
        if (clientIp == null) {
            clientIp = '127.0.0.1';
        }
        return this.builder.buildObject({
            'TrackFieldRequest': {
                '$': {
                    'USERID': this.userId
                },
                'Revision': '1',
                'ClientIp': clientIp,
                'SourceId': 'shipit',
                'TrackID': {
                    '$': {
                        'ID': trk
                    }
                }
            }
        });
    }

    validateResponse(response, cb) {
        var handleResponse;
        handleResponse = function(xmlErr, trackResult) {
            var ref2, ref3, trackInfo;
            trackInfo = trackResult != null ? (ref2 = trackResult['TrackResponse']) != null ? (ref3 = ref2['TrackInfo']) != null ? ref3[0] : void 0 : void 0 : void 0;
            if ((xmlErr != null) || (trackInfo == null)) {
                return cb(xmlErr);
            }
            return cb(null, trackInfo);
        };
        this.parser.reset();
        return this.parser.parseString(response, handleResponse);
    }

    getEta(shipment) {
        var rawEta, ref2, ref3, location;

        location = this.getDestination(shipment);        
        rawEta = ((ref2 = shipment['PredictedDeliveryDate']) != null ? ref2[0] : void 0);
        if (rawEta != null) {
            return this.presentTimestamp(rawEta, '12:00 pm', location != null ? location.ZipCode : void 0);
        }
    }

    getService(shipment) {
        var ref2, service;
        service = (ref2 = shipment['Class']) != null ? ref2[0] : void 0;
        if (service != null) {
            return service.replace(/\<SUP\>.*\<\/SUP\>/, '');
        }
    }

    getWeight(shipment) { }

    presentTimestamp(dateString, timeString, locationZip) {
        var locationTimeZone, locationTimeOffset;
        if (dateString == null) {
            return;
        }
        timeString = (timeString != null ? timeString.length : void 0) ? timeString : '12:00 am';
        

        if (locationZip == null) {
            locationTimeZone = config.defaultTimeZone;
        }
        else {
            locationTimeZone = this.getTimeZoneFromZip(locationZip);
        }
        locationTimeOffset = moment(dateString + " " + timeString).tz(locationTimeZone).format('Z');

        return moment(dateString + " " + timeString + locationTimeOffset).tz(locationTimeZone);
    }

    getDestination(shipment) {
        var city, postalCode, ref2, ref3, ref4, stateCode;
        city = shipment != null ? (ref2 = shipment['DestinationCity']) != null ? ref2[0] : void 0 : void 0;
        stateCode = shipment != null ? (ref3 = shipment['DestinationState']) != null ? ref3[0] : void 0 : void 0;
        postalCode = shipment != null ? (ref4 = shipment['DestinationZip']) != null ? common.get5DigitZipCode(ref4[0]) : void 0 : void 0;
        return this.presentLocation({
            city: city,
            stateCode: stateCode,
            postalCode: postalCode
        });
    }

    getOrigin(shipment) {
        var city, postalCode, ref2, ref3, ref4, stateCode;
        city = (ref2 = shipment['OriginCity']) != null ? ref2[0] : void 0;
        stateCode = (ref3 = shipment['OriginState']) != null ? ref3[0] : void 0;
        postalCode = (ref4 = shipment['OriginZip']) != null ? common.get5DigitZipCode(ref4[0]) : void 0;
        return this.presentLocation({
            city: city,
            stateCode: stateCode,
            postalCode: postalCode
        });
    }

    getStatus(shipment) {
        var trackSummary, carrierStatus, ref1, ref2;
        trackSummary = shipment != null ? (ref1 = shipment['TrackSummary']) != null ? ref1[0] : void 0 : void 0;
        carrierStatus = trackSummary ? (ref2 = trackSummary['EventCode']) != null ? ref2[0] : void 0 : void 0;

        if (carrierStatus == null) {
            return this.presentStatus(this.STATUS_TYPES.AWAITING_CARRIER_PICKUP);
        }

        return this.presentStatus(this.LookupStatus(carrierStatus));
    }

    LookupStatus(statusText) {
        var i = null;
        for (i = 0; uspsStatusLookup.length > i; i += 1) {
            if (uspsStatusLookup[i].StatusCode.toUpperCase() == statusText.toUpperCase()) {
                return this.STATUS_TYPES[uspsStatusLookup[i].OMSStatus.toUpperCase()];
            }
        }
        return this.STATUS_TYPES.IN_TRANSIT;
    }

    presentActivity(rawActivity) {
        var TrackEvent, datetime, city, countryCode, details, location, postalCode, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, stateCode, timestamp;
        if (rawActivity == null) {
            return;
        }
        city = (ref2 = rawActivity['EventCity']) != null ? ref2[0] : void 0;
        if ((ref3 = rawActivity['EventState']) != null ? (ref4 = ref3[0]) != null ? ref4.length : void 0 : void 0) {
            stateCode = (ref5 = rawActivity['EventState']) != null ? ref5[0] : void 0;
        }
        if ((ref6 = rawActivity['EventZIPCode']) != null ? (ref7 = ref6[0]) != null ? ref7.length : void 0 : void 0) {
            postalCode = (ref8 = rawActivity['EventZIPCode']) != null ? common.get5DigitZipCode(ref8[0]) : void 0;
        }
        if ((ref9 = rawActivity['EventCountry']) != null ? (ref10 = ref9[0]) != null ? ref10.length : void 0 : void 0) {
            countryCode = (ref11 = rawActivity['EventCountry']) != null ? ref11[0] : void 0;
        }
        location = this.presentLocation({
            city: city,
            stateCode: stateCode,
            countryCode: countryCode,
            postalCode: postalCode
        });
        datetime = this.presentTimestamp(rawActivity != null ? (ref12 = rawActivity['EventDate']) != null ? ref12[0] : void 0 : void 0, rawActivity != null ? (ref13 = rawActivity['EventTime']) != null ? ref13[0] : void 0 : void 0, location != null ? location.ZipCode : void 0);
        details = rawActivity != null ? (ref14 = rawActivity['Event']) != null ? ref14[0] : void 0 : void 0;
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
        var activities, activity, i, len, rawActivity, ref2, ref3, trackSummary;
        activities = [];
        trackSummary = this.presentActivity(shipment != null ? (ref2 = shipment['TrackSummary']) != null ? ref2[0] : void 0 : void 0);
        if (trackSummary) {
            activities.push(trackSummary);
        }
        ref3 = (shipment != null ? shipment['TrackDetail'] : void 0) || [];
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
        var clientIp, endpoint, TrackingId, xml;
        TrackingId = arg.TrackingId, clientIp = arg.clientIp;
        xml = this.generateRequest(TrackingId, clientIp);
        return {
            method: 'GET',
            uri: arg.CarrierConfig.CARRIER_URL + xml
        };
    }

    getCarrierStatus(shipment) {
        var trackSummary, carrierStatus, ref1, ref2;
        trackSummary = shipment != null ? (ref1 = shipment['TrackSummary']) != null ? ref1[0] : void 0 : void 0;
        carrierStatus = trackSummary ? (ref2 = trackSummary['Event']) != null ? ref2[0] : void 0 : void 0;
        return carrierStatus;
    }

    getCarrierNotes(shipment) {
        var ref1, carrierNotes;
        carrierNotes = shipment != null ? (ref1 = shipment['StatusSummary']) != null ? ref1[0] : void 0 : void 0;
        return carrierNotes;
    }

    getStatusLocation(shipment) {
        var trackSummary, city, stateCode, countryCode, postalCode, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11, location;

        if(trackSummary = shipment != null ? (ref1 = shipment['TrackSummary']) != null ? ref1[0] : void 0 : void 0) {
            city = (ref2 = trackSummary['EventCity']) != null ? ref2[0] : void 0;
        }
        if (ref3 = trackSummary ? (ref3 = trackSummary['EventState']) != null ? (ref4 = ref3[0]) != null ? ref4.length : void 0 : void 0 : void 0) {
            stateCode = (ref5 = trackSummary['EventState']) != null ? ref5[0] : void 0;
        }
        if (ref6 = trackSummary ? (ref6 = trackSummary['EventZIPCode']) != null ? (ref7 = ref6[0]) != null ? ref7.length : void 0 : void 0 : void 0) {
            postalCode = (ref8 = trackSummary['EventZIPCode']) != null ? common.get5DigitZipCode(ref8[0]) : void 0;
        }
        if (ref9 = trackSummary ? (ref9 = trackSummary['EventCountry']) != null ? (ref10 = ref9[0]) != null ? ref10.length : void 0 : void 0 : void 0) {
            countryCode = (ref11 = trackSummary['EventCountry']) != null ? ref11[0] : void 0;
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
        var location, trackSummary, timestamp, ref1, ref2, ref3, location;
        location = this.getStatusLocation(shipment);

        trackSummary = shipment != null ? (ref1 = shipment['TrackSummary']) != null ? ref1[0] : void 0 : void 0;
        location = this.getDestination(trackSummary ? trackSummary : void 0);
        timestamp = this.presentTimestamp(trackSummary ? (ref2 = trackSummary['EventDate']) != null ? ref2[0] : void 0 : void 0, trackSummary ? (ref3 = trackSummary['EventTime']) != null ? ref3[0] : void 0 : void 0, location != null ? location.ZipCode : void 0);
        return timestamp;
    };
}

module.exports = {
    UspsClient: UspsClient
};

