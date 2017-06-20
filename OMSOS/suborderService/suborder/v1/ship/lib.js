let constants = require('./constants');
var moment = require('moment');
var resourceLogger = require('./logger').logger;

class lib {
    constructor() { };
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

    getShippingFailedLineItems(lineItemInfoArray) {
        let partialShippedLineItems = [];

        for (let lineItemInfo of lineItemInfoArray) {
            let lineItem = {};
            lineItem.lineItemId = lineItemInfo.lineItemId;
            lineItem.sku = lineItemInfo.sku;
            lineItem.upc = lineItemInfo.upc;
            lineItem.qtyShipped = lineItemInfo.qtyShipped;
            lineItem.qtyNotShipped = lineItemInfo.qtyNotShipped;
            lineItem.status = lineItemInfo.status;
            partialShippedLineItems.push(lineItem);
        }

        return partialShippedLineItems;
    }

    setPackageinformation(packageInfoArray, expectedArrivalDate) {
        let suborderPackages = [];
        if (packageInfoArray != null && packageInfoArray != undefined) {
            for (let packageInfo of packageInfoArray) {
                let suborderpackage = {};
                suborderpackage.packageId = packageInfo.packageId;
                suborderpackage.trackingNumber = packageInfo.trackingNumber;
                suborderpackage.weight = packageInfo.weight;
                suborderpackage.shipCost = packageInfo.shipCost * 100;
                suborderpackage.receivingBarcode = packageInfo.receivingBarcode;
                suborderpackage.expectedArrivalDate = '';

                if (expectedArrivalDate != null && expectedArrivalDate != undefined && expectedArrivalDate.length > 25 && expectedArrivalDate.hasOwnProperty("T")) {
                    suborderpackage.expectedArrivalDate = expectedArrivalDate;
                }

                let packagelineItemArray = packageInfo.lineItemInfo;
                suborderpackage.lineItems = [];
                if (packagelineItemArray != null && packagelineItemArray != undefined && packagelineItemArray.length > 0) {
                    for (let lineItem of packagelineItemArray) {
                        let packageLineItem = {};
                        packageLineItem.lineItemId = lineItem.lineItemId;
                        packageLineItem.qty = lineItem.qtyShipped;
                        packageLineItem.unitCost = lineItem.unitCost * 100;
                        packageLineItem.upc = lineItem.upc;
                        packageLineItem.upcCheckDigit = lineItem.upcCheckDigit;
                        packageLineItem.sku = lineItem.sku;
                        suborderpackage.lineItems.push(packageLineItem);
                    }
                }

                suborderPackages.push(suborderpackage);
            }
        }
        return suborderPackages;
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


    updateExistingSuborderLineItemQty(suborder, qtyNotShipped, lineItemId) {
        for (var i = 0; i < suborder.suborderLineItems.length; i++) {
            if (suborder.suborderLineItems[i].lineItemId == lineItemId) {
                suborder.suborderLineItems[i].qty = suborder.suborderLineItems[i].qty - qtyNotShipped;
                break;
            }
        }

        return suborder;
    }

    setShipmentinfo(shippingFailedLineItem, suborderLineItems, shippedDate) {
        if (shippingFailedLineItem != null && shippingFailedLineItem != undefined) {
            for (let lineItem of shippingFailedLineItem) {
                for (let suborderLineItem of suborderLineItems) {
                    if (lineItem.lineItemId == suborderLineItem.lineItemId) {
                        suborderLineItem.qtyShipped = lineItem.qtyShipped;
                        suborderLineItem.shippedDate = shippedDate;
                    }

                    // Add the flag here for Discontinued
                    if (lineItem.status == 2 || lineItem.status == 3) {
                        //setting actual suborder.lineitem flag as discontinued                        
                        suborderLineItem.flags.isDiscontinued = true;
                    }
                }
            }
        } else {
            // Everything got shipped            
        }

        return suborderLineItems;
    }

    getsuborderLineItem(lineItemId, suborderLineItems) {
        let suborderLineItem = {};
        for (let lineItem of suborderLineItem) {
            if (lineItem.lineItemId == lineItemId) {
                suborderLineItem = lineItem;
            }
        }

        return suborderLineItem;
    }
}

module.exports = lib;