var replaceall = require('replaceall');
var oracleDataProvider = require('./oracleDataProvider');
var carrierConfiguration = require('../entities/carrierConfiguration');

class carrierConfigurationProvider {
    constructor() {
        this.oracle = new oracleDataProvider();
    }

    getCarrierConfiguration() {
        var carrierConfigs = [];
        return new Promise((resolve, reject) => {
            this.oracle.getData(`select CARRIER_ID, MAX_PARALLEL_API_CALLS, MAX_TRACKING_DAYS, INITIAL_WAIT_DAYS, SCHEDULE_TIME 
                from webstore.pts_carrier_configuration`)
                .then((result) => {
                    if (result.rows.length > 0) {
                        result.rows.forEach((value) => {
                            carrierConfigs.push(new carrierConfiguration(value.CARRIER_ID, value.MAX_PARALLEL_API_CALLS, value.MAX_TRACKING_DAYS, value.INITIAL_WAIT_DAYS, this.getSchedule(value.SCHEDULE_TIME)));
                        });
                    }
                    resolve(carrierConfigs);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getSchedule(scheduleString) {
        var scheduleArr = scheduleString.split(",");
        scheduleArr.forEach((s, index, arr) => {
            arr[index] = replaceall(' ','', s);
        });
        return scheduleArr;
    }
}

module.exports = carrierConfigurationProvider;