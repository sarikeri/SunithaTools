var service = require("os-service");
var fs = require("fs");
var async = require("async");
var oracledb = require('oracledb');
process.env.UV_THREADPOOL_SIZE = 12;

var loadClientConfiguration = function (callback) {
    var clientConfigProvider = new clientConfigurationProvider();
    clientConfigProvider.getClientConfiguration()
        .then((result) => {
            callback(null, result);
        })
        .catch((err) => {
            logger.error(err);
            callback(err, null);
        });
}

var loadCarrierConfiguration = function (callback) {
    var carrierConfigProvider = new carrierConfigurationProvider();
    carrierConfigProvider.getCarrierConfiguration()
        .then((result) => {
            callback(null, result);
        })
        .catch((err) => {
            logger.error(err);
            callback(err, null);
        });
}

var loadEventConfiguration = function (callback) {
    var eventConfigProvider = new eventConfigurationProvider();
    eventConfigProvider.getEventConfiguration()
        .then((result) => {
            callback(null, result);
        })
        .catch((err) => {
            logger.error(err);
            callback(err, null);
        });
}

function usage() {
    console.log(`usage: node serviceInstaller --add PackageTrackingBackgroundService [username] [password]`);
    console.log(`       node serviceInstaller --PackageTrackingBackgroundService <name>`);
    console.log(`       node serviceInstaller --run`);
    process.exit(-1);
}

if (process.argv[2] == "--add" && process.argv.length >= 4) {
    var options = {
        programArgs: ["--run", "me"]
    };

    if (process.argv.length > 4)
        options.username = process.argv[4];

    if (process.argv.length > 5)
        options.password = process.argv[5];

    service.add(process.argv[3], options, function (error) {
        if (error)
            console.log(error.toString());
    });
} else if (process.argv[2] == "--remove" && process.argv.length >= 4) {
    service.remove(process.argv[3], function (error) {
        if (error)
            console.log(error.toString());
    });
} else if (process.argv[2] == "--run") {
    var logStream = fs.createWriteStream(process.argv[1] + ".log");

    service.run(logStream, function () {
        console.log('Stopping PackageTrackingBackgroundService');
        service.stop(0);
    });

    // Here is our long running code.
    // Load all the necessary configurations in parallel and then do the work.
    // Declare the required custom modules here. Doing this at the top of this file will NOT work. 
    var packageTrackingManager = require("./packageTrackingManager");
    var clientConfigurationProvider = require('./dataProviders/clientConfigurationProvider.js');
    var carrierConfigurationProvider = require('./dataProviders/carrierConfigurationProvider.js');
    var eventConfigurationProvider = require('./dataProviders/eventConfigurationProvider.js');
    var logger = require("./utils/logger.js");
    var config = require("./config.js");

    // Create the log directory if it does not exist
    if (!fs.existsSync(config.logging.logDirectory)) {
        fs.mkdirSync(config.logging.logDirectory);
    }
    logger.verbose('PackageTrackingBackgroundService starting');
    oracledb.createPool({
        user: config.databaseConnection.UserId,
        password: config.databaseConnection.Password,
        connectString: config.databaseConnection.TNSAlias,
        poolAlias: config.databaseConnection.connectionPoolAlias,
        poolMin: config.databaseConnection.connectionPoolMin,
        poolMax: config.databaseConnection.connectionPoolMax,
        poolTimeout: config.databaseConnection.connectionPoolTimeout
    }
        , (err, pool) => {
            if (err) {
                logger.error(`Failed to create DB connection pool ${err}`);
            }
            else {
                logger.verbose('Successfully created DB connection pool');

                async.parallel([loadClientConfiguration, loadCarrierConfiguration, loadEventConfiguration], function(err, results) {
                    if (err) {
                        logger.error(`Error loading configuration. ${err}`);
                    } else {
                        var trackingManager = new packageTrackingManager(results[0], results[1], results[2]);
                        trackingManager.doWork();
                    }
                });
            }
        });

} else {
    usage();
}