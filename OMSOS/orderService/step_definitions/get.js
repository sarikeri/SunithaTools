var { defineSupportCode } = require('cucumber');
defineSupportCode(function ({ Given, When, Then }) {
    const assert = require('chai').assert;
    let resultCodes = {
        Success: 0, Failed: 1, ValidationFailed: 2
    }
    
    Given(/^two new suborder object having order id (.*) and no suborder id$/, function (orderId) {
        return new Promise((resolve, reject) => {
            suborder.orderId = orderId;
            assert.equal(suborder.orderId, orderId);
            resolve();
        });
    });
})