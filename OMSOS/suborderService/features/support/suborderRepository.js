var mongorepository = require('./../../dataProviders/mongoRep');
var suborderJson = require('./suborder.json')
var repository = new mongorepository();

module.exports = {
    insert: function (orderId, suborderId, status) {
        return new Promise(function (resolve, reject) {
            let localSuborderJSON = JSON.parse(JSON.stringify(suborderJson));
            localSuborderJSON.orderId = orderId;
            localSuborderJSON.suborderId = suborderId;
            localSuborderJSON.status = status;
            repository.insert('suborders', localSuborderJSON).then((result) => {
                //let _result = result;
                resolve(true);
            });
        });
    },

    insertSuborder: function (suborderJson) {
        return new Promise(function (resolve, reject) {
            repository.insert('suborders', suborderJson).then((result) => {
                if (result.insertedCount == 1) {
                    resolve(true);
                }
                resolve(false);
            });
        });
    },

    get: function (suborderId) {
        return new Promise(function (resolve, reject) {
            let query = { 'suborderId': suborderId };
            repository.findOne('suborders', query).then((result) => {
                resolve(result);
            });
        });
    },
    remove: function (suborderId) {
        return new Promise(function (resolve, reject) {
            let query = { 'suborderId': suborderId };
            repository.remove('suborders', query).then((result) => {               
                resolve(true);
            });
        });
    }
}