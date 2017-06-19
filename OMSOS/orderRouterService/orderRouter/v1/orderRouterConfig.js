var config = module.exports = {};

config.mongoDBConnection = {
    connectionString : 'mongodb://localhost:27017/orderRouterService'
};

config.logging = {
    logfolderPathName:'C:\\logroot\\orderAccessPoint',
    verboseLogFileName: 'verbose.log',
    infoLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};

config.serviceSettings = {
    inventoryService: {
        on: 1,
        baseUri: 'http://hqomsws01d.dsdev.drugstore.com/inventoryservice/v1/inventory/',
        sellableUri: 'getsellablebylocation',
        availableUri: 'getavailablebylocation',
        timeout: 1000
    }
};