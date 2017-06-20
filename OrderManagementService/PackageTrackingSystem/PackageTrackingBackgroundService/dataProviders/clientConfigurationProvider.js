var oracleDataProvider = require('./oracleDataProvider');
var clientConfiguration = require('../entities/clientConfiguration');

class clientConfigurationProvider {
    constructor() {
        this.oracle = new oracleDataProvider();
    }

    getClientConfiguration() {
        var clientConfigs = [];
        return new Promise((resolve, reject) => {
            this.oracle.getData(`select PTS_CLIENT_ID, EP_CLIENT_ID from webstore.pts_client_configuration`)
                .then((result) => {
                    if (result.rows.length > 0) {
                        result.rows.forEach((value) => {
                            clientConfigs.push(new clientConfiguration(value.PTS_CLIENT_ID, value.EP_CLIENT_ID));
                        });
                    }
                    resolve(clientConfigs);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = clientConfigurationProvider;