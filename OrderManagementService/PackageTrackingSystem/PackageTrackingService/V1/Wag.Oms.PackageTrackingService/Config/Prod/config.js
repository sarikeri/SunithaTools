﻿var url = require('url');
var config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: 3000
};

config.logging = {
    logfolderPathName: 'E:\\logroot\\PackageTrackingService',
    verboseLogFileName: 'Verbose.log',
    errorLogFileName: 'Error.log'
};

config.databaseConnection = {
    TNSAlias: 'ODS_PROD.WORLD',
    UserId: 'svc_oms',
    Password: '#Enter password here#',
    connectionPoolAlias: 'pkgTrackingSvcPool',
    connectionPoolMin: 1,
    connectionPoolMax: 10,
    connectionPoolTimeout: 5
};

config.default = {
    trackingDetail: {
        waitDuration: 15,//in mins
        terminalStatuses: [
            'Delivered'
        ]
    }
};

config.defaultTimeZone = "America/Chicago";

config.proxyServer = 'http://proxy.dmzwalgreenco.net:80';