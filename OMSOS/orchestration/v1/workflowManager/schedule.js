let cron = require('node-cron');
let WorkflowManager = require('./workflowManager'),
    workflowManager = new WorkflowManager(),
    log = require('./utils/logger').logger,
    config = require('./config');
let logbody = {};

logbody = {
    "debugMode": config.debugMode,
    "batchSize": config.batchSize,
    "name": "schedule.js"
}
if (config.debugMode) {
    log.verbose(JSON.stringify(logbody));
    workflowManager.processWorkflow();
}
else {
    logbody.cornIntervval = config.jobInterval;
    cron.schedule(`*/${config.jobInterval} * * * * *`, function () {
       log.verbose(JSON.stringify(logbody));
        workflowManager.processWorkflow();
    });
}


