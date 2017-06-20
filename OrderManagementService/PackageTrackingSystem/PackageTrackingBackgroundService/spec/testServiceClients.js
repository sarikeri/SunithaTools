var sinon = require('sinon');
var moment = require('moment');
var chai = require('chai');
var restClient = require('node-rest-client').Client;
var trackingDetailsClient = require("./../serviceClients/trackingDetailsClient");
var eventGeneratorClient = require("./../serviceClients/eventGeneratorClient");
var expect = chai.expect;
chai.config.includeStack = true;

// Creating sinon.stub of get method using node rest client's prototype does not work.
// https://github.com/aacerox/node-rest-client/issues/71

var restResponseMock = function (isSuccess, statusCode) {
    var resultCode = "1";
    if (isSuccess)
        resultCode = "0";
    var data = {
        ResultCode: resultCode, FailureDescription: "Mock error thrown by service", TrackResponse: { TrackSummary: { Status: "Success" }, TrackEvents: "Some event" }
    };
    return function (url, opts, cb) {
        cb(data, { statusCode: statusCode || 200, statusMessage: 'http error' });
        return {
            on: function () {
            }
        };
    }
}

describe('Test tracking detail client', function () {
    var detailsClient = new trackingDetailsClient();
    var restClient;
    var stubRestClient;
    beforeEach(function () {
        restClient = detailsClient.getRestClient();
    });

    it('Test for http 200 and Success flow', function () {
        stubRestClient = sinon.stub(restClient, 'get', restResponseMock(true, 200));
        return new Promise((resolve, reject) => {
            detailsClient.getTrackingDetails(1, 101, '12345', moment(), 'FedEx', 'ZXCV')
                .then((response) => {
                    expect(response.status).to.equal("Success");
                    expect(response.trackingData.TrackEvents).to.equal("Some event");
                    expect(response.trackingData.TrackSummary.Status).to.equal("Success");
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });

    it('Test for http 200 and Failure flow', function () {
        stubRestClient = sinon.stub(restClient, 'get', restResponseMock(false, 200));
        return new Promise((resolve, reject) => {
            detailsClient.getTrackingDetails(1, 101, '12345', moment(), 'FedEx', 'ZXCV')
                .then((response) => {
                    reject(`Failure flow entered success path`);
                })
                .catch((err) => {
                    expect(err).to.equal("Mock error thrown by service");
                    resolve();
                });
        });
    });

    it('Test for http 500', function () {
        stubRestClient = sinon.stub(restClient, 'get', restResponseMock(false, 500));
        return new Promise((resolve, reject) => {
            detailsClient.getTrackingDetails(1, 101, '12345', moment(), 'FedEx', 'ZXCV')
                .then((response) => {
                    reject(`Failure flow entered success path`);
                })
                .catch((err) => {
                    expect(err).to.equal("http status code 500; status message: http error");
                    resolve();
                });
        });
    });

    afterEach(function () {
        stubRestClient.restore();
    });
});

describe('Test event generator client', function () {
    var eventGenClient = new eventGeneratorClient();
    var restClient;
    var stubRestClient;
    beforeEach(function () {
        restClient = eventGenClient.getRestClient();
    });

    it('Test for http 200', function () {
        stubRestClient = sinon.stub(restClient, 'post', restResponseMock(true, 200));
        return new Promise((resolve, reject) => {
            eventGenClient.generateEvent(101, '12345', 'ZXCV', 'Delivered', 'ABCD', 500)
                .then((response) => {
                    expect(response).to.be.true;
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
            });
    });

    it('Test for http 200 and failure flow', function () {
        stubRestClient = sinon.stub(restClient, 'post', restResponseMock(false, 200));
        return new Promise((resolve, reject) => {
            eventGenClient.generateEvent(101, '12345', 'ZXCV', 'Delivered', 'ABCD', 500)
                .then((response) => {
                    reject(`Failure flow entered success path`);
                })
                .catch((err) => {
                    expect(err).to.equal("Mock error thrown by service");
                    resolve();
                });
        });
    });

    it('Test for http 500', function () {
        stubRestClient = sinon.stub(restClient, 'post', restResponseMock(false, 500));
        return new Promise((resolve, reject) => {
            eventGenClient.generateEvent(101, '12345', 'ZXCV', 'Delivered', 'ABCD', 500)
                .then((response) => {
                    reject(`Failure flow entered success path`);
                })
                .catch((err) => {
                    expect(err).to.equal("http status code 500; status message: http error");
                    resolve();
                });
        });
    });

    afterEach(function () {
        stubRestClient.restore();
    });
});
