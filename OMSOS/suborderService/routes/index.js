var express = require('express');
var router = express.Router();
var logger = require('../utils/logger.js');
var fs = require('fs');
var tp = require('../taskpipe.js');
var config = require('../config.js');

router.get('/:version/:resource', function (req, res) {
    try {
        let key, metadata = {};
        if (Object.keys(req.query).length === 1) {
            let keyName = Object.keys(req.query)[0];
            if(keyName.toLowerCase() == 'orderid') {
                metadata = { orderId: req.query[keyName] };
            }
        }

        //let metadata = query;
        let context = '';
        router.process(req.params.resource, req.params.version, metadata, context)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                // TODO check what error needed              
                res.send(err);
            });
    } catch (exception) {
        res.statusCode = 500;
        res.send({
            message: exception.ErrorMessage,
            stack: exception.stack
        });
    }
});

router.get('/:version/:resource/:suborderId', function (req, res) {
    try {        
        let metadata = {
            suborderId: req.params.suborderId
        };
        let context = '';
        router.process(req.params.resource, req.params.version, metadata, context)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                // TODO check what error needed              
                res.send(err);
            });
    } catch (exception) {
        res.statusCode = 500;
        res.send({
            message: exception.ErrorMessage,
            stack: exception.stack
        });
    }
});

router.put('/:version/:resource/', function (req, res) {
    try {
        let projectionValue = {};
        let metadata = {};
        let context = '';
        if (req.body.hasOwnProperty('metadata'))
            metadata = req.body.metadata;
        else
            metadata = req.body;
        if (req.body.hasOwnProperty('context'))
            context = req.body.context;
        router.process(req.params.resource, req.params.version, metadata, context)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                // TODO check what error needed              
                res.send(err);
            });
    } catch (exception) {
        res.statusCode = 500;
        res.send({
            message: exception.ErrorMessage,
            stack: exception.stack
        });
    }
});


router.post('/:version/:resource/', function (req, res) {
    try {
        let projectionValue = {};
        let metadata = {};
        let context = '';
        if (req.body.hasOwnProperty('metadata'))
            metadata = req.body.metadata;
        else
            metadata = req.body;
        if (req.body.hasOwnProperty('context'))
            context = req.body.context;
        router.process(req.params.resource, req.params.version, metadata, context)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                // TODO check what error needed              
                res.send(err);
            });
    } catch (exception) {
        res.statusCode = 500;
        res.send({
            message: exception.ErrorMessage,
            stack: exception.stack
        });
    }
});

router.process = function (folderName, version, metadata, context) {
    return new Promise(function (resolve, reject) {
        // Reading everytime to get latest tasks TODO see if caching needed of file reading
        let normalizedPath = config.workFlowDir + "\\" + version + "\\" + folderName;
        fs.readFile(normalizedPath + "\\" + config.taskJson, ((err, taskData) => {
            if (err) {
                throw err;
            }
            let tasks = JSON.parse(taskData);
            //Commented below code as it was not working 
            //let taskPipe = new tp(metadata, '');
            let taskPipe = new tp(metadata, context);
            taskPipe.execute(tasks, normalizedPath).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        }));
    });
}

module.exports = router;