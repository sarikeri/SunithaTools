let constants = require('./constants');
var moment = require('moment');
var resourceLogger = require('./logger').logger;

class lib {
    constructor() {};
    addToContext(taskName, context, result, errorMessage) {
        let curentDateTime = new moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        let response = {
            taskName,
            result,
            curentDateTime,
            errorMessage
        };

        switch (result) {
            case constants.results.Success:
            case constants.results.PartialSuccess:
                context.Success = response;
                break;
            case constants.results.Putaway:
            case constants.results.NoTaskFound:
            case constants.results.FailAndPutaway:
            case constants.results.Fail:
            case constants.results.ValidationFailed:
            case constants.results.UnknownError:
            case constants.results.UnableToAddWF:
                context.Errors.push(response);
        }
        return context;
    }

    removeLineItemFromSuborder(suborder, lineItemId) {
        for (var i = 0; i < suborder.suborderLineItems.length; i++) {
            if (suborder.suborderLineItems[i].lineItemId == lineItemId) {
                suborder.suborderLineItems.splice(i, 1);
                break;
            }
        }
        return suborder;
    }

    checkFlag(flag, value) {
        return flag & value ? true : false;
    }

    setFlag(flag, value) {
        return flag |= value;
    }

    removeFlag(flag, value) {
        return flag &= ~value;
    }

    RecalculateTaxAndTotal(order, suborder, backorderedSuborder, cancelSuborder) {

        // Pending discount calc


    }

    getNewSuborderUpdateDate(dcDefinition) {

        // Get from Database    
        let delayMinutes = 0;
        // DCTYPEFLAG_ENABLE_POD = 32 move to enum
        // DCTYPEFLAG_ENABLE_POB = 16
        let isPoEnabled = (dcDefinition.dcFlags & (32 | 16)) != 0;
        if (isPoEnabled) {
            delayMinutes = dcDefinition.poInventoryIdleMinutes;
        } else {
            delayMinutes = dcDefinition.backorderIdleMinutes;
        }

        suborderUpdateDate = moment().add(delayMinutes / 60.0 / 24.0, 'd');
    }

    getNewSuborderNextStatus(dcDefinition) {

        // Get from Database    
        let status = {};
        // SUBORDERSTAT_PENDING_PO_EVALUATION = 32 move to enum
        // SUBORDERSTAT_BACKORDERED = 3
        let isPoEnabled = (dcDefinition.dcFlags & (32 | 16)) != 0;
        if (isPoEnabled) {
            status = 32;
        } else {
            status = 3;
        }

        status = moment().add(delayMinutes / 60.0 / 24.0, 'd');
    }

    createNewSuborderHeader(order, suborder) {
        newSuborder = {};

        return newnewSuborder;

    }

    setSoftAllocateInfo(softAllocatedLineItems, suborderLineItems, softallocatedDate) {
        if (softAllocatedLineItems != null && softAllocatedLineItems != undefined) {
            for (let lineItem of softAllocatedLineItems) { 
                for (let suborderLineItem of suborderLineItems) {
                    if (lineItem.lineItemId == suborderLineItem.lineItemId) {
                        suborderLineItem.qtySoftallocated = lineItem.qtySoftallocated;
                        suborderLineItem.softallocatedDate = softallocatedDate;
                    }

                    // Add the flag here for Discontinued
                    if (lineItem.status == "2" || lineItem.status == "3") {
                        //setting actual suborder.lineitem flag as discontinued
                        suborderLineItem.flags.add({
                            isDiscontinued: true
                        });
                    }
                }
            }
        }

        return suborderLineItems;
    }

    getObjectLength(obj) {
        var length = 0;
        for (var p in obj) {

            //single lineitem check
            if(p == "lineItemId"){
                length = 1;
                break;                
            }
            
            if (obj.hasOwnProperty(p)) {
                length++;
            }
        }
        return length;
    }    
}

module.exports = lib;