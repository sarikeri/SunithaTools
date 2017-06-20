var carrieres = [];
var dbAccess = require('./dbAccess.js');
var dbClient = new dbAccess();

class CarrierConfigurationRepository {
    constructor() {}

    getCarriers() {
        return new Promise(function (resolve, reject) {
            if(carrieres.length > 0){
                resolve(carrieres);
            }
            else{
                var sql = "SELECT A.CARRIER_ID, A.CARRIER_URL, A.MAX_PARALLEL_API_CALLS, A.INITIAL_WAIT_DAYS, A.MAX_TRACKING_DAYS, A.SCHEDULE_TIME, B.KEY, B.VALUE FROM PTS_CARRIER_CONFIGURATION A left join PTS_CARRIER_CREDENTIAL B on UPPER(A.CARRIER_ID) = UPPER(B.CARRIER_ID)";

                dbClient.getData(sql).then(function (result) {
                    if (carrieres.length <= 0) {
                        carrieres.push.apply(carrieres, result.rows);
                    }
                    resolve(carrieres);
                })
                    .catch(function (err) {
                        reject(err);
                    });
            }
        });
    }
}

module.exports = CarrierConfigurationRepository;