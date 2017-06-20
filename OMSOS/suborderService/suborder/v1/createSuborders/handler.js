var mongorepository = require('./../../../dataProviders/mongoRep');
var resourceLogger = require('./logger').logger;
var constants = require('./constants.js');
var moment = require('moment');
var _this;
var validateSchema = require('./../../../utils/validateSchema');
var createSuborderSchema = require('./createSuborderSchema.json');
var getNextSuborderSeq = require('./getNextSuborderSeq.js');

class handler {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
        _this = this;
    }

    execute() {
        resourceLogger.verbose('create handler called');
        return new Promise(function (resolve, reject) {
            try {
                console.log('Create handler');
                if (_this.metadata && _this.metadata[0].orderId) {
                    resourceLogger.verbose('handler executing for OrderId - ' + _this.metadata[0].orderId);
                    let context = _this.context;
                    let suborders = _this.metadata;
                    let projection = {};
                    let v = new validateSchema();
                    let validationErrors = '';
                    suborders.forEach(function (suborder) {
                        let validationError = v.validate(suborder, createSuborderSchema);
                        if (validationError != 'null')
                            validationErrors += validationError;
                    });
                    if (validationErrors.length > 0) {
                        return resolve({ result: constants.results.Failed, erorMessage: validationErrors })
                    }
                    /**
                     * Any business validation
                     */
                    getNextSuborderSeq.getNextSuborderIdByOrderId(_this.metadata[0].orderId).then((newSuborderId) => {
                        let now = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                        for (let suborder of suborders) {
                            let subId = newSuborderId++;  
                            suborder.suborderId = '0' + subId.toString();
                            suborder.createDate = now;                            
                            suborder.createdBy = (suborder.createdBy)?suborder.createdBy : "OAP"
                        }
                        let repository = new mongorepository();
                        repository.insertMany('suborders', suborders)
                            .then((result) => {
                                context.Suborders = suborders;
                                var response = {};
                                response.result = constants.results.Success;
                                response.errorMessage = '';
                                response.suborders = suborders;
                                resolve(response);
                            }).catch((err) => {
                                let message = `handler.execute(): reject ${JSON.stringify(err)}`;
                                resourceLogger.error(message);
                                var response = {};
                                response.result = constants.results.Failed;
                                response.errorMessage = message;
                                resolve(response);
                            });
                    });

                } else {
                    let message = "Message is null";
                    resourceLogger.error(message);
                    let response = {};
                    response.result = constants.results.ValidationFailed;
                    response.errorMessage = message;
                    resolve(response);
                }
            } catch (exception) {
                let message = `handler.execute(): reject ${JSON.stringify(exception)}`;
                resourceLogger.error(message);
                var response = {};
                response.result = constants.results.Failed;
                response.errorMessage = message;
                resolve(response);
            }
        });
    }
}

module.exports = handler;