var config = module.exports = {};

config.orderIdPrefix = "07";

config.mongoDBConnection = {
    connectionString : 'mongodb://localhost:27017/local'
};

config.logging = {
    logfolderPathName:'C:\\logroot\\orderService',
    verboseLogFileName: 'verbose.log',
    infoLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};

config.suborderAPI = 'http://localhost:4001/suborder/v1/get?orderid=${orderId}';
config.workflowCreationAPITimeOut = 1000;
config.workflowCreationAPIURL = "http://localhost:1337/orchMgrService/v1/doc";