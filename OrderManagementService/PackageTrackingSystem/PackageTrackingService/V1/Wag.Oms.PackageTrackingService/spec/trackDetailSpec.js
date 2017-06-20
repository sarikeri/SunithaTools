var trackingDetailHandler = require('../handlers/trackingDetailHandler.js');
var fakeData = require('./fakeDataSpec.js');
var dbAccess = require('../dalRepositories/dbAccess.js');
var trackingDetailRepository = require('../dalRepositories/trackingDetailRepository.js');
var clientConfigurationRepository = require('../dalRepositories/clientConfigurationRepository.js');
var carrierConfigurationRepository = require('../dalRepositories/carrierConfigurationRepository.js');
var request = require('request');
var fs = require('fs');
var uspsResponse = fs.readFileSync('spec\\USPSResponse.xml', 'utf8');
var fedexResponse = fs.readFileSync('spec\\FedExResponse.xml', 'utf8');
var ontracResponse = fs.readFileSync('spec\\OnTracResponse.xml', 'utf8');
var lasershipResponse = fs.readFileSync('spec\\LasershipResponse.xml', 'utf8');
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
describe("Positive  testcase for trackingDetailHandler:getTrackingStatus for Order from FedEx no data in DB", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });

        spyOn(trackingDetailRepository.prototype, "getTrackingDetail").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        });

        spyOn(request, "Request").and.callFake(function (params) {
            var res = {
                statusCode: 200
            }
            var body = fedexResponse;
            params.callback(null, res, body);
        });
    });

    it("spies and fakes on tracking Order", function (done) {
        trackingDetailHandlerObj.getTrackingStatus(fakeData.TrackingDetailRequest.ClientId, fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "FedEx", fakeData.TrackingDetailRequest.TrackingId, fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseFedEx));
                expect(data.ClientId).toEqual(fakeData.TrackingDetailResponseFedEx.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseFedEx.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseFedEx.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Positive  testcase for trackingDetailHandler:getTrackingStatus for Order from FedEx data available in DB", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });

        spyOn(trackingDetailRepository.prototype, "getTrackingDetail").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                fakeData.TrackingDetailDBResultFedEx[0].TRACKING_DATE = new Date();
                resolve(fakeData.TrackingDetailDBResultFedEx);
            });
        });
    });

    it("spies and fakes on tracking Order", function (done) {
        trackingDetailHandlerObj.getTrackingStatus(fakeData.TrackingDetailRequest.ClientId, fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "FedEx", fakeData.TrackingDetailRequest.TrackingId, fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseFedEx));
                expect(data.ClientId).toEqual(fakeData.TrackingDetailResponseFedEx.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseFedEx.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseFedEx.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("spies and fakes on tracking Order with different clientId", function (done) {
        trackingDetailHandlerObj.getTrackingStatus("0", fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "FedEx", fakeData.TrackingDetailRequest.TrackingId, fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseFedEx));
                expect(data.ClientId).toEqual("0");
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseFedEx.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseFedEx.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });
});

describe("Positive  testcase for trackingDetailHandler:getTrackingStatus for Order (InTransit) from FedEx data available in DB", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });

        spyOn(trackingDetailRepository.prototype, "getTrackingDetail").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                var trackingDate = new Date();
                trackingDate.setDate(trackingDate.getDate() - 1);
                fakeData.TrackingDetailDBResultFedEx[0].TRACKING_DATE = trackingDate;
                fakeData.TrackingDetailDBResultFedEx[0].TRACKING_STATUS = "InTransit";
                resolve(fakeData.TrackingDetailDBResultFedEx);
            });
        });

        spyOn(request, "Request").and.callFake(function (params) {
            var res = {
                statusCode: 200
            }
            var body = fedexResponse;
            params.callback(null, res, body);
        });
    });

    it("spies and fakes on tracking Order InTransit and wait time over", function (done) {
        trackingDetailHandlerObj.getTrackingStatus(fakeData.TrackingDetailRequest.ClientId, fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "FedEx", fakeData.TrackingDetailRequest.TrackingId, fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseFedEx));
                expect(data.ClientId).toEqual(fakeData.TrackingDetailResponseFedEx.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseFedEx.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseFedEx.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });
});

