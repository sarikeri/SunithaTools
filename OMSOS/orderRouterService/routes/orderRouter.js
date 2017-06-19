var express = require('express');
var router = express.Router();
var fs = require('fs');
var tp = require('../taskpipe.js');
var config = require('../config.js');


router.post('/:version/routes', function (req, res) {
    let startTime = new Date();
    try {
        router.process('availableRoutes', req.params.version, req.body)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                // TODO check what error needed              
                res.send(err);
            })
            .then(() => {
                // TODO: Remove this before production
                console.log('Duration: ' + (new Date() - startTime));
            });
    }
    catch (exception) {
        res.statusCode = 500;
        res.send({ message: exception.ErrorMessage, stack: exception.stack });
    }
});

router.post('/:version/demandroutes', function (req, res) {
    let startTime = new Date();
    try {
        router.process('demandRoutes', req.params.version, req.body)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                // TODO check what error needed              
                res.send(err);
            })
            .then(() => {
                // TODO: Remove this before production
                console.log('Duration: ' + (new Date() - startTime));
            });
    }
    catch (exception) {
        res.statusCode = 500;
        res.send({ message: exception.ErrorMessage, stack: exception.stack });
    }
});

router.process = function (folderName, version, metadata) {
    return new Promise(function (resolve, reject) {
        let commonFile = config.workFlowDir + "\\" + version + "\\common\\" + "common";
        let Common = require(commonFile);
        let context = Common.createContext(metadata);

        // get inventory from invenrtory service

        // get zipmap from mongodb 

        
        // Reading everytime to get latest tasks TODO see if caching needed of file reading
        // get tasks from pipeline
        let normalizedPath = config.workFlowDir + "\\" + version + "\\" + folderName;
        fs.readFile(normalizedPath + "\\" + config.taskJson, ((err, taskData) => {
            if (err) {
                throw err;
            }
            let taskPipelines = JSON.parse(taskData).taskPipelines;
            let tasks = [];
            for (let pipeLine of taskPipelines) {
                if (pipeLine.inputType == context.IdType) {
                    tasks = pipeLine;
                    break;
                }
            }

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