
let WorkflowManager = require('./workflowManager'),
    workflowManager = new WorkflowManager(),
    log = require('./utils/logger').logger,
    config = require('./config');
let logbody = {};

logbody = {
    "debugMode": config.debugMode,
    "batchSize": config.batchSize,
    "name": "app.js"
};

log.verbose(JSON.stringify(logbody));

workflowManager.processWorkflow();


