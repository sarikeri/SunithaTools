﻿var os = require('os');
var config = module.exports = {};

config.app_server = {
    host: 'localhost',
    port: 3000
};

config.logging = {
    logDirectory: 'E:\\logroot\\PackageTrackingBackgroundService',
    verboseLogFileName: 'Verbose.log',
    errorLogFileName: 'Error.log',
    debugLogFileName: 'Debug.log',
    suppressDebugInfoLog: true
};

config.databaseConnection = {
    TNSAlias: 'x1a1_10g.world',
    UserId: 'svc_oms',
    Password: 'svc_oms1',
    connectionPoolAlias: 'pkgTrackingBkgSvcPool',
    connectionPoolMin: 1,
    connectionPoolMax: 10,
    connectionPoolTimeout: 5
};

config.databaseMaxRows = 100000;

config.epClientId = 3;

config.packageTrackingDetailsClientId = 0;

config.subscriptionCompletedStatus = 3;

config.subscriptionErrorStatus = 101;

config.maxRetryCount = 3;

config.errorTextLimit = 4000;

config.terminalTrackingStatuses = ["Delivered", "NotDeliverable", "ReturnToSender"];

config.defaultTimeZone = "America/Chicago";

config.sleepBetweenBatchInMs = 20000;

config.hostName = os.hostname();

config.trackingDetailAPI = 'http://hqomsws01d.dsdev.drugstore.com/packagetrackingservice/v1/TrackingDetail?ClientId=${clientId}&SiteId=${siteId}&OrderId=${orderId}&ShippingDateTime=${shippingDateTime}&CarrierId=${carrierId}&TrackingId=${trackingId}';

config.trackingDetailAPITimeOut = 3000;

config.eventGeneratorAPI = 'http://hqomsws01d/eventgenerator/v1/event';

config.eventGeneratorAPITimeOut = 3000;

config.retryWaitMins = 15;