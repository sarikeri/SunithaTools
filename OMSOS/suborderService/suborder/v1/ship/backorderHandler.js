var xml2js = require('xml2js');
var moment = require('moment');
var repository = require('./repository/suborder');
var validator = require('./validator');
var lib = require('./lib');
var constants = require('./constants');
var suborderrepository = new repository();
var restClient = require('node-rest-client').Client;
var resourceConfig = require('./config');
var resourceLogger = require('./logger').logger;

var _this;

class backorderHandler {

    constructor(ctx, metadata) {
        this.Context = ctx;
        this.Metadata = metadata;
        this.client = new restClient();
        _this = this;
    }
    //This task only handles creating new backorder
    execute() {
        return new Promise(function (resolve, reject) {
            let context = _this.Context;
            let metadata = _this.Metadata;
            resourceLogger.verbose('Executing backorderHandler for suborderid - ' + metadata.suborderId);
            let message = metadata;
            try {
                //Check if actual data is sent to API
                if (metadata != null && metadata != undefined) {
                    let suborderId = metadata.SuborderId;
                    let newSuborder;
                    if (context.hasOwnProperty("isBackorder") && context.isBackorder == true) {
                        var suborderrepository = new repository();
                        if (context.hasOwnProperty("suborder")) {
                            newSuborder = context.suborder;
                        } else {
                            // This code is never going to execute as shipHandler is going build the 
                            // Suborder and set in context. But, keeping this code in case in future if 
                            // we want to move this to a separate API.
                            let projection = {};
                            let query = {
                                suborderId: metadata.suborderId
                            };

                            return new Promise(function (resolve, reject) {
                                suborderrepository.getSuborders(query, projection).then((result) => {
                                    let newSuborder = result;
                                    if (newSuborder != null && newSuborder != undefined) {
                                        let shippingFailedLineItems = newSuborder.lineItems;
                                        let lineItems = [];
                                        for (let suborderLineItem of newSuborder.lineItems) {
                                            let flag = suborderLineItem.flags;
                                            if (flag.isDiscontinued != true) {
                                                if (suborderLineItem.qtyShipped != suborderLineItem.qtyOrdered) {
                                                    let lineItem = {};
                                                    lineItem.qtyOrdered = suborderLineItem.qtySoftallocated - shippingFailedLineItem.qtyShipped;
                                                    lineItem.qtySoftallocated = null;
                                                    lineItem.softallocatedDate = null;
                                                    lineItem.qtyShipped = null;
                                                    lineItem.shippedDate = null;
                                                    lineItems.push(lineItem);
                                                }
                                            }
                                        }

                                        if (lineItems.length > 0) {
                                            newSuborder.lineItems = lineItems;
                                            newSuborder.status = "Backorder";
                                        } else {
                                            //All not shipped lineitems are discontinued                                        
                                            newSuborder = undefined;
                                        }
                                    }
                                });
                            });
                        }

                        if (newSuborder != null && newSuborder != undefined) {
                            // Check if we have already created Backorder for the same
                            let projection = {};
                            let query = {
                                parentId: metadata.suborderId
                            };
                            suborderrepository.getSuborders(query, projection).then((suborders) => {
                                if (suborders != null && suborders != undefined) {
                                    resourceLogger.warn(`backorderHandler.execute: not creating backorder as backorder already exists for suborder post split ${metadata.suborderId}`);
                                    context.shouldAddBackOrderWF = true;
                                    var response = {};
                                    response.result = constants.results.Success;
                                    response.errorMessage = '';
                                    resolve(response);
                                }
                                else {
                                    // Get the list of Backorders from DB to get the max suborderId
                                    let projection = {};
                                    let query = {
                                        orderId: metadata.orderId
                                    };
                                    suborderrepository.getSuborders(query, projection).then((suborders) => {
                                        if (suborders != null && suborders != undefined) {
                                            let maxSuborderId;
                                            if (suborders.length > 0) {
                                                maxSuborderId = Math.max.apply(Math, suborders.map(function (suborder) {
                                                    return suborder.suborderId;
                                                }));
                                            } else {
                                                maxSuborderId = suborders.suborderId;
                                            }

                                            var helper = new lib();
                                            //TODO: too high suborderid bail out
                                            newSuborder.suborderId = maxSuborderId + 1;
                                            newSuborder.parentId = metadata.suborderId;
                                            newSuborder._id = null;
                                            newSuborder.createBy = "ShipHandler";
                                            newSuborder.createDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                                            newSuborder.updateBy = null;
                                            newSuborder.updateDate = null;
                                            newSuborder.carrierId = null;
                                            newSuborder.trackingInfo = null;
                                            newSuborder.actualShippingCost = null;
                                            newSuborder.numOfBoxesShipped = null;
                                            newSuborder.shippedDate = null;
                                            newSuborder.package = null;
                                            suborderrepository.createNewSuborder(newSuborder).then((result) => {
                                                if (result == "Success") {
                                                    context.shouldAddBackOrderWF = true;
                                                    var response = {};
                                                    response.result = constants.results.Success;
                                                    response.errorMessage = '';
                                                    resolve(response);
                                                } else {
                                                    let message = `Failed in Creating Suborder for SuborderId = ${metadata.suborderId}`;
                                                    resourceLogger.error(message);
                                                    let response = {};
                                                    response.result = constants.results.Failed;
                                                    response.errorMessage = message;
                                                    resolve(response);
                                                }
                                            });
                                        }
                                        else {
                                            let message = `Failed in getting suborders for orderId = ${metadata.orderId} for SuborderId = ${metadata.suborderId}`;
                                            resourceLogger.error(message);
                                            let response = {};
                                            response.result = constants.results.Failed;
                                            response.errorMessage = message;
                                            resolve(response);
                                        }
                                    });
                                }
                            });
                        } else {
                            context.shouldAddBackOrderWF = false;
                        }
                    } else {
                        //Some issue with ship handler
                        context.shouldAddBackOrderWF = false;
                        let message = "No backorder to process for suborderId = " + suborderId;
                        resourceLogger.info(message);
                        let response = {};
                        response.result = constants.results.Success;
                        response.errorMessage = message;
                        resolve(response);
                    }
                } else {
                    context.shouldAddBackOrderWF = false;
                    context.shouldAddCloseOrderWF = false;
                    let message = "Message is null";
                    resourceLogger.error(message);
                    let response = {};
                    response.result = constants.results.ValidationFailed;
                    response.errorMessage = message;
                    resolve(response);
                }
            } catch (exception) {
                let errorMessage = `backorderHandler.execute(): reject ${JSON.stringify(exception.message)}`;
                resourceLogger.error(errorMessage);
                let response = {};
                response.result = constants.results.Failed;
                response.errorMessage = errorMessage;
                resolve(response);
            }
        });
    }

    removeTag(obj, tag) {       
        obj[tag] = null;
        delete obj[key];
        return obj;
    }

}




module.exports = backorderHandler;