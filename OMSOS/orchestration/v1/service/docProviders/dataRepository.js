let mongoose = require('mongoose');
let config = require('../config'),
    log = require('../utils/logger').logger,
    constant = require('../utils/constants'),
    WfManager = require('../models/wfMangerModel');

class dataRespository {
    constructor() {
        if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
            mongoose.connect(config.mongodb.uri, config.mongodb.options, function (err) {
                if (err) {
                    log.logger.error(`mongoose intialize connection fail: ${JSON.stringify(err)}`);
                }
            })
        }
    }

    saveDocs(req) {
        return new Promise((resolve, reject) => {
            checkAndOpenMongoose();
            
            req.save( (err, doc) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(doc);
                }
            })
        })
    }

    findByDocId(docId) {
        return new Promise((resolve, reject) => {
            checkAndOpenMongoose();
            WfManager.findById(docId, (err, doc) => {
                if (err) {
                    reject(id);
                }
                else {
                    resolve(doc);
                }
            })
        })
    }

    findByStatusId(statusId) {
        return new Promise((resolve, reject) => {
            checkAndOpenMongoose();
            WfManager.find({ status: statusId }).sort({ createDate: -1 })
                .exec((err, doc) => {
                    if (err) {
                        reject(id);
                    }
                    else {
                        resolve(doc);
                    }
                })
        })
    }

    findByDefault() {
        return new Promise((resolve, reject) => {
            checkAndOpenMongoose();
            WfManager.find({}).limit(config.findDefautlNumber).sort({ createDate: -1 })
                .exec((err, doc) => {
                    if (err) {
                        reject(id);
                    }
                    resolve(doc);
                })
        })
    }
}

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

module.exports = new dataRespository();