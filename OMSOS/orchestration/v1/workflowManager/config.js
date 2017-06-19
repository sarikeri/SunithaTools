var config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: 3000
};

config.debugMode = false; //app.js will be start page, 
config.batchSize = 15;
config.processStatus = ['New', 'Retry']; //new and fail
config.httpTimeout = 200000;
config.jobInterval = 5; //seconds
config.processDelayTime = 2; //seconds
config.maxTryNo = 8;
config.persistTransient = false;

config.logging = {
    logfolderPathName: 'e:\\logroot\\orchestration\\workflowManager',
    verboseLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};

config.workflowSrvDomain = 'localhost:1338/workflowservice';

//config.url = 'mongodb://localhost:27017/dev';
//connect with the collection 'wfOrchestration' for workflowDb
config.mongodb = {
    uri: 'mongodb://bv1824:27017/workflowDb',  //'mongodb://hqomsws01d.dsdev.drugstore.com:27017/workflowAdmin',//
    options: {
        server: {
            poolSize: 6,
            socketOptions: {
                socketTimeoutMS: 0,
                connectTimeoutMS: 0,
                keepAlive: 0
            }
        },
        user: 'myWorkflow', //'workflowUser',//
        pass: 'workflow' //'workflow123'//
    }
};
