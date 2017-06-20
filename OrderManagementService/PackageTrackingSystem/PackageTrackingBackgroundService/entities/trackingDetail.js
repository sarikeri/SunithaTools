class trackingDetail {
    constructor(carrierId, trackingId, siteId, orderId, shippingDate, trackingStatus, trackingData) {
        this.carrierId = carrierId,
        this.trackingId = trackingId,
        this.siteId = siteId,
        this.orderId = orderId,
        this.shippingDate = shippingDate,
        this.trackingStatus = trackingStatus,
        this.trackingData = trackingData
    }
}

module.exports = trackingDetails;