﻿var url = require('url');
var config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: 3000
};

config.logging = {
    logfolderPathName:'C:\\logroot\\PackageTrackingService',
    verboseLogFileName: 'Verbose.log',
    errorLogFileName: 'Error.log'
};

config.databaseConnection = {
    TNSAlias: 'x1a1_10g.world',
    UserId: 'svc_oms',
    Password: 'svc_oms1',
    connectionPoolAlias: 'pkgTrackingSvcPool',
    connectionPoolMin: 1,
    connectionPoolMax: 10,
    connectionPoolTimeout: 5
};

config.default = {
    trackingDetail: {
        waitDuration: 1,//in mins
        terminalStatuses: [
            'Delivered',
            'NotDeliverable',
            'ReturnToSender'
        ]
    }
};

config.defaultTimeZone = "America/Chicago";