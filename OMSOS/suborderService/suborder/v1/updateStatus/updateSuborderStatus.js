var mongorepository = require('./../../../dataProviders/mongoRep');
var Logger = require('./logger.js');
var moment = require('moment');
var _this;

class updateSuborder {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
        _this = this;
    }

    execute() {
        console.log('Update SubOrderStatus called');
        var _this = this;
        return new Promise(function (resolve, reject) {
            let now = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            let update = {
                $set: {
                    status: _this.metadata.status,
                    updateBy: _this.metadata.updateBy,
                    updateDate: now
                }
            }

            let query = {
                suborderId: _this.metadata.suborderId
            }

            let repository = new mongorepository();
            repository.update('suborders', query, update)
                .then((data) => {
                    if (data.result.n > 0 && data.result.ok == 1 && data.result.nModified > 0)
                        resolve({
                            status: 'Success'
                        });
                    else if (data.result.n > 0 && data.result.ok == 1 && data.result.nModified == 0)
                        resolve({
                            status: 'Partial'
                        });
                    else
                        resolve({
                            status: 'Fail'
                        });
                })
                .catch((err) => {
                    resolve('Fail');
                });

        });
    }
}

module.exports = updateSuborder;