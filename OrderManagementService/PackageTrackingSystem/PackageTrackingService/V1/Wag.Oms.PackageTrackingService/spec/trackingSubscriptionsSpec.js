var trackingsubscriptionsHandler = require('../handlers/trackingsubscriptionsHandler.js');
var fakeData = require('./fakeDataSpec.js');
var dbAccess = require('../dalRepositories/dbAccess.js');
var trackingSubscriptionsRepository = require('../dalRepositories/trackingSubscriptionsRepository.js');
var clientConfigurationRepository = require('../dalRepositories/clientConfigurationRepository.js');
var dbClient = new dbAccess();
var deasync = require('deasync');

function createPoolAliasSync() {
    var sync = true;
    dbClient.createPool().then(function (result) {
        sync = false;
    })
        .catch(function (err) {
            sync = false;
            logger.error('Error occurred creating database connection pool', err);
            console.log('Exiting process');
            process.exit(0);
        });
    //while (sync) { deasync.sleep(100); }
    deasync.loopWhile(function(){return sync;});
    return 0;
}

// Testcases for Handler
describe("Positive  testcase for trackingsubscriptionsHandler:setTrackingSubscriptions for Orders #1", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingsubscriptionsHandlerObj = new trackingsubscriptionsHandler();

    beforeEach(function () {
        spyOn(trackingSubscriptionsRepository.prototype, "getTrackingSubscriptions").and.callFake(function (ClientId, PackageDetail) {
            return new Promise(function (resolve, reject) {
                var finalResult = {};
                finalResult.data = [];
                finalResult.ClientId = ClientId;
                finalResult.PackageDetail = PackageDetail;
                resolve(finalResult);
            });
        });

        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });
    });

    it("spies and fakes on tracking subscription Orders", function (done) {
        trackingsubscriptionsHandlerObj.setTrackingSubscriptions(fakeData.TrackingSubscriptionRequest.ClientId, fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequest.PackageDetails)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingSubscriptionResponse));
                expect(data.ClientId).toEqual(fakeData.TrackingSubscriptionResponse.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingSubscriptionResponse.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingSubscriptionResponse.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Positive  testcase for trackingsubscriptionsHandler:setTrackingSubscriptions for Orders #2", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingsubscriptionsHandlerObj = new trackingsubscriptionsHandler();

    beforeEach(function () {
        spyOn(trackingSubscriptionsRepository.prototype, "getTrackingSubscriptions").and.callFake(function (ClientId, PackageDetail) {
            return new Promise(function (resolve, reject) {
                var finalResult = {};
                finalResult.data = fakeData.TrackingSubscriptionDBResult;
                finalResult.ClientId = ClientId;
                finalResult.PackageDetail = PackageDetail;
                resolve(finalResult);
            });
        });

        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });
    });

    it("spies and fakes on tracking subscription Orders", function (done) {
        trackingsubscriptionsHandlerObj.setTrackingSubscriptions(fakeData.TrackingSubscriptionRequest.ClientId, fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequest.PackageDetails)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingSubscriptionResponse));
                expect(data.ClientId).toEqual(fakeData.TrackingSubscriptionResponse.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingSubscriptionResponse.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingSubscriptionResponse.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Validation  testcase for trackingsubscriptionsHandler:validateParameters for", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingsubscriptionsHandlerObj = new trackingsubscriptionsHandler();

    it("ClientId is required", function (done) {
        var FailureDescription = { "FailureDescription": 'ClientId is required' };

        trackingsubscriptionsHandlerObj.validateParameters(undefined, fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequest.PackageDetails)
            .then(function (data) {
                expect(data).toEqual(jasmine.objectContaining(FailureDescription));
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("ClientId should be valid integer", function (done) {
        var FailureDescription = { "FailureDescription": 'ClientId should be valid integer' };

        trackingsubscriptionsHandlerObj.validateParameters("ClientId", fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequest.PackageDetails)
            .then(function (data) {
                expect(data).toEqual(jasmine.objectContaining(FailureDescription));
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("ClientRequestReferenceId should be 1-32 char", function (done) {
        var FailureDescription = { "FailureDescription": 'ClientRequestReferenceId should be 1-32 char' };

        trackingsubscriptionsHandlerObj.validateParameters(fakeData.TrackingSubscriptionRequest.ClientId, "90648AB95D00487EBE6482972FC73BFB90648AB95D00487EBE6482972FC73BFB", fakeData.TrackingSubscriptionRequest.PackageDetails)
            .then(function (data) {
                expect(data).toEqual(jasmine.objectContaining(FailureDescription));
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("PackageDetails is required", function (done) {
        var FailureDescription = { "FailureDescription": 'PackageDetails is required' };

        trackingsubscriptionsHandlerObj.validateParameters(fakeData.TrackingSubscriptionRequest.ClientId, fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, undefined)
            .then(function (data) {
                expect(data).toEqual(jasmine.objectContaining(FailureDescription));
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("Unauthorized access", function (done) {
        var FailureDescription = { "FailureDescription": 'Unauthorized access' };

        trackingsubscriptionsHandlerObj.validateParameters("5000", fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequest.PackageDetails)
            .then(function (data) {
                expect(data).toEqual(jasmine.objectContaining(FailureDescription));
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("Validate Packages", function (done) {
        trackingsubscriptionsHandlerObj.validateParameters(fakeData.TrackingSubscriptionRequestInvalidPckg.ClientId, fakeData.TrackingSubscriptionRequestInvalidPckg.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequestInvalidPckg.PackageDetails)
            .then(function (data) {
                expect(data).toEqual(jasmine.objectContaining(fakeData.ValidationFailureDescription));
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });
});

describe("Positive  testcase for trackingSubscriptionsRepository:getTrackingSubscriptions", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingSubscriptionsRepositoryObj = new trackingSubscriptionsRepository();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "getData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                var result = { rows: [] };
                resolve(result);
            });
        });
    });

    it("spies and fakes on getTrackingSubscriptions", function (done) {
        trackingSubscriptionsRepositoryObj.getTrackingSubscriptions(fakeData.TrackingSubscriptionRequestForRepositoryTest.ClientId, fakeData.TrackingSubscriptionRequestForRepositoryTest.PackageDetails[0])
            .then(function (data) {
                expect(data.data.length).toEqual(0);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Exception from trackingSubscriptionsRepository:getTrackingSubscriptions", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingsubscriptionsHandlerObj = new trackingsubscriptionsHandler();

    beforeEach(function () {
        spyOn(trackingSubscriptionsRepository.prototype, "getTrackingSubscriptions").and.callFake(function (ClientId, PackageDetail) {
            return new Promise(function (resolve, reject) {
                var params = {};
                params.ClientId = ClientId;
                params.SiteId = PackageDetail.SiteId;
                params.OrderId = PackageDetail.OrderId;
                params.CarrierId = PackageDetail.CarrierId;
                params.TrackingId = PackageDetail.TrackingId;
                params.ShippingDateTime = PackageDetail.ShippingDateTime;

                var errResult = {};
                var err = {
                    message: "Test Exception"
                };
                errResult.err = err;
                errResult.data = params;
                reject(errResult);
            });
        });

        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });
    });

    it("spies and fakes on tracking subscription Orders", function (done) {
        trackingsubscriptionsHandlerObj.setTrackingSubscriptions(fakeData.TrackingSubscriptionRequestForRepositoryTest.ClientId, fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequestForRepositoryTest.PackageDetails)
            .then(function (data) {
                expect(data).toBe(false);
                done();
            })
            .catch(function (err) {
                expect(err.ClientId).toEqual(fakeData.TrackingSubscriptionRequestForRepositoryTest.ClientId);
                expect(err.ClientRequestReferenceId).toEqual(fakeData.TrackingSubscriptionRequestForRepositoryTest.ClientRequestReferenceId);
                expect(err.ResultCode).toEqual(1);
                done();
            });
    });

});

describe("Exception from trackingSubscriptionsRepository:addTrackingSubscriptions", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingsubscriptionsHandlerObj = new trackingsubscriptionsHandler();

    beforeEach(function () {
        spyOn(trackingSubscriptionsRepository.prototype, "addTrackingSubscriptions").and.callFake(function (ClientId, PackageDetail) {
            return new Promise(function (resolve, reject) {
                var params = {};
                params.ClientId = ClientId;
                params.SiteId = PackageDetail.SiteId;
                params.OrderId = PackageDetail.OrderId;
                params.CarrierId = PackageDetail.CarrierId;
                params.TrackingId = PackageDetail.TrackingId;
                params.ShippingDateTime = PackageDetail.ShippingDateTime;

                var errResult = {};
                var err = {
                    message: "Test Exception"
                };
                errResult.err = err;
                errResult.data = params;
                reject(errResult);
            });
        });

        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });
    });

    it("spies and fakes on tracking subscription Orders", function (done) {
        trackingsubscriptionsHandlerObj.setTrackingSubscriptions(fakeData.TrackingSubscriptionRequestForRepositoryTest.ClientId, fakeData.TrackingSubscriptionRequest.ClientRequestReferenceId, fakeData.TrackingSubscriptionRequestForRepositoryTest.PackageDetails)
            .then(function (data) {
                expect(data).toBe(false);
                done();
            })
            .catch(function (err) {
                expect(err.ClientId).toEqual(fakeData.TrackingSubscriptionRequestForRepositoryTest.ClientId);
                expect(err.ClientRequestReferenceId).toEqual(fakeData.TrackingSubscriptionRequestForRepositoryTest.ClientRequestReferenceId);
                expect(err.ResultCode).toEqual(1);
                done();
            });
    });

});