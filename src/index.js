require('@bxm/node-logger')('RSS SERVICE', process.env.NODE_ENV);
var express = require('express');
var bodyParser = require('body-parser');
var rssRoutes = require('./app/routes/rss');
global.config = require('config');

var version = require('./version');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.use(function(req, res, next) {
    console.log(req.method + ': ' + req.url);
    next();
});

/* ---------- ROUTE APIS ---------- */
app.use('/rss', rssRoutes); //all routes prefix with 'rss'

/* ---------- AWS LOAD BALANCER ---------- */
app.get('/api/verifysite', function (req, res) {
    res.json({ isVerified: true, verifiedMessage: "Verified", source: "service" });
});


/* ---------- Version information ---------- */
app.get('/version', function(req, res) {
    res.json(version);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

app.listen(PORT, function() {
    console.log('Started at port: ' + PORT);
}).on('error', function(err) {
    if(err.errno === 'EADDRINUSE') {
        console.error('Port ' + PORT + ' already in use');
    } else {
        throw err;
    }
});