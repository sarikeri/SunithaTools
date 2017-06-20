var lib = require('./lib');
var _this;

class validator {
    constructor() {
        _this = this;
    }
    
    doBusinessValidation(message, suborder) {
        let softAllocatedLineItems = {};
        let validate = {};
        let isValid = true;
        let messages = [];
        let msg = {};       
        let helper = new lib();

        softAllocatedLineItems = message.lineItemInfo;

        if (message.softAllocateDateTime != null && message.softAllocateDateTime != undefined) {
            if (softAllocatedLineItems.length == 0) {
                isValid = false;
                msg = "doBusinessValidation: There are no line items for suborder '" + suborder.suborderId + "' in message body.";
                messages.push(msg);
            }
            else if (suborder.lineItems.length == 0) {
                isValid = false;
                msg = "doBusinessValidation: There are no line items in suborder '" + suborder.suborderId + "'.";
                messages.push(msg);
            }
            // else if(suborder.lineItems.length > softAllocatedLineItems.length){
            //     isValid = false;
            //     msg = "doBusinessValidation: There is a mismatch in number of lineitems in message body for suborder '" + suborder.suborderId + "'.";
            //     messages.push(msg);
            // }
            else if (softAllocatedLineItems.length > 0 && suborder.lineItems.length > 0) {
                var newSuborder = JSON.parse(JSON.stringify(suborder));
                // Build the new backordered suborder
                let lineItems = [];                
                for (let softAllocatedLineItem of softAllocatedLineItems) {
                    let lineItem = newSuborder.lineItems.find(o => o.lineItemId == softAllocatedLineItem.lineItemId);
                    if (lineItem != null && lineItem != undefined) {
                        // Only validate the lineItem if it is backordered / discontinued / invalid
                        if (softAllocatedLineItem.status == "1" ||
                            softAllocatedLineItem.status == "2" ||
                            softAllocatedLineItem.status == "3") {

                            if (softAllocatedLineItem.qtySoftallocated >= lineItem.qtyOrdered) {

                                isValid = false;
                                msg = "doBusinessValidation: soft allocate quantity (" + softAllocatedLineItem.qtySoftallocated + ") >= ordered quantity (" + lineItem.qtyOrdered + ") for " + softAllocatedLineItem.status + " lineitem: " + softAllocatedLineItem.lineItemId + " and suborder'" + suborder.suborderId + "'.; ";
                                messages.push(msg);
                            }

                            if (softAllocatedLineItem.qtySoftallocated <= 0) {
                                isValid = false;
                                msg = "doBusinessValidation: negative soft allocate quantity " + softAllocatedLineItem.qtySoftallocated + " for " + softAllocatedLineItem.status + " lineitem: " + softAllocatedLineItem.lineItemId + " and suborder '" + suborder.suborderId + "'.; ";
                                messages.push(msg);
                            }
                        }
                    }
                }
            }
        }
        else {
            isValid = false;
            msg = "doBusinessValidation: There is no softAllocateDateTime for suborder '" + suborder.suborderId + "'.";
            messages.push(msg);
        }
        
        validate.isValid = isValid;
        if (isValid == false) {
            if (messages.length > 0) {
                validate.message = JSON.stringify(messages).replace(new RegExp(/[ { } "\[\]']/, 'g'), " ");
            }
        }
        return validate;
    }

    validateSuborderStatus(suborderId, status) {
        let validate = {};
        validate.isValid = true;
        if (status == 'CancelPending') {

            validate.isValid = false;
            validate.message = "validateSuborderStatus: '" + status + "' for suborder'" + suborderId + "'.";
        }

        if (status == 'Cancelled') {
            validate.isValid = false;
            validate.message = "validateSuborderStatus: Suborder '" + suborderId + "' is '" + status + "' already.";
        }

        return validate;
    }

    validateDuplicateMsg(msgInput, msgDb, suborderStatusId) { //not needed
        let validate = {};
        validate.isValid = true;
        let messages = [];
        let msg = {};
        //method to compare message bodies
        var msgInputUpper = msgInput.trim().toUpperCase();
        var msgDbUpper = msgDb.trim().toUpperCase();

        if (new String(msgInputUpper).valueOf() == new String("").valueOf()) {
            isValid = false;
            msg = "Invalid status: " + suborderStatusId + ", for Suborder: '" + msgInput.keyValue + "'.";
            messages.push(msg);
        } 
        else if (new String(msgInputUpper).valueOf() == new String(msgDbUpper).valueOf()) {
            isValid = false;
            msg = "Duplicate Message for suborder: '" + msgInput.keyValue + "', status " + suborderStatusId + ".";
            messages.push(msg);
        }
        
        validate.isValid = isValid;
        if (isValid == false) {
            if (messages.length > 0) {
                validate.message = JSON.stringify(messages).replace(new RegExp(/[ { } "\[\]']/, 'g'), " ");
            }
        }
        return validate;
    }    
}

module.exports = validator;