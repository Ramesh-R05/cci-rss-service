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

app.listen(8080, function() {
  console.log('[RSS SERVICE] started at port: 8080');
}).on('error', function(err) {
  if(err.errno === 'EADDRINUSE') {
    console.error('[RSS SERVICE] port 8080 already in use');
  } else {
    throw err;
  }
});
