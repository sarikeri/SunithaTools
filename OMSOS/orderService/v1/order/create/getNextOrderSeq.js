var mongoDataProvider = require('./../dataProviders/mongoDataProvider');
var config = require('./../oapConfig');

class getNextOrderSeq {
    constructor(context, metadata) {
        this.context = context;
        this.metadata = metadata;
    }

    execute() {
        var _this = this;
        return new Promise(function (resolve, reject) {
            let dataProvider = new mongoDataProvider();
            dataProvider.findAndModify("counters", { _id: "order" }, { $inc: { seq: 1 } }, true, true)
                .then((result) => {
                    // ensure the order number is 14 digits
                    resolve(config.orderIdPrefix + _this.leftpadWithZeros(result.value.seq, 9) + "100");
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    leftpadWithZeros(str, len) {
        str = String(str);
        var i = -1;
        len = len - str.length;
        while (++i < len) {
            str = '0' + str;
        }
        return str;
    }
}

module.exports = getNextOrderSeq;