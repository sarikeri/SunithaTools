var winston = require('winston');
require('winston-daily-rotate-file');
var fs = require('fs');
var config = require('./../oapConfig');
var moment = require('moment-timezone');
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
            filename: config.logging.logfolderPathName + "\\" + config.logging.verboseLogFileName,
            handleExceptions: true,
            json: false,
            datePattern: 'yyyyMMdd',
            prepend: true,
            maxsize: 5242880, //5MB
            colorize: false,
            formatter: customFileFormatter,
            timestamp: function () {
                return moment().format("MM-DD-YYYY HH:mm:ss.SSS");
            }
        }),
        new winston.transports.DailyRotateFile({
            level: 'info',
            name: 'info',
            filename: config.logging.logfolderPathName + "\\" + config.logging.infoLogFileName,
            handleExceptions: true,
            json: false,
            datePattern: 'yyyyMMdd',
            prepend: true,
            maxsize: 5242880, //5MB
            colorize: false,
            formatter: customFileFormatter,
            timestamp: function () {
                return moment().format("MM-DD-YYYY HH:mm:ss.SSS");
            }
        }),
        new winston.transports.DailyRotateFile({
            name: 'error',
            level: 'error',
            filename: config.logging.logfolderPathName + "\\" + config.logging.errorLogFileName,
            handleExceptions: true,
            json: false,
            datePattern: 'yyyyMMdd',
            prepend: true,
            maxsize: 5242880, //5MB
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
    return `${options.timestamp()}, ${options.level}, ${(options.message ? options.message : '') 
    + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')}`;
}