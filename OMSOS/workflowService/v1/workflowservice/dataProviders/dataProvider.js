let mongoose = require('mongoose');
let config = require('../config'),
    Workflow = require('../models/tasksModel'),
    constant = require('../utils/constants'),
    log = require('../utils/logger').logger;

class dataRespository {
    constructor() {
        if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
            mongoose.connect(config.mongodb.uri, config.mongodb.options, function (err) {
                if (err) {
                    log.error(`mongoose intialize connection fail: ${JSON.stringify(err)}`);
                }
            })
        }
    }

    getTask(req) {
        return new Promise((resolve, reject) => {
            try {
                checkAndOpenMongoose();
                let filterCriteria = "";
                if (req.params.resource != undefined) { //TODO: deprecate later
                    Workflow.findOne({ serviceName: req.params.service, version: req.params.version, resource: req.params.resource, isActive: true },
                        { _id: 0, tasks: 1 })
                        .exec((err, doc) => {
                            if (err) {
                                err.status = constant.taskStatus.failure;
                                reject(err)
                            }
                            else {
                                if (doc == null) {
                                    let err = new Error("No task found from database.");
                                    err.status = constant.taskStatus.noTaskFound;
                                    reject(err)
                                }
                                else {
                                    resolve(doc);
                                }
                            }
                        })
                }
                else {
                    Workflow.findOne({ serviceName: req.params.service, version: req.params.version, isActive: true },
                        { _id: 0, tasks: 1 })
                        .exec((err, doc) => {
                            if (err) {
                                err.status = constant.taskStatus.failure;
                                reject(err)
                            }
                            else {
                                if (doc == null) {
                                    let err = new Error("No task found from database.");
                                    err.status = constant.taskStatus.noTaskFound;
                                    reject(err)
                                }
                                else {
                                    resolve(doc);
                                }
                            }
                        })
                }
            } catch (exception) {
                exception.status = constant.taskStatus.failure;
                exception.message = 'mongoose get data fail';
                reject(exception);
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