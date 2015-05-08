'use strict';

var express = require('express');
var rssRouteHandler = require('./rssRouteHandler');

var router = express.Router();

router.route(/^\/([\w-]+)\/?([\w-]+(\/[\w-]+)*)?\/?$/).get(function (req, res) {
    rssRouteHandler.route(req, res);
});

module.exports = router;
