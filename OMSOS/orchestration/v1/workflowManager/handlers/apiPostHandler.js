var request = require('request');
var log = require('../utils/logger');
//basic http post method
class ApiHttpPostHandler {
    constructor(uri, timeout) {
        this.uri = uri;
        this.timeout = timeout;
    }

    getPostback(input, headers, method) {

        let options = {};
        options.method = method;
        options.body = input;
        options.uri = this.uri;
        options.json = true;

        options.headers = {};
        options.headers.cookie = headers.cookie;
        options.headers.accept = headers.accept;
        options.headers.connection = headers.connection;

        options.timeout = this.timeout;
        return new Promise(function (resolve, reject) {
            request(options.uri, options, function (error, response, body) {
                if (error) {
                    let exception = {};
                    exception.uri = options.uri;
                    exception.body = options.body;
                    exception.error = error;
                    console.log(options.uri);
                    reject(exception);
                }
                else {
                    log.logger.verbose(response.body);
                    console.log(options.uri);
                    let exceptionFound = false;
                    let errMsg = "";
                    if (response.statusCode == 500) {
                        exceptionFound = true;
                    }
                    if (exceptionFound) {
                        reject(err);
                    }
                    else {
                        resolve(response.body);
                    }
                }
            })
        });
    }


}

module.exports = ApiHttpPostHandler;