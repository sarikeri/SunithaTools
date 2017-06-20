var sinon = require('sinon');
var expect = require('chai').expect;
var moment = require('moment');
var packageTrackingManager = require("./../packageTrackingManager");
var packageTracker = require("./../packageTracker");
var trackingSubscription = require('./../entities/trackingSubscription');
var carrierConfiguration = require('./../entities/carrierConfiguration');
var clientConfiguration = require('./../entities/clientConfiguration');
var eventConfiguration = require('./../entities/eventConfiguration');
var trackingSubscriptionsProvider = require('./../dataProviders/trackingSubscriptionsProvider');

var carrierConfigs = [new carrierConfiguration('FedEx', 2, 2, 1, ['23:59'])];
var clientConfigs = [new clientConfiguration(5, 500)];
var eventConfigs = [new eventConfiguration('Delivered', 'Delivered')];
var subscription = new trackingSubscription(1, 'FedEx', 'ZXCV', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007');
var schedule = ['10:30', '18:30'];

describe('Test Package Tracking Manager constructor validation', function () {
    it('Invalid configuration', function () {
        expect(function () { new packageTrackingManager(clientConfiguration, carrierConfigs, []) }).to.throw(Error);
    });
});

describe('Test retrieval of eligible subscriptions', function () {
    var trackingMgr = new packageTrackingManager(clientConfigs, carrierConfigs, eventConfigs);
    it('Returns zero record when there are no subscriptions', function () {        
        var eligibleSubscriptions = trackingMgr.getEligibleSubscriptions(null);
        expect(eligibleSubscriptions).to.be.empty;
    });

    it('Returns zero record when there subscriptions array is empty', function () {
        var eligibleSubscriptions = trackingMgr.getEligibleSubscriptions([]);
        expect(eligibleSubscriptions).to.be.empty;
    });

    it('Returns zero record when the wait time is not elapsed for the subscription', function () {
        var subscriptions = [subscription];
        var eligibleSubscriptions = trackingMgr.getEligibleSubscriptions(subscriptions, 2, schedule);
        expect(eligibleSubscriptions).to.be.empty;
    });

    it('Returns zero record when the wait time has elapsed but schedule time has not', function () {
        var subscriptions = [subscription];
        var eligibleSubscriptions = trackingMgr.getEligibleSubscriptions(subscriptions, 1, ['23:59']);
        expect(eligibleSubscriptions).to.be.empty;
    });

    it('Returns one record when the wait time and schedule time have elapsed for the subscription', function () {
        var subscriptions = [subscription];
        var eligibleSubscriptions = trackingMgr.getEligibleSubscriptions(subscriptions, 1, ['00:01']);
        expect(eligibleSubscriptions).not.to.be.empty;
        expect(eligibleSubscriptions[0].trackingId).to.equal(subscription.trackingId);
    });
});

var trackingResponse = function (isSuccess, throwError) {
    return new Promise((resolve, reject) => {
        if (throwError)
            throw new Error(`Custom tracker error`);
        if (isSuccess)
            resolve();
        else
            reject(`Tracking Rejection`);
    });
}

describe('Test Batch Async Tracking', function () {
    var trackingMgr = new packageTrackingManager(clientConfigs, carrierConfigs, eventConfigs);
    var stubPackageTracker;
    it('Happy path', function () {
        stubPackageTracker = sinon.stub(packageTracker.prototype, 'trackIt').returns(trackingResponse(true, false));
        return new Promise((resolve, reject) => {
            trackingMgr.performBatchAsyncTracking('FedEx', [subscription], 2)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(`Unexpected error. ${err }`);
                });
        });
    });

    it('Handles rejection from package tracker', function () {
        stubPackageTracker = sinon.stub(packageTracker.prototype, 'trackIt').returns(trackingResponse(false, false));
        return new Promise((resolve, reject) => {
            trackingMgr.performBatchAsyncTracking('FedEx', [subscription], 2)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(`Unexpected error.${err}`);
                });
        });
    });

    it('Swallows error thrown by package tracker', function () {
        stubPackageTracker = sinon.stub(packageTracker.prototype, 'trackIt').returns(trackingResponse(false, true));
        return new Promise((resolve, reject) => {
            trackingMgr.performBatchAsyncTracking('FedEx', [subscription], 2)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(`Unexpected error.${err}`);
                });
        });
    });

    afterEach(function () {
        if (stubPackageTracker)
            stubPackageTracker.restore();
    });
});

var getSubs = function (shouldReject) {
    return new Promise((resolve, reject) => {
        if (shouldReject)
            reject(`Custom rejection while retrieving subscriptions`);
        resolve([
            new trackingSubscription(1, 'FedEx', 'A123', 100, '00901', moment().subtract(1, "day"), null, null, 0, '00899'),
            new trackingSubscription(1, 'FedEx', 'A124', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007'),
            new trackingSubscription(1, 'FedEx', 'A125', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007'),
            new trackingSubscription(1, 'FedEx', 'A126', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007'),
            new trackingSubscription(1, 'FedEx', 'A127', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007'),
            new trackingSubscription(1, 'FedEx', 'A128', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007'),
            new trackingSubscription(1, 'FedEx', 'A129', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007'),
            new trackingSubscription(1, 'FedEx', 'A130', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007'),
            new trackingSubscription(1, 'FedEx', 'A131', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007')
        ]);
    });
};

describe('Test Carrier Task', function () {
    var trackingMgr = new packageTrackingManager(clientConfiguration, carrierConfiguration, eventConfiguration);
    var stubPackageTracker;
    var stubTrackingSubscriptionsProvider;
    it('Has no eligible subscription', function () {
        stubPackageTracker = sinon.stub(packageTracker.prototype, 'trackIt').returns(trackingResponse(true, false));
        stubTrackingSubscriptionsProvider = sinon.stub(trackingSubscriptionsProvider.prototype, 'getSubscriptions').returns(getSubs());
        trackingMgr.performCarrierTask(carrierConfigs[0]);
    });

    it('Handles the error when fetching subscriptions from database', function () {
        stubPackageTracker = sinon.stub(packageTracker.prototype, 'trackIt').returns(trackingResponse(true, false));
        stubTrackingSubscriptionsProvider = sinon.stub(trackingSubscriptionsProvider.prototype, 'getSubscriptions').returns(getSubs(true));
        trackingMgr.performCarrierTask(carrierConfigs[0]);
    });

    it('Happy path', function () {
        stubPackageTracker = sinon.stub(packageTracker.prototype, 'trackIt').returns(trackingResponse(true, false));
        stubTrackingSubscriptionsProvider = sinon.stub(trackingSubscriptionsProvider.prototype, 'getSubscriptions').returns(getSubs());
        trackingMgr.performCarrierTask(new carrierConfiguration('FedEx', 2, 2, 1, ['00:01']));
    });

    afterEach(function () {
        if (stubPackageTracker)
            stubPackageTracker.restore();
        if (stubTrackingSubscriptionsProvider)
            stubTrackingSubscriptionsProvider.restore();
    });
});