let os = require("os"),
    moment = require('moment');
let config = require('../config'),
    log = require('../utils/logger'),
    WfManager = require('../models/wfManagerModel'),
    constant = require('../utils/constants'),
    repository = require('./mgrDataRepository');
let uri, instanceName;

class workflowRep {
    constructor() {
        uri = config.mongodb.uri;
        instanceName = os.hostname() + "_" + process.pid;
    }

    getAndUpdatePendingDocs(initStatus) {
        return new Promise((resolve, reject) => {
            repository.getAndUpdatePendingDoc(initStatus, instanceName)
                .then(doc => {
                    resolve(doc);
                })
                .catch(err => {
                    reject(err)
                });
        })
    }

    getCountWaitingProcessDoc(initStatus) {
        return new Promise((resolve, reject) => {
            repository.getCountWaitingProcessDoc(initStatus)
                .then(cnt => {
                    resolve(cnt);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    persistDocProcessResults(doc, result) {
        return new Promise((resolve, reject) => {
            let _id = doc._id,
                retryNo = ++doc.retryCount,
                taskStatus = "",
                logHistory = {};
            if (result.status === constant.docStatus.success || result.status === constant.docStatus.failed) {
                taskStatus = result.status;
                result.nextProcessDate = null;
            }
            else if (result.status === constant.docStatus.retry) {
                if (retryNo < config.maxTryNo) {
                    taskStatus = result.status;
                    if (result.nextProcessDate == undefined || result.nextProcessDate == null) {
                        result.nextProcessDate = moment().utc().add(config.processDelayTime, 's')._d;
                    }
                    else {
                            let nxtDate = new Date(result.nextProcessDate);
                            result.nextProcessDate = nxtDate;
                    }
                    logHistory.message = `The doc is will try at ${result.nextProcessDate}`;
                    logHistory.context = result.context;
                }
                else {
                    taskStatus = constant.docStatus.putAway;
                    logHistory.message = `The doc is putaway after try ${retryNo}`;
                    result.nextProcessDate = null;
                }
            }
            else //missing status
            {
                taskStatus = constant.docStatus.failed;
                logHistory.message = "missing status from task chain response";
                result = {};
                let error = {
                    "message": "missing status from task chain response",
                    "type": "client response exception"
                },
                    errors = [error];
                result.error = errors;
                result.nextProcessDate = null;
            }

            result.updateDate = moment().utc()._d;
            let callingTimeMs = {
                "wfService": result.wfServiceCalledTimeMs,
                "taskpipe": result.taskpipeTiming
            }
            logHistory.pastStatus = doc.status;
            logHistory.callingTimeMs = callingTimeMs;
            logHistory.previousUpdateDate = doc.updateDate;
            if (result.context != undefined) {
                if (!config.persistTransient && result.context.transient != undefined) {
                    result.context.transient = undefined;
                }
            }
            else {
                result.context = {};
            }

            if (result.error != undefined) {
                logHistory.error = result.error;
            }

            let params = {};
            params['$set'] = { status: taskStatus, context: result.context, retryCount: retryNo, nextProcessDate: result.nextProcessDate, updateDate: Date.now };
            params['$push'] = { logHistory: logHistory };
            if (result.error != undefined && Object.keys(result.error).length > 0 && result.tags != undefined && result.tags.length > 0) {
                params['$pushAll'] = { error: result.error, tags: result.tags };
            }
            else if (result.error != undefined && Object.keys(result.error).length > 0) {
                params['$pushAll'] = { error: result.error };
            }
            else if (result.tags != undefined && result.tags.length > 0) {
                params['$pushAll'] = { tags: result.tags };
            }

            repository.persistResult(_id, params)
                .then(doc => {
                    resolve(doc);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}

module.exports = workflowRep;