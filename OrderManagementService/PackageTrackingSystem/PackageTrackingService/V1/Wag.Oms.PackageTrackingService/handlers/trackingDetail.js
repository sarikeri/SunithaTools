var lasershipClient, fedexClient, uspsClient, onTracClient, lasershipClient, _this;
var Carriers = require('../carriers/carriers.js');
var moment = require('moment-timezone');


class TrackingDetail {
    constructor(carrierConfig) {
        _this = this;
        //todo get the shipper client credentials from configuration tables
        var param = {};
        if (carrierConfig.Credentials != undefined) {
            for (var creIndex = 0; creIndex < carrierConfig.Credentials.length; creIndex++) {
                param[carrierConfig.Credentials[creIndex].Key] = carrierConfig.Credentials[creIndex].Value;
            }
        }
        if (carrierConfig.CARRIER_ID.toUpperCase() == 'FEDEX') {
            fedexClient = new Carriers.FedexClient(param);
        }

        if (carrierConfig.CARRIER_ID.toUpperCase() == 'USPS') {
            uspsClient = new Carriers.UspsClient(param);
        }

        if (carrierConfig.CARRIER_ID.toUpperCase() == 'ONTRAC') {
            onTracClient = new Carriers.OnTracClient(param);
        }

        if (carrierConfig.CARRIER_ID.toUpperCase() == 'LASERSHIP') {
            lasershipClient = new Carriers.LasershipClient(param);
        }
    }

    getTrackingDetail(SiteId, OrderId, ShippingDateTime, CarrierConfig, TrackingId) {
        return new Promise(function(resolve, reject) {
            var trackingData = _this.trackingDetailFunc(SiteId, OrderId, ShippingDateTime, CarrierConfig, TrackingId)
                .then(function(trackingData) {
                    resolve(trackingData);
                })
                .catch(function(e) {
                    reject(e);
                });
        });
    }

    trackingDetailFunc(SiteId, OrderId, ShippingDateTime, CarrierConfig, TrackingId) {
        return new Promise(function(resolve, reject) {
            var requestData = {
                SiteId: SiteId,
                OrderId: OrderId,
                ShippingDateTime: ShippingDateTime,
                CarrierConfig: CarrierConfig,
                TrackingId: TrackingId
            };

            if (CarrierConfig.CARRIER_ID.toUpperCase() == 'FEDEX') {
                fedexClient.requestData(requestData)
                    .then(function(data) {
                        resolve(data);
                    })
                    .catch(function(e) {
                        reject(e);
                    });
            }
            else if (CarrierConfig.CARRIER_ID.toUpperCase() == 'USPS') {
                uspsClient.requestData(requestData)
                    .then(function (data) {
                        resolve(data);
                    })
                    .catch(function (e) {
                        reject(e);
                    });
            }
            else if (CarrierConfig.CARRIER_ID.toUpperCase() == 'ONTRAC') {
                onTracClient.requestData(requestData)
                    .then(function (data) {
                        resolve(data);
                    })
                    .catch(function (e) {
                        reject(e);
                    });
            }
            else if (CarrierConfig.CARRIER_ID.toUpperCase() == 'LASERSHIP') {
                lasershipClient.requestData(requestData)
                    .then(function (data) {
                        resolve(data);
                    })
                    .catch(function (e) {
                        reject(e);
                    });
            }
            else {
                resolve(_this.trackingDetailMockFunc(SiteId, OrderId, ShippingDateTime, CarrierConfig.CARRIER_ID, TrackingId));
            }
        });

    }

    trackingDetailMockFunc(SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId) {
        var trackResponse = {};

        var trackSummary = {};
        trackSummary.SiteId = SiteId;
        trackSummary.OrderId = OrderId;
        trackSummary.ShippingDateTime = moment(ShippingDateTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
        trackSummary.CarrierId = CarrierId;
        trackSummary.TrackingId = TrackingId;
        trackSummary.EstimatedDeliveryDateTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";
        trackSummary.Status = "Delivered"; //ReadyForPickUp;InTransit;OutForDelivery;Delivered;NotDeliverable
        trackSummary.CarrierStatus = "DeliveryCompleted";
        trackSummary.DateTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";

        var location = {};
        location.City = "DELMAR";
        location.State = "DE";
        location.ZipCode = "19940";
        location.Country = "USA";

        trackSummary.Location = location;
        trackResponse.TrackSummary = trackSummary;

        var trackEvents = [];

        var trackEvents1 = {};
        trackEvents1.Event = "Out for Delivery";
        trackEvents1.DateTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";

        var trackEvents1Location = {};
        trackEvents1Location.City = "DELMAR";
        trackEvents1Location.State = "DE";
        trackEvents1Location.ZipCode = "19940";
        trackEvents1Location.Country = "USA";

        trackEvents1.Location = trackEvents1Location;

        trackEvents.push(trackEvents1);

        var trackEvents2 = {};
        trackEvents2.Event = "Received";
        trackEvents2.DateTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";

        var trackEvents2Location = {};
        trackEvents2Location.City = "BELLEVUE";
        trackEvents2Location.State = "WA";
        trackEvents2Location.ZipCode = "98004";
        trackEvents2Location.Country = "USA";

        trackEvents2.Location = trackEvents2Location;
        trackEvents.push(trackEvents2);

        var trackEvents3 = {};
        trackEvents3.Event = "Order Created";
        trackEvents3.DateTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //"YYYY-MM-DDTHH:mm:ss.SSSZ";

        var trackEvents3Location = {};
        trackEvents3Location.City = "BELLEVUE";
        trackEvents3Location.State = "WA";
        trackEvents3Location.ZipCode = "98004";
        trackEvents3Location.Country = "USA";

        trackEvents3.Location = trackEvents3Location;
        trackEvents.push(trackEvents3);

        trackResponse.TrackEvents = trackEvents;

        return trackResponse;
    }
}

module.exports = TrackingDetail;