var url = require('url');
var path = require("path");
var config = module.exports = {};


config.mongoDBConnection = {
    connectionString : 'mongodb://localhost:27017/ODS'
};

config.OrchestrationBaseUrl = "http://localhost:1337/orchMgrService/v1/doc";

config.logging = {
    logfolderPathName:'C:\\logroot\\suborder',
    verboseLogFileName: 'verbose.log',
    infoLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};