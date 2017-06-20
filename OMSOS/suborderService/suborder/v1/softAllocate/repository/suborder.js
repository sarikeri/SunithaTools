var mongoRepository = require('./repository.js');
var moment = require('moment');
var repository = new mongoRepository();

class suborder {

    getSuborders(query, projection) {       
        return new Promise(function (resolve, reject) {
            repository.findOne('suborders', query, projection).then(function (data) {
                resolve(data)
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    getSubordersbyOrderId(orderIdValue, projectionValue) {
        let queryValue = {
            orderId: orderIdValue
        };
        return new Promise(function (resolve, reject) {
            repository.find('suborders', queryValue, projectionValue).then(function (data) {
                resolve(data)
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    updateSuborder(suborder) {
        return new Promise(function (resolve, reject) {
            let queryValue = {                
                $and: [{'status': {$ne: "Deleted"}},{'status': {$ne: "SoftAllocated"}}],            
                suborderId: suborder.suborderId
            };
            repository.update('suborders', queryValue, suborder)
                .then((data) => {
                    resolve('Success');
                })
                .catch((err) => {
                    console.log('Error: ' + err);
                });
        });
    }

    createNewSuborder(newSuborder) {
        return new Promise(function (resolve, reject) {
            repository.insert('suborders', newSuborder)
                .then((data) => {
                    resolve('Success');
                })
                .catch((err) => {
                    console.log('Error: ' + err);
                });
        });
    }
}
module.exports = suborder;