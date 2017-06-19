let path = require("path");
let config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: process.env.PORT || 1338
};

config.environment = 'dev';
config.rootpath = __dirname;

//debug will start with app.js, otherwise start with cluster
config.isDebug = false;
config.clusterOn = false;
config.baseUri = 'workflowservice/';

config.taskDataSource = 0, //default 0 - mongodb; 1 file

//connect with mongodb
config.mongodb = {
    uri: 'mongodb://hqomsws01d.dsdev.drugstore.com:27017/workflowAdmin',
    options: {
        server: {
            poolSize: 6,
            socketOptions: {
                socketTimeoutMS: 0,
                connectTimeoutMS: 0,
                keepAlive: 0
            }
        },
        user: 'workflowUser',
        pass: 'workflow123'
    }
};

config.logging = {
    logfolderPathName: 'e:\\logroot\\workflowservice',
    verboseLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};

