var clients = [];
var dbAccess = require('./dbAccess.js');
var dbClient = new dbAccess();

class ClientConfigurationRepository {
    constructor() {}

    getClients() {
        return new Promise(function (resolve, reject) {
            if(clients.length > 0){
                resolve(clients);
            }
            else{
                var sql = "SELECT PTS_CLIENT_ID, PTS_CLIENT_NAME, SCDY_SUBSCRIBING_CLIENT_IDS, SITE_IDS, EP_CLIENT_ID, CLIENT_USER_NAME, CLIENT_PASSWORD FROM PTS_CLIENT_CONFIGURATION";

                dbClient.getData(sql).then(function (result) {
                    if (clients.length <= 0) {
                        clients.push.apply(clients, result.rows);
                    }
                    resolve(clients);
                })
                    .catch(function (err) {
                        reject(err);
                    });
            }
        });
    }
}

module.exports = ClientConfigurationRepository;