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
                    let suborderId = metadata.suborderId;
                    let newSuborder;
                    var suborderrepository = new repository();

                    if (context.hasOwnProperty("isBackorder") && context.isBackorder == true) {
                        if (context.hasOwnProperty("suborder")) {
                            newSuborder = context.suborder;
                        } else {
                            let projection = {};
                            let query = {
                                suborderId: metadata.suborderId
                            };                            
                            return new Promise(function (resolve, reject) {
                                suborderrepository.getSuborders(query, projection).then((result) => {
                                    let suborder = result;
                                    let lineItems = [];
                                    for (let suborderLineItem of suborder.lineItems) {
                                        let flag = suborderLineItem.flags;
                                        // not a discontinued / invalid item(s) or successful soft allocate
                                        if (flag.isDiscontinued != true && (suborderLineItem.qtyOrdered != suborderLineItem.qtySoftallocated)) {
                                            let lineItem = {};
                                            lineItem.qtyOrdered = suborderLineItem.qtyOrdered - suborderLineItem.qtySoftallocated;
                                            lineItem.qtySoftallocated = 0;
                                            lineItem.softallocatedDate = null;
                                            lineItems.push(lineItem);
                                        }
                                    }

                                    if (lineItems.length > 0) {
                                        newSuborder.status = "Backordered"; 
                                    } else {
                                        //All not shipped lineitems are discontinued                                        
                                        newSuborder = undefined;
                                    }
                                });
                            });
                        }

                        if (newSuborder != null && newSuborder != undefined) {
                            suborderrepository.getSubordersbyOrderId(newSuborder.orderId).then((suborders) => {
                                let maxSuborderId = Math.max.apply(Math, suborders.map(function (o) {
                                    return o.suborderId;
                                }));

                                //TODO: too high suborderid bail out
                                let soId = "0" + maxSuborderId;
                                let soIdLast2Digits = soId.slice(soId.length-2, soId.length);                     
                                if (++soIdLast2Digits >= 100) {
                                    let message = "Failed in Creating Suborder due to high suborder count: " + soIdLast2Digits.toString() + "  for orderId " + newSuborder.orderId;
                                    resourceLogger.error(message);
                                    let response = {};
                                    response.result = constants.results.Fail;
                                    response.errorMessage = message;
                                    resolve(response);
                                }
                                else {
                                    var helper = new lib();
                                    maxSuborderId += 1;
                                    newSuborder.suborderId = "0" + maxSuborderId;
                                    suborderrepository.createNewSuborder(newSuborder).then((result) => {
                                        if (result == "Success") {
                                            context.shouldAddBackOrderWF = true;
                                            var response = {};
                                            response.result = constants.results.Success;
                                            response.errorMessage = '';
                                            resolve(response);
                                        } else {
                                            let message = "Failed in Creating Suborder for SuborderId " + suborderId;
                                            resourceLogger.error(message);
                                            let response = {};
                                            response.result = constants.results.Fail;
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
                    response.result = constants.results.Fail;
                    response.errorMessage = message;
                    resolve(response);
                }
            } catch (exception) {
                let errorMessage = 'backorderHandler.execute(): reject ${JSON.stringify(exception)}';
                resourceLogger.error(errorMessage);
                let response = {};
                response.result = constants.results.Fail;
                response.errorMessage = errorMessage;
                resolve(response);
            }
        });
    }
}

module.exports = backorderHandler;