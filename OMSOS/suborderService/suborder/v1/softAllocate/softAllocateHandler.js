var xml2js = require('xml2js');
var moment = require('moment');
var repository = require('./repository/suborder');
var validator = require('./validator');
var lib = require('./lib');
let constants = require('./constants');
var resourceLogger = require('./logger').logger;
var _this;

class softAllocateHandler {

    constructor(ctx, metadata) {
        this.Context = ctx;
        this.Metadata = metadata;
        _this = this;
    }
    execute() {
        return new Promise(function (resolve, reject) {
            let metadata = _this.Metadata;
            let context = _this.Context;
            resourceLogger.verbose('Executing softAllocateHandler for suborderid - ' + metadata.suborderId);
            var validate = new validator();
            context.shouldAddBackOrderWF = false;
            context.shouldAddCloseOrderWF = false;
            context.shouldAddShipReqWF = false;
            
            try {
                //Check if actual data is sent to API
                if (metadata != null && metadata != undefined) {
                    let projection = {};
                    let query = {
                        suborderId: metadata.suborderId
                    };
                    var suborderrepository = new repository();
                    suborderrepository.getSuborders(query, projection).then((result) => {
                        let suborder = result;                        
                        let message = metadata.Message;
                        var helper = new lib();
                        if (suborder != null && suborder != undefined) {
                            // This will validate for suborder status
                            resourceLogger.verbose('softAllocateHandler.validateSuborderStatus suborderid - ' + metadata.suborderId);
                            let valid = validate.validateSuborderStatus(metadata.suborderId, suborder.status);

                            var helper = new lib();
                            if (!valid.isValid) {
                                resourceLogger.error(valid.message);
                                let response = {};
                                response.result = constants.results.ValidationFailed;
                                response.errorMessage = valid.message;
                                return resolve(response);
                            }

                            resourceLogger.verbose('softAllocateHandler.doBusinessValidation suborderid - ' + metadata.suborderId);
                            valid = validate.doBusinessValidation(message, suborder);

                            if (!valid.isValid) {
                                resourceLogger.error(valid.message);
                                let response = {};
                                response.result = constants.results.ValidationFailed;
                                response.errorMessage = valid.message;
                                return resolve(response);
                            }

                            let locationId = message.dcId;
                            let softAllocatedLineItems = message.lineItemInfo; 
                            let softallocatedDate = message.softAllocateDateTime; 
                            let newBackorder;
                            let isBackorder = false;
                            if (softAllocatedLineItems != null && softAllocatedLineItems != undefined) {
                                newBackorder = JSON.parse(JSON.stringify(suborder));
                                if (softAllocatedLineItems.length > 0) {
                                    // Build the new backordered suborder
                                    if (softAllocatedLineItems != null && softAllocatedLineItems != undefined) {
                                        let lineItems = [];
                                        for (let softAllocatedLineItem of softAllocatedLineItems) {
                                            // Only add the lineItem if it is backordered
                                            if (softAllocatedLineItem.status == "1") {
                                                let backorderLineItem = newBackorder.lineItems.find(o => o.lineItemId == softAllocatedLineItem.lineItemId);
                                                if (backorderLineItem != null && backorderLineItem != undefined) {
                                                    backorderLineItem.qtyOrdered -= softAllocatedLineItem.qtySoftallocated;
                                                    backorderLineItem.qtySoftallocated = 0;
                                                    backorderLineItem.softallocatedDate = softallocatedDate;
                                                    lineItems.push(backorderLineItem);
                                                }
                                            }
                                        }

                                        // if the partially/un shipped lineItems are there, then build backorder object
                                        if (lineItems.length > 0) {
                                            newBackorder.lineItems = lineItems;
                                            newBackorder.status = "Backordered"; 
                                            newBackorder.updateBy = "SoftAllocate Response Handler";
                                            newBackorder.updateDate = new moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");                                           
                                            isBackorder = true;
                                        } else {
                                            newBackorder = undefined;
                                        }
                                    }
                                }
                            }

                            // Update the suborder shipment information (partial or full and discontinued items)  message.PackageInfo                    
                            suborder.lineItems = helper.setSoftAllocateInfo(softAllocatedLineItems, suborder.lineItems, softallocatedDate);
                            let sliCount = suborder.lineItems.length;
                            let liSuccessCount = 0;
                            let liBOCount = 0;
                            let liDiscInvalidCount = 0;

                            if (softAllocatedLineItems != null && softAllocatedLineItems != undefined) {
                                for (let softAllocatedLineItem of softAllocatedLineItems) {
                                    switch(softAllocatedLineItem.status)
                                    {
                                        case "0": 
                                            liSuccessCount++;
                                            break;
                                        case "1":
                                            liBOCount++;
                                            break;
                                        case "2":
                                        case "3":
                                            liDiscInvalidCount++;
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }                            
                            
                            if (liSuccessCount >= 1) { //if any li is soft allocated successfully
                                suborder.status = "SoftAllocated"; // TODO: Need to confirm suborder status
                                suborder.updateBy = "SoftAllocateHandler";
                                suborder.updateDate = new moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                                context.shouldAddShipReqWF = true;
                            } else if(sliCount == liBOCount) { //complete back order
                                //in this case whole order is deleted and a new suborder is created
                                suborder.status = "Deleted";
                                suborder.updateBy = "SoftAllocateHandler";
                                suborder.updateDate = new moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                            }

                            // Update Suborder 
                            suborderrepository.updateSuborder(suborder).then((result) => {
                                if (result == "Success") {
                                    if (isBackorder) {
                                        context.suborder = newBackorder;
                                        context.shouldAddBackOrderWF = true;
                                    } else if(sliCount == liDiscInvalidCount) {
                                        context.shouldAddCloseOrderWF = true; 
                                        //If all items are invalid / discontinued then entire suborder will be cancelled. 
                                        //IMP NOTE: shouldAddCloseOrderWF (order.MaybeClose) has to make sure no open suborders and all are cancelled (cli == 0)
                                    }
                                    context.isBackorder = isBackorder;
                                    var response = {};
                                    response.result = constants.results.Success;
                                    response.errorMessage = '';
                                    resolve(response);
                                } else {
                                    let message = "Failed in updating Suborder for SuborderId " + metadata.suborderId;
                                    resourceLogger.error(message);
                                    let response = {};
                                    response.result = constants.results.Fail;
                                    response.errorMessage = message;
                                    return resolve(response);
                                }
                            })

                        }
                        else {

                            let message = "Unable to find the suborderId = " + metadata.suborderId;
                            resourceLogger.error(message);
                            let response = {};
                            response.result = constants.results.Fail;
                            response.errorMessage = message;
                            return resolve(response);
                        }
                    }).catch(function (err) {
                        let errorMessage = 'softAllocateHandler.execute(): reject ${JSON.stringify(exception)}';
                        resourceLogger.error(errorMessage);
                        let response = {};
                        response.result = constants.results.Fail;
                        response.errorMessage = errorMessage;
                        return resolve(response);
                    });
                } else {
                    let message = "Message is null";
                    resourceLogger.error(message);
                    let response = {};
                    response.result = constants.results.Fail;
                    response.errorMessage = message;
                    return resolve(response);;
                }
            } catch (exception) {                
                let errorMessage = 'softAllocateHandler.execute(): reject ${JSON.stringify(exception)}';
                resourceLogger.error(errorMessage);
                let response = {};
                response.result = constants.results.Fail;
                response.errorMessage = errorMessage;
                return resolve(response);;
            }
        });
    }
}

module.exports = softAllocateHandler;