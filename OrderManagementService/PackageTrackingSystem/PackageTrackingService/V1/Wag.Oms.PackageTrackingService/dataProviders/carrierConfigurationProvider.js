var carrierConfigurationRepository = require('../dalRepositories/carrierConfigurationRepository.js');
var carrierConfigurationRepositoryObj = new carrierConfigurationRepository();

class CarrierConfigurationProvider {
    constructor() { }

    getCarriers() {
        return new Promise(function (resolve, reject) {
            carrierConfigurationRepositoryObj.getCarriers()
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
}

module.exports = CarrierConfigurationProvider;