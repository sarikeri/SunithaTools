var mongorepository = require('./../../../dataProviders/mongoRep');
var Logger = require('./logger.js');
var moment = require('moment');

class updateSuborder {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
    }

    execute() {
        console.log('Update SubOrder called');
        var _this = this;
        return new Promise(function (resolve, reject) {
            let repository = new mongorepository();
            repository.update('suborders', _this.metadata.query, _this.metadata.update)
                .then((data) => {
                    if(data.result.n > 0 && data.result.ok == 1 && data.result.nModified > 0)
                        resolve({status: 'Success'});
                    else if(data.result.n > 0 && data.result.ok == 1 && data.result.nModified == 0)
                        resolve({status: 'Partial'});
                    else 
                        resolve({status: 'Fail'});
                })
                .catch((err) => {
                    resolve('Fail');
                });
            
        });
    }
}

module.exports = updateSuborder;