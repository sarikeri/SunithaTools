let moment = require('moment'),
    mongoose = require('mongoose');
let config = require('../config'),
    WfManager = require('../models/wfManagerModel'),
    log = require('../utils/logger').logger,
    constant = require('../utils/constants');
mongoose.connect(config.mongodb.uri, config.mongodb.options);
let logbody = {};

class dataRespository {
    constructor() {
        if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
            mongoose.connect(config.mongodb.uri, config.mongodb.options, function (err) {
                if (err) {
                    logbody = {
                        "process": "mongodb connection initialization",
                        "processStatus": "Failed",
                        "error": err
                    }
                    log.error(JSON.stringify(logbody));
                }
            })
        }
    }

    getAndUpdatePendingDoc(initStatus, instanceName) {
        return new Promise((resolve, reject) => {
            try {
                checkAndOpenMongoose();
                //read the doc and set the stataus as "processing"
                let curDate = moment().utc()._d;
                WfManager.collection.findAndModify({ status: { $in: initStatus }, nextProcessDate: { $lte: curDate } }, { updateDate: 1 },
                    { $set: { instance: instanceName, status: constant.docStatus.processing, updateDate: curDate } },
                    true, false, false, { type: 0 },
                    (err, doc) => {
                        if (err) {
                            logbody = {
                                "process": "WfManager.collection.findAndModify",
                                "processStatus": "Failed: mongodb read fail",
                                "error": err
                            }
                            log.error(JSON.stringify(logbody));
                            reject(err);
                        }
                        else {
                            resolve(doc)
                        }
                    })
            }
            catch (err) {
                logbody = {
                    "process": "WfManager.collection.findAndModify",
                    "processStatus": "Failed: unhandle exception",
                    "error": err
                }
                log.error(JSON.stringify(logbody));
                reject(err);
            }
        })
    }

    persistResult(id, params) {
        return new Promise((resolve, reject) => {
            try {
                checkAndOpenMongoose();
                WfManager.collection.findAndModify({ _id: id }, [], params, { upsert: true },
                    (err, doc) => {
                        if (err) {
                            logbody = {
                                "process": "WfManager.collection.persistResult",
                                "processStatus": "Failed: insert fail, The docstatus may hung on Processing status",
                                "error": err
                            }
                            log.error(JSON.stringify(logbody));
                            reject(err);
                        }
                        else {
                            resolve(doc);
                        }
                    })
            }
            catch (err) {
                logbody = {
                    "process": "WfManager.collection.persistResult",
                    "processStatus": "Failed: unhandled exception",
                    "error": err
                }
                log.error(JSON.stringify(logbody));
                reject(err);
            }
        })
    }

    getCountWaitingProcessDoc(initStatus) {
        return new Promise((resolve, reject) => {
            try {
                checkAndOpenMongoose();
                let curDate = new moment().utc()._d;
                WfManager.collection.count({ status: { $in: initStatus }, nextProcessDate: { $lte: curDate } }, (err, cnt) => {
                    if (err) {
                        logbody = {
                            "process": "WfManager.collection.getCountWaitingProcessDoc",
                            "processStatus": "Failed: reading fail",
                            "error": err
                        }
                        log.error(JSON.stringify(logbody));
                        reject(err);
                    }
                    else {
                        resolve(cnt);
                    }
                })
            }
            catch (err) {
                logbody = {
                    "process": "WfManager.collection.getCountWaitingProcessDoc",
                    "processStatus": "Failed: unhandled exception",
                    "error": err
                }
                log.error(JSON.stringify(logbody));
                reject(err);
            }
        })
    }
}

module.exports = new dataRespository();

function checkAndOpenMongoose() {
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
        mongoose.connect(config.mongodb.uri, config.mongodb.options, function (err) {
            if (err) {
                log.error(`mongoose connection closed, and reset the connection fail with ${JSON.stringify(err)}`);
            }
            log.error(`mongoose connection closed and reset the connection`);
        })
    }
}