var trackingDetailRepository = require('../dalRepositories/trackingDetailRepository.js');
var trackingDetailRepositoryObj = new trackingDetailRepository();

class TrackingDetailProvider {
    constructor() { }

    getTrackingDetail(SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId) {
        return new Promise(function (resolve, reject) {
            trackingDetailRepositoryObj.getTrackingDetail(SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId)
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    addTrackingDetail(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, trackResponse, trackingDate) {
        return new Promise(function (resolve, reject) {
            trackingDetailRepositoryObj.addTrackingDetail(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, trackResponse, trackingDate)
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    updateTrackingDetail(SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, trackResponse, clientIds, trackingDate) {
        return new Promise(function (resolve, reject) {
            trackingDetailRepositoryObj.updateTrackingDetail(SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, trackResponse, clientIds, trackingDate)
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
}

module.exports = TrackingDetailProvider;