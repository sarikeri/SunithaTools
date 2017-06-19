var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config.js');
var routes = require('./routes/orderRouter');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));

//app.use(require('stylus').middleware(path.join(__dirname, 'public')));

app.use('/orderRouter/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');    
    err.status = 404;
    next(err);
});
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT || config.app_server.port);
app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
