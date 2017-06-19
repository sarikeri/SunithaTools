let config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: 3000
};

config.debugMode = false; //app.js will be start page, 
config.batchSize = 15;
config.processStatus = ['New', 'Retry']; //new and fail
config.httpTimeout = 3000;
config.jobInterval = 20; //seconds
config.processDelayTime = 120; //seconds
config.maxTryNo = 8;
config.persistTransient = false;

config.logging = {
    logfolderPathName: 'e:\\logroot\\orchestration\\workflowManager',
    verboseLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};

config.workflowSrvDomain = 'hqomsws01d.dsdev.drugstore.com:1338/workflowservice';

//connect with the collection 'wfOrchestration' for workflowDb
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
