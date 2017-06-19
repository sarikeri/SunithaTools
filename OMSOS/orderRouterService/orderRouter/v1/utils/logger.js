var winston = require('winston');
require('winston-daily-rotate-file');
var config = require('../config');
var moment = require('moment-timezone');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'verbose',
            name: 'verbose',
            filename: config.logging.infoLogFileName,
            handleExceptions: true,
            json: false,
            prepend: true,
            datePattern: 'yyyyMMdd',
            maxsize: 5242880, //5MB
            maxFiles: 60,
            colorize: false,
            formatter: customFileFormatter,
            timestamp: function () {
                return moment().format("MM-DD-YYYY HH:mm:ss.SSS");
            }
        }),
        new winston.transports.DailyRotateFile({
            name: 'error',
            level: 'error',
            filename: config.logging.exceptionLogFileName,
            handleExceptions: true,
            json: false,
            prepend: true,
            datePattern: 'yyyyMMdd',
            maxsize: 5242880, //5MB
            maxFiles: 60,
            colorize: false,
            formatter: customFileFormatter,
            timestamp: function () {
                return moment().format("MM-DD-YYYY HH:mm:ss.SSS");
            }
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: function () {
                return moment().format("MM-DD-YYYY HH:mm:ss.SSS");
            }
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.verbose(message);
    }
};

function customFileFormatter(options) {
    // Return string will be passed to logger.
    return `{"timestamp": "${options.timestamp()}", "level": "${options.level}", "message": "${(options.message ? options.message : '')
        + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')}"}`;
}