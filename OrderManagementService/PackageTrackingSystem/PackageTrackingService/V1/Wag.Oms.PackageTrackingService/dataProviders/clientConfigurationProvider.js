var clientConfigurationRepository = require('../dalRepositories/clientConfigurationRepository.js');
var clientConfigurationRepositoryObj = new clientConfigurationRepository();

class ClientConfigurationProvider {
    constructor() { }

    getClients() {
        return new Promise(function (resolve, reject) {
            clientConfigurationRepositoryObj.getClients()
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
}

module.exports = ClientConfigurationProvider;