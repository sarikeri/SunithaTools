let winston = require('winston'),
    fs = require('fs'),
    moment = require('moment-timezone');
    require('winston-daily-rotate-file');
let config = require('./config');
winston.emitErrs = true;

class Log {
    constructor() {
        if (!fs.existsSync(config.logging.logfolderPathName)) {
            // Create the directory if it does not exist
            fs.mkdirSync(config.logging.logfolderPathName);
        }


        this.logger = new winston.Logger({
            transports: [
                new winston.transports.DailyRotateFile({
                    level: 'error',
                    name: 'error',
                    filename: `${config.logging.logfolderPathName}\\${config.logging.verboseLogFileName}`,
                    datePattern: 'yyyy-MM-dd',
                    prepend: true,
                    handleExceptions: true,
                    timestamp: true,
                    statusLevels: true,
                    json: false,
                    maxFiles: 30,
                    maxsize: 5242880,
                    colorize: false
                }),
                new winston.transports.DailyRotateFile({
                    level: 'verbose',
                    name: 'verbose',
                    filename: `${config.logging.logfolderPathName}\\${config.logging.verboseLogFileName}`,
                    datePattern: 'yyyy-MM-dd',
                    prepend: true,
                    timestamp: true,
                    statusLevels: true,
                    handleExceptions: true,
                    json: false,
                    maxFiles: 30,
                    maxsize: 5242880,
                    colorize: false
                }),
                new winston.transports.Console({
                    level: 'error',
                    handleExceptions: true,
                    json: false,
                    colorize: true
                })
            ],
            //transports: [
            //    new winston.transports.DailyRotateFile({
            //        level: 'verbose',
            //        name: 'verbose',
            //        filename: `${config.logging.logfolderPathName}\\${config.logging.verboseLogFileName}`,
            //        handleExceptions: true,
            //        json: false,
            //        datePattern: '.yyyyMMdd',
            //        prepend: true,
            //        maxsize: 5242880, //5MB
            //        formatter: customFileFormatter,
            //        maxFiles: 60,
            //        colorize: false,
            //        timestamp: function () {
            //            return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            //        }
            //    }),
            //    new winston.transports.DailyRotateFile({
            //        name: 'error',
            //        level: 'error',
            //        filename: `${config.logging.logfolderPathName}\\${config.logging.errorLogFileName}`,
            //        handleExceptions: true,
            //        json: false,
            //        datePattern: '.yyyyMMdd',
            //        prepend: true,
            //        maxsize: 5242880, //5MB
            //        formatter: customFileFormatter,
            //        maxFiles: 40,
            //        colorize: false,
            //        timestamp: function () {
            //            return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            //        }
            //    }),
            //    new winston.transports.Console({
            //        level: 'debug',
            //        handleExceptions: true,
            //        json: false,
            //        colorize: true,
            //        timestamp: function () {
            //            return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            //        }
            //    })
            //],
            exitOnError: false
        });
    }
}
module.exports = new Log();

//function customFileFormatter(options) {
//    // Return string will be passed to logger.
//    return `{"timestamp": "${options.timestamp()}", "level": "${options.level}", "message": "${(options.message ? options.message : '')
//        + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')}"}`;
//}