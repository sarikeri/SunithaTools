var restClient = require('node-rest-client').Client;
var config = require('./../oapConfig');
var logger = require('./../utils/logger');

class injectWorkflow {
    constructor() {
        this.client = new restClient();
    }

    inject(workflowName, metadata) {
        let data = {};
        data.name = "workflow";
        data.version = "v1";
        data.resource = workflowName;
        data.metadata = metadata;

        let args = {
            data: data,
            requestConfig: { timeout: config.workflowCreationAPITimeOut },
            responseConfig: { timeout: config.workflowCreationAPITimeOut },
            headers: { "Content-Type": "application/json" }
        };

        var _this = this;
        let startTime = new Date();
        return new Promise(function (resolve, reject) {
            let req = _this.client.post(config.workflowCreationAPIURL, args, function (data, response) {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    logger.verbose(`Injecting workflow ${workflowName} took: ${(new Date() - startTime)}ms`);
                    if (data._id) {
                        return resolve(true);
                    }
                    else {
                        return reject(`${workflowName} workflow creation failed. ${data.error}`);
                    }
                } else {
                    return reject(`Failed to create ${workflowName} workflow. http status code ${response.statusCode}; status message: ${response.statusMessage}`);
                }
            });

            req.on('requestTimeout', function (req) {
                req.abort();
                return reject(`${workflowName} workflow creation API timed out`);
            });

            req.on('responseTimeout', function (res) {
                return reject(`${workflowName} workflow creation API timed out`);
            });

            req.on('error', function (err) {
                return reject(`${workflowName} workflow creation API Error: ${err}`);
            });
        });
    }
}

module.exports = injectWorkflow;