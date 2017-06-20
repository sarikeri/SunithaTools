var xml2js = require('xml2js');
var moment = require('moment');
var repository = require('./repository/suborder');
var validator = require('./validator');
var lib = require('./lib');
let constants = require('./constants');
var resourceLogger = require('./logger').logger;
var _this;

class shipHandler {

    constructor(ctx, metadata) {
        this.Context = ctx;
        this.Metadata = metadata;
        _this = this;
    }
    execute() {
        return new Promise(function (resolve, reject) {

            let metadata = _this.Metadata;
            let context = _this.Context;
            resourceLogger.verbose(`shipHandler.execute:Executing shipHandler for SuborderId = ${metadata.suborderId}`);
            var validate = new validator();
            context.shouldAddBackOrderWF = false;
            context.shouldAddCloseOrderWF = false;
            context.SuborderEvent = { status: false, Event: undefined };

            try {
                //Check if actual data is sent to API
                if (metadata != null && metadata != undefined) {
                    let projection = {};
                    let query = {
                        suborderId: metadata.suborderId
                    };
                    var suborderrepository = new repository();
                    resourceLogger.verbose(`shipHandler.execute:Calling shipHandler.getSuborders for SuborderId = ${metadata.suborderId}`);
                    suborderrepository.getSuborders(query, projection).then((result) => {
                        let suborder = result;
                        let message = metadata;
                        var helper = new lib();
                        if (suborder != null && suborder != undefined) {
                            resourceLogger.verbose(`shipHandler.execute:suborderId = ${metadata.suborderId} is present in database`);
                            // This will validate all package & lineitems
                            resourceLogger.verbose(`shipHandler.execute:Calling doBusinessValidation for SuborderId = ${metadata.suborderId}`);
                            let valid = validate.doBusinessValidation(message, suborder);

                            var helper = new lib();
                            if (!valid.isValid) {
                                resourceLogger.error(`shipHandler.execute: doBusinessValidation failed for suborderId = ${metadata.suborderId} with errormessage = ${valid.message}`);
                                let response = {};
                                response.result = constants.results.ValidationFailed;
                                response.errorMessage = valid.message;
                                resolve(response);
                            }
                            else {
                                resourceLogger.info(`shipHandler.execute: doBusinessValidation succeeded for suborderId = ${metadata.suborderId}`);
                                let locationId = message.dcId;
                                let shippingFailedLineItems = message.lineItemInfo;
                                let newBackorder;
                                let isBackorder = false;
                                if (shippingFailedLineItems != null && shippingFailedLineItems != undefined) {
                                    newBackorder = JSON.parse(JSON.stringify(suborder));
                                    if (shippingFailedLineItems.length > 0) {
                                        // Build the new backordered suborder
                                        if (shippingFailedLineItems != null && shippingFailedLineItems != undefined) {
                                            let lineItems = [];
                                            for (let shippingFailedLineItem of shippingFailedLineItems) {
                                                let backorderLineItem = newBackorder.lineItems.find(o => o.lineItemId == shippingFailedLineItem.lineItemId);
                                                // Don't add the lineItem if it is already discontinued
                                                if (shippingFailedLineItem.status != 2 && shippingFailedLineItem.status != 3) {
                                                    let suborderLineItem = suborder.lineItems.find(o => o.lineItemId == shippingFailedLineItem.lineItemId);
                                                    if (shippingFailedLineItem.qtyShipped != suborderLineItem.qtyOrdered) {
                                                        backorderLineItem.qtyOrdered = shippingFailedLineItem.qtyNotShipped;
                                                        backorderLineItem.qtySoftallocated = null;
                                                        backorderLineItem.softallocatedDate = null;
                                                        backorderLineItem.qtyShipped = null;
                                                        backorderLineItem.shippedDate = null;
                                                        lineItems.push(backorderLineItem);
                                                    }
                                                }
                                            }

                                            // if the partially/un shipped lineItems are there, then build backorder object
                                            if (lineItems.length > 0) {
                                                newBackorder.lineItems = lineItems;
                                                newBackorder.status = "Backordered";
                                                isBackorder = true;
                                                resourceLogger.info(`shipHandler.execute: Number of lineItems for new backorder = ${lineItems.length} from suborderId = ${metadata.suborderId}`);
                                            } else {
                                                resourceLogger.info(`shipHandler.execute: Number of lineItems for new backorder = ${lineItems.length} from suborderId = ${metadata.suborderId}`);
                                                newBackorder = undefined;
                                            }
                                        }
                                    }
                                }

                                // Update the suborder shipment information (partial or full and discontinued items)  message.packageInfo                    
                                suborder.lineItems = helper.setShipmentinfo(shippingFailedLineItems, suborder.lineItems, message.shippedDate);
                                if (message.packageInfo != null && message.packageInfo != undefined && message.packageInfo.length > 0) {
                                    resourceLogger.verbose(`shipHandler.execute: Setting Package info for suborderId = ${metadata.suborderId}`);
                                    suborder.status = "Shipped"; // Set to Shipped
                                    suborder.carrierId = message.carrierId;
                                    suborder.trackingInfo = message.trackingNumber;
                                    suborder.actualShippingCost = message.actualShipCost * 100;
                                    suborder.numOfBoxesShipped = message.numOfBoxesShipped;
                                    suborder.shippedDate = message.shippedDate;
                                    suborder.updateBy = "ShipHandler";
                                    suborder.updateDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                                    suborder.packages = helper.setPackageinformation(message.packageInfo, message.expectedArrivalDate);
                                    context.SuborderEvent.Event = constants.suborderEvents.Shipped;
                                } else if (newBackorder == null && newBackorder == undefined) {
                                    //in this case whole order is deleted and a new suborder is created
                                    suborder.status = "Cancelled";
                                    context.SuborderEvent.Event = constants.suborderEvents.Closed;
                                    resourceLogger.info(`shipHandler.execute: Setting suborder status to Cancelled for suborderId = ${metadata.suborderId}`);
                                }
                                else {
                                    suborder.status = "Deleted";
                                    resourceLogger.info(`shipHandler.execute: Setting suborder status to Cancelled for suborderId = ${metadata.suborderId}`);
                                }

                                // Update Suborder 
                                resourceLogger.info(`shipHandler.execute: Calling suborderrepository.updateSuborder for suborderId = ${metadata.suborderId}`);
                                suborderrepository.updateSuborder(suborder).then((result) => {
                                    if (result == "Success") {
                                        if (isBackorder) {
                                            context.suborder = newBackorder;
                                            context.shouldAddBackOrderWF = true;
                                        } else {
                                            context.shouldAddCloseOrderWF = true;
                                            context.SuborderEvent.status = (suborder.status == 'Cancelled' ||
                                                suborder.status == 'Shipped') ? true : false;
                                        }
                                        context.isBackorder = isBackorder;
                                        var response = {};
                                        response.result = constants.results.Success;
                                        response.errorMessage = '';
                                        resourceLogger.info(`shipHandler.execute: context for suborderId = ${metadata.suborderId} is  ${JSON.stringify(context)}`);
                                        resolve(response);
                                    } else {
                                        let message = `shipHandler: Failed in updating Suborder for SuborderId = ${metadata.suborderId}`;
                                        resourceLogger.error(message);
                                        let response = {};
                                        response.result = constants.results.Failed;
                                        response.errorMessage = message;
                                        resolve(response);
                                    }
                                })
                            }
                        }
                        else {
                            let message = `shipHandler: Unable to find the suborderId = ${metadata.suborderId}`;
                            resourceLogger.error(message);
                            let response = {};
                            response.result = constants.results.ValidationFailed;
                            response.errorMessage = message;
                            resolve(response);
                        }
                    }).catch(function (exception) {
                        let errorMessage = `shipHandler: execute(): reject = ${JSON.stringify(exception.message)}`;
                        resourceLogger.error(errorMessage);
                        let response = {};
                        response.result = constants.results.Failed;
                        response.errorMessage = errorMessage;
                        resolve(response);
                    });
                } else {
                    let message = "shipHandler: Message is null";
                    resourceLogger.error(message);
                    let response = {};
                    response.result = constants.results.ValidationFailed;
                    response.errorMessage = message;
                    resolve(response);;
                }
            } catch (exception) {
                let errorMessage = `shipHandler: shipHandler.execute(): reject ${JSON.stringify(exception.message)}`;
                resourceLogger.error(errorMessage);
                let response = {};
                response.result = constants.results.Failed;
                response.errorMessage = errorMessage;
                resolve(response);;
            }
        });
    }
}




module.exports = shipHandler;