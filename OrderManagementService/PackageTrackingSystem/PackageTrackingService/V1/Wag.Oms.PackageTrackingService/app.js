var logger = require('./utils/logger.js');
var dbAccess = require('./dalRepositories/dbAccess.js');
var dbClient = new dbAccess();

dbClient.createPool().then(function (result) {
    initApp();
})
    .catch(function (err) {
        logger.error('Error occurred creating database connection pool', err);
        console.log('Exiting process');
        process.exit(0);
    });

function initApp(){
    var express = require('express');
    var path = require('path');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var Config = require('./config.js');
    var moment = require('moment-timezone');
    var routes = require('./routes/index');
    var heartbeat = require('./routes/heartBeatInstance');
    var trackingDetail = require('./routes/trackingDetailInstance');
    var trackingsubscriptions = require('./routes/trackingsubscriptionsInstance');
    var addRequestId = require('express-request-id')();
    var common = require('./utils/common.js');
    var app = express();
    var cls = require('continuation-local-storage');
    var session = cls.createNamespace('uniqueRequest');

    app.use(addRequestId);
    app.use(function initializeContinuationLocalStorage(req, res, next) {
        session.bindEmitter(req);
        session.bindEmitter(res);

        session.run(function () {
            next();
        });
    });

    // Log request response
    app.use(logRequestResponseBody);

    morgan.token('date', function () {
        return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    })
    app.use(morgan('combined', { "stream": logger.stream }));

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(bodyParser.text());
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/PackageTrackingService/V1/', routes);
    app.use('/PackagetrackingService/V1/heartbeat', heartbeat);
    app.use('/PackagetrackingService/V1/trackingdetail', trackingDetail);
    app.use('/PackagetrackingService/V1/trackingsubscriptions', trackingsubscriptions);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    //Start: log response
    function logRequestResponseBody(req, res, next) {
        var body = "";
        session.set('RequestId', req.id);

        var requestObject={};
        requestObject.RequestMethod = req.method;
        requestObject.RequestUri = req.originalUrl;
        requestObject.RequestHeaders = req.headers;

        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {
            requestObject.RequestBody = body ? common.isJson(body) ? JSON.parse(body) : body : body;
            logger.verbose("request", requestObject);
        });

        var oldWrite = res.write,
            oldEnd = res.end,
            chunks = [];

        res.write = function (chunk) {
            chunks.push(chunk);

            oldWrite.apply(res, arguments);
        };

        res.end = function (chunk) {
            if (chunk)
                chunks.push(chunk);

            var body = Buffer.concat(chunks).toString('utf8');
            var responseObject={};
            responseObject.Body = body;
            logger.verbose("response:", responseObject);

            oldEnd.apply(res, arguments);
        };

        next();
    }
    //End: log response

    app.set('port', process.env.PORT || Config.app_server.port);
    app.listen(app.get('port'));
    console.log('Express server listening on port ' + app.get('port'));
}