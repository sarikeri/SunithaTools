let moment = require('moment');
let WorkflowDataProvider = require('./dataProviders/mgrDataProvider'),
    ApiHttpPost = require('./handlers/apiPostHandler'),
    log = require('./utils/logger').logger,
    config = require('./config'),
    constant = require('./utils/constants');
let workflowProvider = new WorkflowDataProvider();

class WorkflowManager {
    constructor() { }

    processWorkflow() {
        let logbody = {};
        //Get and update with valid docs
        workflowProvider.getCountWaitingProcessDoc(config.processStatus)
            .then(cnt => {
                if (cnt > 0) {
                    let loopNo = (cnt > config.batchSize) ? config.batchSize : cnt;
                    log.verbose(`Total ${loopNo} docs will be processed in this batch.`);
                    for (let i = 0; i < loopNo; i++) {
                        //console.log(`cnt: ${i}`);
                        workflowProvider.getAndUpdatePendingDocs(config.processStatus)
                            .then((doc) => {
                                let start = new moment();
                                //call workflowService
                                if (doc.lastErrorObject.updatedExisting) {
                                    let _id = doc.value._id;
                                    docProcess(doc.value).then(result => {
                                        //persist return values
                                        workflowProvider.persistDocProcessResults(doc.value, result)
                                            .then((doc) => {
                                                let then = new moment();
                                                logbody = {
                                                    "id": _id,
                                                    "name": doc.value.name,
                                                    "version": doc.value.version,
                                                    "process": "workflowManager.workflowProvider.persistDocProcessResults",
                                                    "processTimeMs": then.diff(start, 'milliseconds'),
                                                    "processStatus": "done"
                                                };
                                                log.verbose(JSON.stringify(logbody));
                                            })
                                            .catch(err => {
                                                let then = new moment();
                                                logbody = {
                                                    "name": doc.value.name,
                                                    "version": doc.value.version,
                                                    "id": _id,
                                                    "process": "workflowManager.workflowProvider.persistDocProcessResults",
                                                    "processTimeMs": then.diff(start, 'milliseconds'),
                                                    "processStatus": "done with exception",
                                                    "error": err
                                                };
                                                log.error(JSON.stringify(logbody));
                                                reject(err);
                                            })
                                    })
                                        .catch(err => {
                                            let then = new moment();
                                            logbody = {
                                                "name": doc.value.name,
                                                "version": doc.value.version,
                                                "id": _id,
                                                "process": "workflowManager.docProcess",
                                                "processTimeMs": then.diff(start, 'milliseconds'),
                                                "processStatus": "done with exception",
                                                "error": err
                                            };
                                            log.error(JSON.stringify(logbody));

                                            //persist exception
                                            workflowProvider.persistDocProcessResults(doc.value, err)
                                                .then((doc) => {
                                                    let then = new moment();
                                                    logbody = {
                                                        "process": "workflowManager.workflowProvider.persistDocProcessResults",
                                                        "id": _id,
                                                        "processStatus": "completed"
                                                    }
                                                    log.verbose(JSON.stringify(logbody))
                                                })
                                                .catch(err => {
                                                    logbody = {
                                                        "process": "workflowManager.workflowProvider.persistDocProcessResults",
                                                        "id": _id,
                                                        "processStatus": "failed",
                                                        "error": err
                                                    }
                                                    log.error(JSON.stringify(logbody));
                                                })
                                        })
                                }
                            })
                            .catch((err) => {
                                logbody = {
                                    "process": "workflowManager.workflowProvider.getAndUpdatePendingDocs",
                                    "processStatus": "done with exception",
                                    "error": err
                                };
                                log.error(JSON.stringify(logbody));
                            });
                    }
                }
                else {
                    log.verbose('no waiting processing doc found for current batch.');
                }

            })
            .catch(err => {
                logbody = {
                    "process": "workflowManager.workflowProvider.getCountWaitingProcessDoc",
                    "docStatausProcessed": config.processStatus,
                    "processStatus": "done with unhandled exception",
                    "error": err
                };
                log.error(JSON.stringify(logbody));
            })
    }
}

module.exports = WorkflowManager;

function docProcess(doc) {
    let start = new moment();
    return new Promise((resolve, reject) => {
        let uri = "";
        if (doc.resource == undefined) {
            uri = `http://${config.workflowSrvDomain}/${doc.version}/${doc.name}`;
        }
        else {
            uri = `http://${config.workflowSrvDomain}/${doc.name}/${doc.version}/${doc.resource}`;
        }

        let httpPost = new ApiHttpPost(uri, config.httpTimeout);
        let headers = { 'Content-Type': 'application/json' };
        httpPost.getPostback({ "context": doc.context, "metadata": doc.metadata }, headers, 'POST')
            .then(function (response) {
                //depend on response status
                let then = new moment();
                response.wfServiceCalledTimeMs = then.diff(start, 'milliseconds');
                response.updateDate = moment.utc()._d;
                resolve(response);
            }).catch(err => {
                //update log, not status change
                let then = new moment(),
                    errors = [];
                let error = {
                    "updateDate": moment.utc()._d,
                    "type": err.error.code,
                    "metadata": doc.metadata,
                    "message": `Fail to call workflow service and will retry at a default time ${config.processDelayTime} in seconds`
                }
                errors.push(error);
                let result = {
                    "status": constant.docStatus.retry,
                    "wfServiceCalledTimeMs": then.diff(start, 'milliseconds'),
                    "nextProcessDate": moment().utc().add(config.processDelayTime, 's')._d,
                    "error": errors
                }
                reject(result);
            })

    })
}

