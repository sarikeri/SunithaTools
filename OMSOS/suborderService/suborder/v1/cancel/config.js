// This contains Route order workflow config specific settings
var config = module.exports = {};

config.logging = {
    logfolderPathName: 'c:\\logroot\\SuborderService',
    verboseLogFileName: 'info.log',
    errorLogFileName: 'error.log'
};

config.OrchestrationBaseUrl = "http://localhost:1337/orchMgrService/v1/doc";




