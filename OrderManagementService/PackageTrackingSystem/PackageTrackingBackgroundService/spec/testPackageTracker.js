var sinon = require('sinon');
var moment = require('moment');
var expect = require('chai').expect;
var trackingSubscriptionsProvider = require('./../dataProviders/trackingSubscriptionsProvider');
var trackingSubscription = require('./../entities/trackingSubscription');
var carrierConfiguration = require('./../entities/carrierConfiguration');
var clientConfiguration = require('./../entities/clientConfiguration');
var eventConfiguration = require('./../entities/eventConfiguration');
var packageTracker = require("./../packageTracker");
var trackingDetailsClient = require('./../serviceClients/trackingDetailsClient');
var eventGeneratorClient = require('./../serviceClients/eventGeneratorClient');

var lockIt = function (lockResult, lockedByOtherProcess) {
    return new Promise((resolve, reject) => {
        if (lockResult) {
            resolve();
        } else if (lockedByOtherProcess) {
            var err = { lockedByOtherProcess: lockedByOtherProcess };
            reject(err);
        } else {
            reject(`Custom locking error`);
        }
    });
}

var updateSubscription = function (updateResult) {
    return new Promise((resolve, reject) => {
        if (updateResult) {
            resolve(1);
        } else {
            reject(`Custom subscription update error`);
        }
    });
}

var getTrackingDetails = function (trackingResult, trackingStatus) {
    return new Promise((resolve, reject) => {
        if (trackingResult) {
            resolve({ status: trackingStatus, trackingData: "Tracking events" });
        } else {
            reject(`Custom tracking details error`);
        }
    });
};

var generateEvent = function (eventGenerationResult) {
    return new Promise((resolve, reject) => {
        if (eventGenerationResult) {
            resolve();
        } else {
            reject(`Custom event generation error`);
        }
    });
}

