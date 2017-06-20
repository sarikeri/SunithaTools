var express = require('express');
var router = express.Router();
var config = require('../config.js');
var logger = require('./../v1/order/utils/logger');

router.get('/:version/order/:orderId', function (req, res) {
    let startTime = new Date();
    try {
        let folderName = 'get';
        if (req.query.internal == 1) {
            folderName = 'getInternal';
        }
        let projectionValue = {};
        let metadata = { orderId: req.params.orderId, projection: projectionValue };
        router.process('order', folderName, 'getOrder.js', req.params.version, metadata)
            .then((result) => {
                res.send(result);
                logger.verbose(`GET order response: ${JSON.stringify(result)}`);
            })
            .catch((err) => {
                res.statusCode = 500;
                res.send(err);
            })
            .then(() => {
                logger.verbose(`GET order exec duration: ${(new Date() - startTime)}ms`);
            });
    }
    catch (exception) {
        res.statusCode = 500;
        res.send({ message: exception.ErrorMessage, stack: exception.stack });
    }
});

router.post('/:version/order', function (req, res) {
    let startTime = new Date();
    logger.verbose(`Create order request: ${JSON.stringify(req.body)}`);
    try {
        router.process('order', 'create', 'createOrder.js', req.params.version, req.body)
            .then((result) => {
                res.send(result);
                logger.verbose(`Create order response: ${JSON.stringify(result)}`);
            })
            .catch((err) => {
                res.statusCode = 500;
                res.send(err);
            })
            .then(() => {
                logger.verbose(`Create order exec duration: ${(new Date() - startTime)}ms`);
            });
    }
    catch (exception) {
        res.statusCode = 500;
        res.send({ message: exception.ErrorMessage, stack: exception.stack });
    }
});

router.put('/:version/order', function (req, res) {
    let startTime = new Date();
    logger.verbose(`Update order request: ${JSON.stringify(req.body)}`);
    try {
        router.process('order', 'update', 'updateOrder.js', req.params.version, req.body)
            .then((result) => {
                res.send(result);
                logger.verbose(`Update order response: ${JSON.stringify(result)}`);
            })
            .catch((err) => {
                res.statusCode = 500;
                res.send(err);
            }).then(() => {
                logger.verbose(`Update order exec duration: ${(new Date() - startTime)}ms`);
            });
    }
    catch (exception) {
        res.statusCode = 500;
        res.send({ message: exception.ErrorMessage, stack: exception.stack });
    }
});

router.put('/:version/order/updateRoutingStatus', function (req, res) {
    let startTime = new Date();
    try {
        router.process('order', 'updateInternal', 'updateRoutingStatus.js', req.params.version, req.body)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                res.send(err);
            }).then(() => {
                logger.verbose(`Update routing status exec duration: ${(new Date() - startTime)}ms`);
            });
    }
    catch (exception) {
        res.statusCode = 500;
        res.send({ message: exception.ErrorMessage, stack: exception.stack });
    }
});

router.patch('/:version/order', function (req, res) {
    let startTime = new Date();
    try {
        router.process('order', 'close', 'closeOrder.js', req.params.version, req.body.metadata)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.statusCode = 500;
                res.send(err);
            }).then(() => {
                logger.verbose(`Close order exec duration: ${(new Date() - startTime)}ms`);
            });
    }
    catch (exception) {
        res.statusCode = 500;
        res.send({ message: exception.ErrorMessage, stack: exception.stack });
    }
});

router.process = function (resourceName, folderName, fileName, version, metadata) {
    return new Promise(function (resolve, reject) {
        let normalizedPath = `${config.workFlowDir}\\${version}\\${resourceName}\\${folderName}\\${fileName}`;
        try {
            let task = require(normalizedPath);
            let taskObj = new task('', metadata);
            taskObj.execute().then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        }
        catch (err) {
            if (err.stack) {
                logger.error(err.stack);
            } else {
                logger.error(err);
            }
        }
    });
}

module.exports = router;