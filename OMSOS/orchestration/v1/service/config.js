var config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: process.env.PORT || 1337
};


config.clusterOn = false; //app.js will be start page, 
config.isDebug = false;

config.service = {
    baseuri: "/orchMgrService/",
    version: 'v1',
    resource:
        {
            doc: 'doc', //insert doc
            view: 'view', //search by id or default
            status: 'status' //display by status
        }
};

config.logging = {
    logfolderPathName: 'e:\\logroot\\orchestration\\wfManagementService',
    verboseLogFileName: 'info.log',
    errorLogFileName: 'error.log',
    messagedecliamerChr: '|'
};

config.mongodb = {
    uri: 'mongodb://bv1824:27017/workflowDb', //'mongodb://hqomsws01d.dsdev.drugstore.com:27017/workflowAdmin',//
    options: {
        server: {
            poolSize: 4,
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

config.findDefautlNumber = 5;