describe('Test locking of a package subscription', function () {
    var pkgTracker = new packageTracker();
    var stubLock;

    it('Unable to lock subscription record', function () {
        stubLock = sinon.stub(trackingSubscriptionsProvider.prototype, 'lockSubscription').returns(lockIt(false, true));
        return new Promise((resolve, reject) => {
            pkgTracker.trackIt(null)
                .then((response) => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
            });
    });

    it('Error while locking the subscription record', function () {
        stubLock = sinon.stub(trackingSubscriptionsProvider.prototype, 'lockSubscription').returns(lockIt(false, false));
        return new Promise((resolve, reject) => {
            pkgTracker.trackIt(null)
                .then((response) => {
                    reject(`Failure flow entered success path`);
                })
                .catch((err) => {
                    expect(err).to.equal(`Error while locking the subscription record: Custom locking error`);
                    resolve();
                });
            });
    });

    afterEach(function () {
        stubLock.restore();
    });
});

describe('Test for successful lock, but failure downstream', function () {
    var pkgTracker = new packageTracker([new eventConfiguration('Delivered', 'Delivered')], []);
    var stubLock;
    var stubUpdateSubscription;
    var stubTrackingDetailsClient;
    var stubEventGeneratorClient;
    var spy;
    var subscription = new trackingSubscription(1, 'FedEx', 'ZXCV', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007');

    it('Successfully locks, fails to get tracking detail, successfully updates subscription', function () {
        stubLock = sinon.stub(trackingSubscriptionsProvider.prototype, 'lockSubscription').returns(lockIt(true, false));
        stubUpdateSubscription = sinon.stub(trackingSubscriptionsProvider.prototype, 'updateSubscription').returns(updateSubscription(true));
        stubTrackingDetailsClient = sinon.stub(trackingDetailsClient.prototype, 'getTrackingDetails').returns(getTrackingDetails(false, "Some status"));
        spy = sinon.spy(pkgTracker, "updateSubscription");
        // Returning a promise a better practices when testing promise based methods.
        // http://stackoverflow.com/questions/39716569/nodejs-unhandledpromiserejectionwarning
        return new Promise((resolve, reject) => {
            pkgTracker.trackIt(subscription)
                .then((response) => {
                    expect(pkgTracker.updateSubscription.calledOnce).to.be.true;
                    var spyCall = pkgTracker.updateSubscription.getCall(0);
                    expect(spyCall.args[0]).to.deep.equal(subscription);
                    expect(spyCall.args[1]).equals('');
                    expect(spyCall.args[2]).to.not.be.true;
                    expect(spyCall.args[3]).to.not.be.true;
                    expect(spyCall.args[4]).contains(`Custom tracking details error`);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });

    it('Successfully locks, gets tracking detail, no event to generate, fails to update subscription', function () {
        stubLock = sinon.stub(trackingSubscriptionsProvider.prototype, 'lockSubscription').returns(lockIt(true, false));
        stubUpdateSubscription = sinon.stub(trackingSubscriptionsProvider.prototype, 'updateSubscription').returns(updateSubscription(false));
        stubTrackingDetailsClient = sinon.stub(trackingDetailsClient.prototype, 'getTrackingDetails').returns(getTrackingDetails(true, "Not Delivered"));
        spy = sinon.spy(pkgTracker, "updateSubscription");
        return new Promise((resolve, reject) => {
            pkgTracker.trackIt(subscription)
                .then((response) => {
                    reject(`Failure flow entered success path`);
                })
                .catch((err) => {
                    expect(err).to.equal(`Custom subscription update error`);
                    resolve();
                });
        });
    });

    it('Successfully locks, gets tracking detail, fails to generate event, successfully updates subscription', function () {
        stubLock = sinon.stub(trackingSubscriptionsProvider.prototype, 'lockSubscription').returns(lockIt(true, false));
        stubUpdateSubscription = sinon.stub(trackingSubscriptionsProvider.prototype, 'updateSubscription').returns(updateSubscription(true));
        stubTrackingDetailsClient = sinon.stub(trackingDetailsClient.prototype, 'getTrackingDetails').returns(getTrackingDetails(true, "Delivered"));
        stubEventGeneratorClient = sinon.stub(eventGeneratorClient.prototype, 'generateEvent').returns(generateEvent(false));
        spy = sinon.spy(pkgTracker, "updateSubscription");
        return new Promise((resolve, reject) => {
            pkgTracker.trackIt(subscription)
                .then((response) => {
                    expect(pkgTracker.updateSubscription.calledOnce).to.be.true;
                    var spyCall = pkgTracker.updateSubscription.getCall(0);
                    expect(spyCall.args[0]).to.deep.equal(subscription);
                    expect(spyCall.args[1]).equals('Delivered');
                    expect(spyCall.args[2]).to.be.true;
                    expect(spyCall.args[3]).to.not.be.true;
                    expect(spyCall.args[4]).contains(`Custom event generation error`);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });

    afterEach(function () {
        if (stubLock)
            stubLock.restore();
        if (stubUpdateSubscription)
            stubUpdateSubscription.restore();
        if (stubTrackingDetailsClient)
            stubTrackingDetailsClient.restore();
        if (stubEventGeneratorClient)
            stubEventGeneratorClient.restore();
        if (spy)
            spy.restore();
    });
});

describe('Test for happy path package tracking', function () {
    var pkgTracker = new packageTracker([new eventConfiguration('Delivered', 'Delivered')], [new clientConfiguration(1, 100)]);
    var stubLock;
    var stubUpdateSubscription;
    var stubTrackingDetailsClient;
    var stubEventGeneratorClient;
    var spy;
    var subscription = new trackingSubscription(1, 'FedEx', 'ZXCV', 100, '12345', moment().subtract(1, "day"), null, null, 0, '98007');

    it('Successfully locks, gets tracking detail, generates event, successfully updates subscription', function () {
        stubLock = sinon.stub(trackingSubscriptionsProvider.prototype, 'lockSubscription').returns(lockIt(true, false));
        stubUpdateSubscription = sinon.stub(trackingSubscriptionsProvider.prototype, 'updateSubscription').returns(updateSubscription(true));
        stubTrackingDetailsClient = sinon.stub(trackingDetailsClient.prototype, 'getTrackingDetails').returns(getTrackingDetails(true, "Delivered"));
        stubEventGeneratorClient = sinon.stub(eventGeneratorClient.prototype, 'generateEvent').returns(generateEvent(true));
        spy = sinon.spy(pkgTracker, "updateSubscription");
        return new Promise((resolve, reject) => {
            pkgTracker.trackIt(subscription)
                .then((response) => {
                    expect(pkgTracker.updateSubscription.calledOnce).to.be.true;
                    var spyCall = pkgTracker.updateSubscription.getCall(0);
                    expect(spyCall.args[0]).to.deep.equal(subscription);
                    expect(spyCall.args[1]).equals('Delivered');
                    expect(spyCall.args[2]).to.be.true;
                    expect(spyCall.args[3]).to.be.true;
                    expect(spyCall.args[4]).equals('');
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });

    afterEach(function () {
        if (stubLock)
            stubLock.restore();
        if (stubUpdateSubscription)
            stubUpdateSubscription.restore();
        if (stubTrackingDetailsClient)
            stubTrackingDetailsClient.restore();
        if (stubEventGeneratorClient)
            stubEventGeneratorClient.restore();
        if (spy)
            spy.restore();
    });
});