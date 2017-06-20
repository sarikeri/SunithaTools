var oracleDataProvider = require('./oracleDataProvider');
var eventConfiguration = require('../entities/eventConfiguration');

class eventConfigurationProvider {
    constructor() {
        this.oracle = new oracleDataProvider();
    }
    
    getEventConfiguration() {
        var eventsConfigured = [];

        return new Promise((resolve, reject) => {
            this.oracle.getData(`select TRACKING_STATUS, EVENT_NAME from webstore.pts_event_configuration`)
                .then((result) => {
                    if (result.rows.length > 0) {
                        result.rows.forEach((value) => {
                            eventsConfigured.push(new eventConfiguration(value.TRACKING_STATUS, value.EVENT_NAME));
                        });
                    }
                    resolve(eventsConfigured);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = eventConfigurationProvider;