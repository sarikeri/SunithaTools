let winston = require('winston'),
    fs = require('fs'),
    moment = require('moment-timezone');
    require('winston-daily-rotate-file');
let config = require('../config.js');
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
            exitOnError: false
        });
    }
}
module.exports = new Log();
