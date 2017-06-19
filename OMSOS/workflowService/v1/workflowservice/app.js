let express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');
let routes = require('./routes/index'),
    config = require('./config'),
    log = require('./utils/logger');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(`/${config.baseUri}`, routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || config.app_server.port);
app.listen(app.get('port'));
let msg = `Express server listening on port ${app.get('port')}.`;
console.log(msg);
log.logger.verbose(msg);