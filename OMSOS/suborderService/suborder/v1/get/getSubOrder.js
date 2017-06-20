var mongorepository = require('./../../../dataProviders/mongoRep');
var resourceLogger = require('./logger').logger;
var moment = require('moment');

class getSubOrder {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
    }

    execute() {
        resourceLogger.verbose('Get suborders called with query: ' + this.metadata);
        var _this = this;
        return new Promise(function (resolve, reject) { 
            let query = _this.metadata;
            let projection = {};        
            let repository = new mongorepository();
            repository.find('suborders', query, projection)
                .then((suborders) => {
                    /*for(let suborder of suborders)
                    {               
                        suborder.shippedDate  = moment(suborder.shippedDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");                    
                        suborder.packages = suborder.packages.map( (eachPackage) => { 
                            eachPackage.estimatedArrivalDate = moment(eachPackage.estimatedArrivalDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                            return eachPackage;
                            });
                    }*/
                    resolve(suborders);
                })
                .catch((err) => {
                    let errorMessage = `shipHandler.execute(): reject ${JSON.stringify(err)}`; 
                    resourceLogger.error('Error: ' + errorMessage);
                    reject(errorMessage)
                });
        });
    }
}

module.exports = getSubOrder;