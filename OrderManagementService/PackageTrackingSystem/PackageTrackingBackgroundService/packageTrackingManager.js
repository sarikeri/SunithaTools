var async = require("async");
var zipcodeDatabase = require('./zipcodes.json');
var moment = require("moment-timezone");
var trackingSubscriptionsProvider = require('./dataProviders/trackingSubscriptionsProvider');
var packageTracker = require('./packageTracker');
var logger = require('./utils/logger');
var config = require('./config');

class PackageTrackingManager {
    constructor(clientConfigs, carrierConfigs, eventConfigs) {
        if (clientConfigs.length == 0 || carrierConfigs.length == 0 || eventConfigs.length == 0) {
            var err = `One or more configuration is invalid. ClientConfig: ${clientConfigs.length} records; CarrierConfig: ${carrierConfigs.length} records; EventConfig: ${eventConfigs.length} records;`;
            logger.error(err);
            throw new Error(err);
        }
        this.clientConfigs = clientConfigs;
        this.carrierConfigs = carrierConfigs;
        this.eventConfigs = eventConfigs;
    }

    doWork() {
        this.carrierConfigs.forEach((config) => {
            this.performCarrierTask(config);
        });
    }

    performCarrierTask(carrierConfig) {
        logger.verbose(`Starting batch processing for carrier ${carrierConfig.carrierId}`);         
        var subscriptionsProvider = new trackingSubscriptionsProvider();
        subscriptionsProvider.getSubscriptions(carrierConfig.carrierId, carrierConfig.maxTrackingDays, config.hostName)
            .then((subscriptions) => {
                var eligibleSubscriptions = this.getEligibleSubscriptions(subscriptions, carrierConfig.initialWaitDays, carrierConfig.schedule);
                if (eligibleSubscriptions.length == 0) {
                    logger.verbose(`${carrierConfig.carrierId} does not have any eligible subscriptions to process`);
                    this.sleep(carrierConfig);
                } else {
                    this.performBatchAsyncTracking(carrierConfig.carrierId, eligibleSubscriptions, carrierConfig.maxParallelCalls)
                        .then(() => {
                            // Nothing to do here. We are good.
                        })
                        .catch((err) => {
                            logger.error(err);
                        })
                        // using "then" after "catch" block works as "finally" (will be invoked irrespective of resolve or reject)
                        .then(() => {
                            this.sleep(carrierConfig);
                        });
                }
            })
            .catch((err) => {
                logger.error(err);
                this.sleep(carrierConfig);
            });
    }

    sleep(carrierConfig) {
        // Sleep for a specified amount of time before starting the next batch
        logger.verbose(`${carrierConfig.carrierId} batch handler going to sleep for ${config.sleepBetweenBatchInMs} milliseconds`);
        setTimeout(() => {
            this.performCarrierTask(carrierConfig);
        }, config.sleepBetweenBatchInMs);
    }

    getEligibleSubscriptions(subscriptions, initialWaitDays, schedule) {
        var eligibleSubscriptions = [];
        if (!subscriptions || subscriptions.length == 0)
            return eligibleSubscriptions;
        subscriptions.forEach((subscription) => {
            if (subscription.minsAfterPreviousAttempt >= 0 && subscription.minsAfterPreviousAttempt < config.retryWaitMins) {
                return; // return works as continue here
            }
            var destinationTimeZone = this.getTimeZoneFromZip(subscription.destinationZipCode);
            var currentDestinationDateTime = moment().tz(destinationTimeZone);
            var shippedDestinationDateTime = moment(subscription.shippingDate).tz(destinationTimeZone);
            var initialWaitPeriodExpirationDateTime = shippedDestinationDateTime.add(initialWaitDays, "day").startOf('day');
            logger.debug(`currentDestinationDateTime: ${currentDestinationDateTime}`);
            logger.debug(`initialWaitPeriodExpirationDateTime: ${initialWaitPeriodExpirationDateTime}`);
            if (currentDestinationDateTime > initialWaitPeriodExpirationDateTime) {
                var scheduleDestinationDateTime = this.getScheduleDateTime(schedule, destinationTimeZone);
                var lastTrackingDestinationDateTime = moment(subscription.lastTrackingDate).tz(destinationTimeZone);
                logger.debug(`scheduleDestinationDateTime: ${scheduleDestinationDateTime}`);
                logger.debug(`lastTrackingDestinationDateTime: ${lastTrackingDestinationDateTime}`);
                if ((currentDestinationDateTime > scheduleDestinationDateTime) && (scheduleDestinationDateTime > initialWaitPeriodExpirationDateTime)
                    && (!subscription.lastTrackingDate || scheduleDestinationDateTime > lastTrackingDestinationDateTime)) {
                    eligibleSubscriptions.push(subscription);
                };
            }
        });
        return eligibleSubscriptions;
    }

