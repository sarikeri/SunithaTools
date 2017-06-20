var winston = require('winston');
require('winston-daily-rotate-file');
var config = require('../config.js');
var fs = require('fs');
var moment = require('moment-timezone');
var cls = require('continuation-local-storage');

winston.emitErrs = true;

if (!fs.existsSync(config.logging.logfolderPathName)) {
    // Create the directory if it does not exist
    fs.mkdirSync(config.logging.logfolderPathName);
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'verbose',
            name: 'verbose',
            dirname : config.logging.logfolderPathName,
            filename:  config.logging.verboseLogFileName,
            handleExceptions: true,
            json: true,
            datePattern: 'yyyyMMdd.',
            prepend: true,
            maxsize: 5242880, //5MB
            //maxFiles: 50,
            colorize: false,
            timestamp: function() {
                return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            }
        }),
        new winston.transports.DailyRotateFile({
            name: 'error',
            level: 'error',
            dirname : config.logging.logfolderPathName,
            filename: config.logging.errorLogFileName,
            handleExceptions: true,
            json: true,
            datePattern: 'yyyyMMdd.',
            prepend: true,
            maxsize: 5242880, //5MB
            //maxFiles: 50,
            colorize: false,
            timestamp: function() {
                return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            }
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: function() {
                return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            }
        })
    ],
    exitOnError: false
});

logger.rewriters.push(function (level, msg, meta) {
    var session = cls.getNamespace('uniqueRequest');
    if(session){
        meta.RequestId = session.get('RequestId');
    }

    return meta;
});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.verbose(message);
    }
};