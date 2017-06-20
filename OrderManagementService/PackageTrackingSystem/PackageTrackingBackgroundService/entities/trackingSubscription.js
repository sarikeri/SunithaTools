class trackingSubscription {
    constructor(ptsClientId, carrierId, trackingId, siteId, orderId, shippingDate, lastTrackingStatus, 
        lastTrackingDate, retryCount, destinationZipCode, minsAfterPreviousAttempt) {
        this.ptsClientId = ptsClientId,
        this.carrierId = carrierId,
        this.trackingId = trackingId,
        this.siteId = siteId,
        this.orderId = orderId,
        this.shippingDate = shippingDate,
        this.lastTrackingStatus = lastTrackingStatus,
        this.lastTrackingDate = lastTrackingDate,
        this.retryCount = retryCount,
        this.destinationZipCode = destinationZipCode,
        this.minsAfterPreviousAttempt = minsAfterPreviousAttempt;
    }
}

module.exports = trackingSubscription;