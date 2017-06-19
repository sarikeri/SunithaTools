var { defineSupportCode } = require('cucumber');
defineSupportCode(function ({ Given, When, Then }) {
  const assert = require('chai').assert;
  const suborderRepository = require('../support/suborderRepository')
  const cancelMaster = require('../../suborder/v1/cancel/master')
  ///// Your step definitions /////
  //Given(/^a suborder (.*) in status (.*)$/, function (suborderId, status) {
  // use 'Given', 'When' and 'Then' to declare step definitions
  //
  let results = {
    Success: 0, Failed: 1, ValidationFailed: 2
  }

  Given(/^a order (.*) having suborder (.*) in status (.*)$/, function (orderId, suborderId, status) {
    return new Promise((resolve, reject) => {
      return suborderRepository.insert(orderId, suborderId, status).then((result) => {
        assert.equal(result, true);
        resolve();
      });
    });
  });

  When(/^the suborder (.*) is cancelled using cancel suborder service$/, function (suborderId) {
    //Cancel suborder return suborderOP.get(suborderId).then((suborder) => {
    return new Promise((resolve, reject) => {
      let context = { Errors: [] };
      let metadata = [{ "suborderId": suborderId, "cancellationReason": "Cucumber cancellation", "cancelledBy": "Cucumber" }];
      cancelObj = new cancelMaster(context, metadata);
      cancelObj.execute().then((result) => {
        assert.equal(result.result, results.Failed);
        resolve();
      });
    });
  });

  Then(/^suborder (.*) status should move to (.*)$/, function (suborderId, status) {
    return new Promise((resolve, reject) => {
      //validate Suborder status
      return suborderRepository.get(suborderId).then((suborder) => {
        assert.equal(suborder.status, status);
        resolve();
      });
    });
  });

  Then(/^remove suborder (.*)$/, function (suborderId) {
    return new Promise((resolve, reject) => {
      //validate Suborder status
      return suborderRepository.remove(suborderId).then((status) => {
        assert.equal(status, true);
        resolve();
      });
    });
  });
})