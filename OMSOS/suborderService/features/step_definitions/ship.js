var { defineSupportCode } = require('cucumber');
defineSupportCode(function ({ Given, When, Then }) {
    const assert = require('chai').assert;
    const suborderRepository = require('../support/suborderRepository');
    const shipHandler = require('../../suborder/v1/ship/shipHandler');
    const masterHandler = require('../../suborder/v1/ship/master');
    suborderSingleLi = require('../support/Ship/suborderSingleLi');
    shipSingleLiRequest = require('../support/Ship/shipSingleLiRequest');
    backorderSingleLiRequest = require('../support/Ship/backorderSingleLiRequest');

    let results = {
        Success: 0, Failed: 1, ValidationFailed: 2
    }

    Given(/^a order (.*) and suborder (.*) with single Li in status (.*) is created$/, function (orderId, suborderId, status) {
        return new Promise((resolve, reject) => {
            let suborderJson = JSON.parse(JSON.stringify(suborderSingleLi));
            suborderJson.suborderId = suborderId;
            suborderJson.orderId = orderId;
            suborderJson.status = status;
            return suborderRepository.insertSuborder(suborderJson).then((result) => {
                assert.equal(result, true);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    Given(/^a order (.*) and suborder (.*) with single Li qtySoftallocated (.*) and in status (.*) is created$/, function (orderId, suborderId, qtySoftallocated, status) {
        return new Promise((resolve, reject) => {
            let suborderJson = JSON.parse(JSON.stringify(suborderSingleLi));
            suborderJson.suborderId = suborderId;
            suborderJson.orderId = orderId;
            suborderJson.status = status;
            for (let lineItem of suborderJson.lineItems) {
                lineItem.qtySoftallocated = qtySoftallocated;
            }
            return suborderRepository.insertSuborder(suborderJson).then((result) => {
                assert.equal(result, true);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    When(/^the order (.*) and suborder (.*) is Shipped response status return should be success$/, function (orderId, suborderId) {
        return new Promise((resolve, reject) => {
            let context = {};
            let input = shipSingleLiRequest;
            input.suborderId = suborderId;
            let metadata = input;
            handler = new shipHandler(context, metadata);
            handler.execute().then((result) => {
                assert.equal(result.result, results.Success);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    When(/^suborder (.*) is Shipped, validate QtyShipped (.*), throw validation error if not match with qtySoftallocated$/, function (suborderId, qtyShipped) {
        return new Promise((resolve, reject) => {
            let context = {};            
            let input = shipSingleLiRequest;
            input.suborderId = suborderId;
            for (let inputPackageInfo of input.packageInfo) {
                for (let inputPackageLiInfo of inputPackageInfo.lineItemInfo) {
                    inputPackageLiInfo.qtyShipped = qtyShipped;
                }
            }
            let metadata = input;
            handler = new shipHandler(context, metadata);
            handler.execute().then((result) => {
                assert.equal(result.result, results.ValidationFailed);
                console.log(result.errorMessage);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    When(/^suborder (.*) is Shipped, throw validation error if TrackingNumber (.*) is missing$/, function (suborderId, trackingNumber) {
        return new Promise((resolve, reject) => {
            let context = {};
            let input = shipSingleLiRequest;
            input.suborderId = suborderId;
            for (let packageInfo of input.packageInfo) {
                packageInfo.trackingNumber = trackingNumber;
            }
            let metadata = input;
            handler = new shipHandler(context, metadata);
            handler.execute().then((result) => {
                assert.equal(result.result, results.ValidationFailed);
                console.log(result.errorMessage);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    When(/^suborder (.*) is Shipped, validate QtyNotShipped (.*), throw validation error if not match with qtySoftallocated$/, function (suborderId, qtyNotShipped) {
        return new Promise((resolve, reject) => {
            let context = {};            
            backorderSingleLiRequest.suborderId = suborderId;
            for (let lineItem of backorderSingleLiRequest.lineItemInfo) {
                lineItem.qtyNotShipped = qtyNotShipped;
            }
            let metadata = backorderSingleLiRequest;
            handler = new shipHandler(context, metadata);
            handler.execute().then((result) => {
                assert.equal(result.result, results.ValidationFailed);
                console.log(result.errorMessage);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    When(/^the order (.*) and suborder (.*) is backordered response status return should be success$/, function (orderId, suborderId) {
        return new Promise((resolve, reject) => {
            let context = {};
            backorderSingleLiRequest.orderId = orderId;
            backorderSingleLiRequest.suborderId = suborderId;
            let metadata = backorderSingleLiRequest;
            handler = new masterHandler(context, metadata);
            handler.execute().then((result) => {
                assert.equal(result.result, results.Failed);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    Then(/^expected Status for suborder (.*) should be (.*)$/, function (suborderId, status) {
        return new Promise((resolve, reject) => {
            //validate Suborder status
            return suborderRepository.get(suborderId).then((suborder) => {
                assert.equal(suborder.status, status, `Suborder Status ${suborder.status} is not equal to ${status}`);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    Then(/^suborder (.*) shipping info is updated in DB$/, function (suborderId) {
        return new Promise((resolve, reject) => {
            //validate Suborder status
            return suborderRepository.get(suborderId).then((suborder) => {
                assert.equal(suborder.trackingInfo, shipSingleLiRequest.trackingNumber, `DB saved trackingNumber ${suborder.trackingInfo} is not equal to ${shipSingleLiRequest.trackingNumber}`);
                assert.equal(suborder.carrierId, shipSingleLiRequest.carrierId, `DB saved carrierId ${suborder.carrierId} is not equal to ${shipSingleLiRequest.carrierId}`);
                assert.equal(suborder.actualShippingCost, shipSingleLiRequest.actualShipCost * 100, `DB saved actualShipCost ${suborder.actualShippingCost} is not equal to ${shipSingleLiRequest.actualShipCost}`);
                assert.equal(suborder.numOfBoxesShipped, shipSingleLiRequest.numOfBoxesShipped, `DB saved numOfBoxesShipped ${suborder.numOfBoxesShipped} is not equal to ${shipSingleLiRequest.numOfBoxesShipped}`);
                assert.equal(suborder.shippedDate, shipSingleLiRequest.shippedDate, `DB saved shippedDate ${suborder.shippedDate} is not equal to ${shipSingleLiRequest.shippedDate}`);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    Then(/^suborder (.*) Package info is updated in DB$/, function (suborderId) {
        return new Promise((resolve, reject) => {
            //validate Suborder status
            return suborderRepository.get(suborderId).then((suborder) => {
                for (let inputPackageInfo of shipSingleLiRequest.packageInfo) {
                    let suborderPackageInfo = suborder.packages.find(o => o.packageId == inputPackageInfo.packageId);
                    assert.equal(suborderPackageInfo.trackingNumber, inputPackageInfo.trackingNumber, `DB saved trackingNumber ${suborderPackageInfo.trackingNumber} is not equal to ${inputPackageInfo.trackingNumber}`);
                    assert.equal(suborderPackageInfo.weight, inputPackageInfo.weight, `DB saved weight ${suborderPackageInfo.weight} is not equal to ${inputPackageInfo.weight}`);
                    assert.equal(suborderPackageInfo.shipCost, inputPackageInfo.shipCost * 100, `DB saved shipCost ${suborderPackageInfo.shipCost} is not equal to ${inputPackageInfo.shipCost}`);

                    for (let inputPackageLiInfo of inputPackageInfo.lineItemInfo) {
                        let suborderPackageLiInfo = suborderPackageInfo.lineItems.find(o => o.lineItemId == inputPackageLiInfo.lineItemId);
                        assert.equal(suborderPackageLiInfo.qty, inputPackageLiInfo.qtyShipped, `DB saved qtyShipped ${suborderPackageLiInfo.qty} is not equal to ${inputPackageLiInfo.qtyShipped}`);
                        assert.equal(suborderPackageLiInfo.unitCost, inputPackageLiInfo.unitCost * 100, `DB saved unitCost ${suborderPackageLiInfo.unitCost} is not equal to ${inputPackageLiInfo.unitCost}`);
                    }

                    resolve();
                }
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });

    Then(/^remove shipped suborder (.*) from DB$/, function (suborderId) {
        return new Promise((resolve, reject) => {
            return suborderRepository.remove(suborderId).then((status) => {
                assert.equal(status, true);
                resolve();
            });
        }).catch(function (err) {
            console.log(err);
            status = false;
            assert.isTrue(status);
            resolve();
        });
    });


})