    getScheduleDateTime(schedule, destinationTimeZone) {
        var scheduleTime;
        var scheduleDateTime;
        var lastScheduleOfTheDay;
        var currentDestinationDateTime = moment().tz(destinationTimeZone);
        logger.debug(`destinationZipCode: ${destinationTimeZone}`);
        logger.debug(`currentDestinationDateTime: ${currentDestinationDateTime}`);
        var currentDestinationDate = currentDestinationDateTime.format('MM-DD-YYYY');
        var currentDestinationTime = currentDestinationDateTime.format("HH:mm:ss");
        schedule.forEach((s) => {
            if (!lastScheduleOfTheDay || s > lastScheduleOfTheDay)
                lastScheduleOfTheDay = s;
            if (currentDestinationTime >= s && (!scheduleTime || s > scheduleTime))
                scheduleTime = s;
        });
        if (!scheduleTime) {
            scheduleTime = lastScheduleOfTheDay;
            scheduleDateTime = moment.tz(`${currentDestinationDateTime.format('YYYY-MM-DD')}T${scheduleTime}:00`, destinationTimeZone).subtract(1, "day");
        } else {
            scheduleDateTime = moment.tz(`${currentDestinationDateTime.format('YYYY-MM-DD')}T${scheduleTime}:00`, destinationTimeZone);
        }
        return scheduleDateTime;
    }

    getTimeZoneFromZip(zipCode) {
        var timeZone;
        if (zipcodeDatabase.hasOwnProperty(zipCode)) {
            timeZone = zipcodeDatabase[zipCode];
        } else {
            logger.verbose(`Did not find timezone mapping for zipcode ${zipCode}.`);
            timeZone = config.defaultTimeZone;
        }
        return timeZone;
    }

    performBatchAsyncTracking(carrierId, subscriptions, maxParallelCalls) {
        logger.verbose(`Starting async tracking for ${subscriptions.length} subscriptions for ${carrierId} carrier.`);
        var asyncTasks = [];
        let eventConfigs = this.eventConfigs;
        let clientConfigs = this.clientConfigs;
        subscriptions.forEach(function (subscription, index, array) {
            asyncTasks.push(function (callback) {
                var pkgTracker = new packageTracker(eventConfigs, clientConfigs);
                logger.verbose(`Starting to track ${subscription.carrierId} tracking Id ${subscription.trackingId}.`);
                pkgTracker.trackIt(subscription)
                    .then(() => {
                        logger.verbose(`Completed tracking and generating event (if required) for ${subscription.carrierId} tracking Id ${subscription.trackingId}.`);
                    })
                    .catch((err) => {
                        logger.error(err);
                    })
                    .then(() => {
                        callback();
                    });
            });
        });

        return new Promise((resolve, reject) => {
            async.parallelLimit(asyncTasks, maxParallelCalls, function (err, results) {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }
                logger.verbose(`Completed all tasks for ${carrierId}.`);
                resolve();
            });
        });
    }
}

module.exports = PackageTrackingManager;