describe("Positive  testcase for trackingDetailHandler:getTrackingStatus for Order from Dummy #Mock no data in DB", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });

        spyOn(trackingDetailRepository.prototype, "getTrackingDetail").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        });
    });

    it("spies and fakes on tracking Order", function (done) {
        trackingDetailHandlerObj.getTrackingStatus(fakeData.TrackingDetailRequest.ClientId, fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "Dummy", fakeData.TrackingDetailRequest.TrackingId, fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseMock));
                expect(data.ClientId).toEqual(fakeData.TrackingDetailResponseMock.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseMock.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseMock.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Positive  testcase for trackingDetailHandler:getTrackingStatus for Order from USPS no data in DB", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });

        spyOn(trackingDetailRepository.prototype, "getTrackingDetail").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        });

        spyOn(request, "Request").and.callFake(function (params) {
            var res = {
                statusCode: 200
            }
            var body = uspsResponse;
            params.callback(null, res, body);
        });
    });

    it("spies and fakes on tracking Order", function (done) {
        trackingDetailHandlerObj.getTrackingStatus(fakeData.TrackingDetailRequest.ClientId, fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "USPS", "9205590100067736107480", fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseMock));
                expect(data.ClientId).toEqual(fakeData.TrackingDetailResponseMock.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseMock.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseMock.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Positive  testcase for trackingDetailHandler:getTrackingStatus for Order from OnTrac no data in DB", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });

        spyOn(trackingDetailRepository.prototype, "getTrackingDetail").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        });

        spyOn(request, "Request").and.callFake(function (params) {
            var res = {
                statusCode: 200
            }
            var body = ontracResponse;
            params.callback(null, res, body);
        });
    });

    it("spies and fakes on tracking Order", function (done) {
        trackingDetailHandlerObj.getTrackingStatus(fakeData.TrackingDetailRequest.ClientId, fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "OnTrac", "C11592300016575", fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseMock));
                expect(data.ClientId).toEqual(fakeData.TrackingDetailResponseMock.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseMock.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseMock.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Positive  testcase for trackingDetailHandler:getTrackingStatus for Order from Lasership no data in DB", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "addUpdateData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        });

        spyOn(trackingDetailRepository.prototype, "getTrackingDetail").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        });

        spyOn(request, "Request").and.callFake(function (params) {
            var res = {
                statusCode: 200
            }
            var body = lasershipResponse;
            params.callback(null, res, body);
        });
    });

    it("spies and fakes on tracking Order", function (done) {
        trackingDetailHandlerObj.getTrackingStatus(fakeData.TrackingDetailRequest.ClientId, fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "Lasership", "1LS713461451372", fakeData.TrackingDetailRequest.ClientRequestReferenceId)
            .then(function (data) {
                //expect(data).toEqual(jasmine.objectContaining(fakeData.TrackingDetailResponseMock));
                expect(data.ClientId).toEqual(fakeData.TrackingDetailResponseMock.ClientId);
                expect(data.ClientRequestReferenceId).toEqual(fakeData.TrackingDetailResponseMock.ClientRequestReferenceId);
                expect(data.ResultCode).toEqual(fakeData.TrackingDetailResponseMock.ResultCode);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});

describe("Validation  testcase for trackingDetailHandler:validateParameters for", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailHandlerObj = new trackingDetailHandler(),
        ClientId = "0", SiteId = "100", OrderId = "123456", ShippingDateTime = "1997-07-16T19:20:30.450+01:00",
        CarrierId = "FedEx", TrackingId = "784845844971", ClientRequestReferenceId = "90648AB95D00487EBE6482972FC73BFB";

    it("ClientId is required", function (done) {
        trackingDetailHandlerObj.validateParameters(undefined, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("ClientId is required");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("ClientId should be valid integer", function (done) {
        trackingDetailHandlerObj.validateParameters("a", SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("ClientId should be valid integer");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("Unauthorized access", function (done) {
        trackingDetailHandlerObj.validateParameters("5000", SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("Unauthorized access");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("SiteId is required", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, undefined, OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("SiteId is required");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("SiteId should be valid integer", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, "SiteId", OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("SiteId should be valid integer");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("SiteId Unauthorized access", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, "5000", OrderId, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("Unauthorized access");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("OrderId is required", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, undefined, ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("OrderId is required");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("OrderId should be of 1-32 char", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, "", ShippingDateTime, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("OrderId should be of 1-32 char");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("ShippingDateTime is required", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, undefined, CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("ShippingDateTime is required");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("ShippingDateTime should be valid date", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, "ShippingDateTime", CarrierId, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("ShippingDateTime should be valid date");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("TrackingId is required", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, undefined, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("TrackingId is required");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("TrackingId should be of 1-32 char", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, "", ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("TrackingId should be of 1-32 char");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("ClientRequestReferenceId should be 1-32 char", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, CarrierId, TrackingId, "")
            .then(function (data) {
                expect(data.message).toEqual("ClientRequestReferenceId should be 1-32 char");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("CarrierId is required", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, undefined, TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("CarrierId is required");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("CarrierId should be of 1-32 char", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, "", TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("CarrierId should be of 1-32 char");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

    it("Unauthorized access to carrier", function (done) {
        trackingDetailHandlerObj.validateParameters(ClientId, SiteId, OrderId, ShippingDateTime, "CarrierId", TrackingId, ClientRequestReferenceId)
            .then(function (data) {
                expect(data.message).toEqual("Unauthorized access to carrier");
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });
});

describe("Positive  testcase for trackingDetailRepository:getTrackingDetail", function () {
    beforeAll(function () {
        createPoolAliasSync();
    });
    var trackingDetailRepositoryObj = new trackingDetailRepository();

    beforeEach(function () {
        spyOn(dbAccess.prototype, "getData").and.callFake(function () {
            return new Promise(function (resolve, reject) {
                var result = { rows: [] };
                resolve(result);
            });
        });
    });

    it("spies and fakes on getTrackingDetail", function (done) {
        trackingDetailRepositoryObj.getTrackingDetail(fakeData.TrackingDetailRequest.SiteId, fakeData.TrackingDetailRequest.OrderId, fakeData.TrackingDetailRequest.ShippingDateTime, "FedEx", fakeData.TrackingDetailRequest.TrackingId)
            .then(function (data) {
                expect(data.length).toEqual(0);
                done();
            })
            .catch(function (err) {
                expect(err).toBe(false);
                done();
            });
    });

});