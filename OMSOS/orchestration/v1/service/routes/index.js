var express = require('express');
var router = express.Router();
let moment = require('moment');
let log = require('../utils/logger').logger,
    config = require('../config'),
    WfProvider = require('../docProviders/wfDataProvider'),
    constant = require('../utils/constants');
let provider = new WfProvider();


// view specified doc by id 
// no docId found, then list docs with default number which is configurable.
router.get(`/${config.service.resource.view}/:docId?`, function (req, res) {
    if (!req.params.docId) //view last default docs
    {
        provider.findByDefault()
            .then(docs => {
                res.send(docs);
            }).catch(err => {
                res.send(err);
            })
    }
    else {
        provider.findByDocId(req.params.docId)
            .then(doc => {
                res.send(doc);
            }).catch(err => {
                res.send(err);
            })
    }
});

router.get(`/${config.service.resource.status}/:statusId?`, function (req, res) {
        let statusId = (!req.params.statusId) ? constant.docStatus.new : req.params.statusId;
        provider.findByStatus(statusId)
            .then(doc => {
                res.send(doc);
            }).catch(err => {
                res.send(err);
            })
});

//add new doc and allow to doc duplicated, the client will be handler if it is duplicated
router.post(`/${config.service.resource.doc}`, function (req, res) {
    let start = new moment();
    provider.addWfManagerDoc(req.body).then((doc) => {
        let then = new moment();
        let msg =`rouer.post${config.logging.messagedecliamerChr}${then.diff(start, 'milliseconds')}${config.logging.messagedecliamerChr}${JSON.stringify(doc._id)}`;
        log.verbose(msg);
        let resp = {
            "status" : "Success",
            "doc" : doc
        };
        res.send(resp);
    }).catch((err) => {
        let resp = {
            "status": "Failed",
            errorMessage: err.message
        }
        let then = new moment();
        let msg =`rouer.post${config.logging.messagedecliamerChr}${then.diff(start, 'milliseconds')}${config.logging.messagedecliamerChr}Fail${JSON.stringify(resp)}`;
        log.error(msg);
        res.send(resp);
    })
});

module.exports = router;