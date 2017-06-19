var { defineSupportCode } = require('cucumber');
defineSupportCode(function ({ Given, When, Then }) {
    const assert = require('chai').assert;
    const suborderRepository = require('../support/suborderRepository');
    const master = require('../../suborder/v1/createSuborders/master');
    const suborder = require('../support/create/newSuborder.json')
    ///// Your step definitions /////
    //Given(/^a suborder (.*) in status (.*)$/, function (suborderId, status) {
    // use 'Given', 'When' and 'Then' to declare step definitions
    //
    let results = {
        Success: 0, Failed: 1, ValidationFailed: 2
    }

    Given(/^two new suborder object having order id (.*) and no suborder id$/, function (orderId) {
        return new Promise((resolve, reject) => {
            suborder.orderId = orderId;
            assert.equal(suborder.orderId, orderId);
            resolve();
        });
    });

    When(/^the suborders (.*) are created using create suborder service$/, function (suborders) {
        //Cancel suborder return suborderOP.get(suborderId).then((suborder) => {
        return new Promise((resolve, reject) => {
            let context = { Errors: [] };
            let metadata = [];
            let subArray = suborders.split(',');
            subArray.forEach((suborderId) => {
                //Create metadata body 
                let newSuborder = JSON.parse(JSON.stringify(suborder));
                metadata.push(newSuborder);
            });

            let createObj = new master(context, metadata);
            createObj.execute().then((result) => {
                assert.equal(result.result, results.Success);
                resolve();
            });
        });
    });

    Then(/^newly created suborders should get new suborder ids (.*)$/, function (suborders) {
        return new Promise((resolve, reject) => {
            //validate Suborder status
            let promises = [];
            let subArray = suborders.split(',');
            subArray.forEach((suborderId) => {
                promises.push(suborderRepository.get(suborderId));
            });

            let status = true;
            Promise.all(promises).then((subordersData) => {
                subArray.forEach((suborderId) => {
                    status = (subordersData.find(o => o.suborderId == suborderId)) ? status : false;
                });
                assert.isTrue(status);
                resolve();
            }, (err) => {
                status = false;
                assert.isTrue(status);
                resolve();
            });
        });
    });

    Then(/^remove suborders (.*)$/, function (suborders) {
        return new Promise((resolve, reject) => {
            //validate Suborder status
            let promises = [];
            let subArray = suborders.split(',');
            subArray.forEach((suborderId) => {
                promises.push(suborderRepository.remove(suborderId));
            });

            let status = true;
            Promise.all(promises).then((result) => {
                assert.isTrue(status);
                resolve();
            }, (err) => {
                status = false;
                assert.isTrue(status);
                resolve();
            });
        });
    });
})