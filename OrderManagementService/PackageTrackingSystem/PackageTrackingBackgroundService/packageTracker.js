var logger = require('./utils/logger');
var trackingSubscription = require('./entities/trackingSubscription');
var trackingSubscriptionsProvider = require('./dataProviders/trackingSubscriptionsProvider');
var config = require('./config');
var logger = require('./utils/logger');
var trackingDetailsClient = require('./serviceClients/trackingDetailsClient');
var eventGeneratorClient = require('./serviceClients/eventGeneratorClient');

class packageTracker {
    constructor(eventConfigs, clientConfigs) {
        this.eventConfigs = eventConfigs;
        this.clientConfigs = clientConfigs;
        this.trackingSubscriptionsProvider = new trackingSubscriptionsProvider();
    }

    // 1. Lock the tracking subscription record
    // 2. Call Package tracking web service
    // 3. Based on the response from the web service, check if the tracking status has changed to a state that requires eventing
    // 4. If eventing is required, called Event Generator web service
    // 5. Update the tracking subscription table based on the outcome of above steps
    trackIt(subscription) {
        return new Promise((resolve, reject) => {
            this.trackingSubscriptionsProvider.lockSubscription(subscription, config.hostName)
                .then((isLocked) => {
                    this.getTrackingData(subscription.siteId, subscription.orderId, subscription.shippingDate, subscription.carrierId, subscription.trackingId)
                        .then((trackingResponse) => {
                            var generateEvent = false;
                            var eventName;

                            if (trackingResponse.trackingStatus != subscription.lastTrackingStatus) {
                                for (let eventConfig of this.eventConfigs) {
                                    if (trackingResponse.trackingStatus == eventConfig.trackingStatus) {
                                        generateEvent = true;
                                        eventName = eventConfig.eventName;
                                        break;
                                    }
                                }
                            }

                            if (generateEvent) {
                                logger.verbose(`Generating event for ${subscription.carrierId} tracking Id ${subscription.trackingId}`);
                                // Call event generator. Set trackingSuccess = true/false based on the response from event generator
                                this.generateEvent(eventName, subscription.ptsClientId, subscription.siteId, subscription.orderId, subscription.trackingId, trackingResponse.trackingData)
                                    .then((evtGenResponse) => {
                                        this.updateSubscription(subscription, trackingResponse.trackingStatus, true, true, '', resolve, reject);
                                    })
                                    .catch((err) => {
                                        var errMessage = `Error generating event: ${err}. Tracking was successful. ${subscription.carrierId} tracking id ${subscription.trackingId}`;
                                        logger.error(errMessage);
                                        this.updateSubscription(subscription, trackingResponse.trackingStatus, true, false, errMessage, resolve, reject)
                                    });
                            } else {
                                this.updateSubscription(subscription, trackingResponse.trackingStatus, true, true, '', resolve, reject);
                            }
                        })
                        .catch((err) => {
                            var errMessage = `Error calling tracking detail API for ${subscription.carrierId} tracking id ${subscription.trackingId}. ${err}`;
                            logger.error(errMessage);
                            this.updateSubscription(subscription, '', false, false, errMessage, resolve, reject);
                        });
                })
                .catch((err) => {
                    if (err.lockedByOtherProcess) {
                        logger.verbose(`This subscription is locked by another process`);
                        resolve();
                    } else {
                        reject(`Error while locking the subscription record: ${err}`);
                    }
                });
        });
    }

    getTrackingData(siteId, orderId, shippingDate, carrierId, trackingId) {
        var clientId = config.packageTrackingDetailsClientId;
        var tdClient = new trackingDetailsClient();
        return new Promise((resolve, reject) => {
            tdClient.getTrackingDetails(clientId, siteId, orderId, shippingDate, carrierId, trackingId)
                .then((result) => {
                    resolve({ trackingStatus: result.status, trackingData: result.trackingData });
                    logger.debug(`trackingStatus: ${result.status}`);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    generateEvent(eventName, ptsClientId, siteId, orderId, trackingId, trackingData) {
        var secondaryEpClientId = this.mapPtsToEpClientId(ptsClientId);
        var egClient = new eventGeneratorClient();
        return new Promise((resolve, reject) => {
            egClient.generateEvent(siteId, orderId, trackingId, eventName, trackingData, secondaryEpClientId)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    mapPtsToEpClientId(ptsClientId) {
        var epClientId = 0;
        for (let config of this.clientConfigs) {
            if (config.ptsClientId == ptsClientId) {
                epClientId = config.epClientId;
                break;
            }
        }
        return epClientId;
    }

    updateSubscription(subscription, newTrackingStatus, trackingResult, eventGenResult, errorText, resolveCallback, rejectCallback) {
        var shouldUpdateTrackingDate = false;
        var subscriptionStatus = 1;
        var trackingStatus = subscription.lastTrackingStatus;
        var retryCount = subscription.retryCount;
        if (!trackingResult || !eventGenResult) {
            retryCount += 1;
            if (retryCount >= config.maxRetryCount) {
                errorText = `Max retry limit reached. ${errorText}`;
                subscriptionStatus = config.subscriptionErrorStatus;
            }
        } else if (trackingResult && eventGenResult) {
            retryCount = 0;
            shouldUpdateTrackingDate = true;
            trackingStatus = newTrackingStatus;
            if (this.hasTrackingReachedTerminalStatus(newTrackingStatus)) {
                subscriptionStatus = config.subscriptionCompletedStatus;
            }
        }
        var newSubscription = new trackingSubscription(subscription.ptsClientId, subscription.carrierId, subscription.trackingId, subscription.siteId, subscription.orderId,
            subscription.shippingDate, trackingStatus, null, retryCount);
        this.trackingSubscriptionsProvider.updateSubscription(newSubscription, subscriptionStatus, shouldUpdateTrackingDate, config.hostName, errorText)
            .then((result) => {
                resolveCallback();
            })
            .catch((err) => {
                logger.error(`Error updating subscription results. Tracking successful: ${trackingResult}. Event generation successful: ${eventGenResult}. ${subscription.carrierId} tracking id ${subscription.trackingId}`);
                rejectCallback(err);
            });
    }

    hasTrackingReachedTerminalStatus(newTrackingStatus) {
        for (let status of config.terminalTrackingStatuses) {
            if (status == newTrackingStatus) {
                return true;
            }
        }
        return false;
    }
}

module.exports = packageTracker;