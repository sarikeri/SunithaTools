let os = require("os");
let config = require('../config'),
    log = require('../utils/logger').logger,
    constant = require('../utils/constants'),
    WfManager = require('../models/wfMangerModel'),
    repository = require('./dataRepository.js');
let instanceName;

class wfDataProvider {
    constructor() {
        instanceName = os.hostname() + "_" + process.pid;
    }

    addWfManagerDoc(request) {

        return new Promise((resolve, reject) => {
            //assign passing value to 
            let req = new WfManager(request);
            req.instance = instanceName;
            if (request.metadata) {
                req.metadata = request.metadata;
            }
            if (request.context) {
                req.context = request.context;
            }
            req.validate(function (err) {
                if (err) {
                    let msg = 'Input doc validation fail'
                    let array = Object.keys(err.errors);
                    for (let i = 0; i < array.length; i++) {

                        msg = `${msg}${config.logging.messagedecliamerChr}${err.errors[array[i]].message}${config.logging.messagedecliamerChr}${JSON.stringify(request)}`;
                        log.error(msg);
                    }
                    reject(msg);
                }
                else {
                    repository.saveDocs(req)
                        .then(doc => {
                            resolve(doc);
                        })
                        .catch(err => {
                            reject(err);
                        })
                }
            })

        })
    }

    findByDocId(docId) {
        return new Promise((resolve, reject) => {
            repository.findByDocId(docId)
                .then(doc => {
                    resolve(doc);
                })
                .catch(err => {
                    reject(doc);
                })
        })
    }

    findByDefault() {
        return new Promise((resolve, reject) => {
            repository.findByDefault()
                .then(docs => {
                    resolve(docs);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    findByStatus(statusId) {
        return new Promise((resolve, reject) => {
            repository.findByStatusId(statusId)
                .then(docs => {
                    resolve(docs);
                })
                .catch(err => {
                    reject(err);
                })

        })
    }
}

module.exports = wfDataProvider;
