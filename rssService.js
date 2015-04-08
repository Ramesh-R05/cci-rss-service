var express = require('express'),
    bodyParser = require('body-parser'),
    rssRoutes = require('./routes/rss');

var app = express();

app.use(bodyParser.json);
app.use(function(req, res, next) {
  console.log('[RSS SERVICE] ' + req.method + ': ' + req.url);
  next();
});

/* ---------- ROUTE APIS ---------- */

app.use('/rss', rssRoutes); //all routes prefix with 'rss'

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8080, function() {
  console.log('[RSS SERVICE] started at port: 8080');
}).on('error', function(err) {
  if(err.errno === 'EADDRINUSE') {
    console.error('[RSS SERVICE] port 8080 already in use');
  } else {
    throw err;
  }
});
