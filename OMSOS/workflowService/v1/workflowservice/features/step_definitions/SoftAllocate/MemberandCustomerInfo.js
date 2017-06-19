/**
 * 
 */
var softAllocationHandler = require('../../../services/SoftAllocate/v1/SoftAllocateRequest/softAllocationHandler.js');
var orderDocument = require('./fakedata/orderDocumentFake.js');
var suborderDocument = require('./fakedata/suborderDocumentFake.js');
var { defineSupportCode } = require('cucumber');


defineSupportCode(function ({ Given, When, Then }) {
    var self = this;
    var msgBody;
this.expect = require('chai').expect;
    Given('the input order document with valid member info', function () {
        var context = {};
        context.orderDetail = orderDocument.OrderDetails;
        context.suborderDetail = suborderDocument.suborderDetails;
        context.suborders = [];
        var metadata = {};
        metadata.orderId = orderDocument.OrderDetails.orderId;
        metadata.suborderId = suborderDocument.suborderDetails.suborderId;
        self.softAllocationHandler = new softAllocationHandler(context, metadata);
        return;
    });

    When('the softAllocationHandler is executed', function () {
        //self.result = self.softAllocationHandler.execute();
        self.result = self.softAllocationHandler.execute();
        result.then(function (data) {
            msgBody = self.softAllocationHandler.Context.SoftAllocateMsgBody;
            console.log(msgBody);
            self.expect(msgBody).to.not.equal(null);
             return;
        }).catch(function (err) {
            console.log('Exception:' + err)
            self.expect(true).to.equal(false);
        });
    });

    Then('the member info in xml should not be null', function () {
        self.expect(msgBody.indexOf('<MemberID>a0b58c29a4a14a54aea22e3bfd0dbac2</MemberID>')).to.not.equal(-1);
        self.expect(msgBody.indexOf('<ShipName>Albert Einstein</ShipName>')).to.not.equal(-1);          
        return;
    });
});
