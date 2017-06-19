var path = require("path");
var config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: process.env.PORT || 4001
};

config.mongoDBConnection = {
    //connectionString : 'mongodb://localhost:27017/ODS'
    connectionString : 'mongodb://localhost:27017/local'
};

config.workFlowDir = path.join(__dirname, "suborder");

config.taskJson = 'task.json';

config.logging = {
    logfolderPathName:'C:\\logroot\\suborder',
    verboseLogFileName: 'verbose.log',
    infoLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};


