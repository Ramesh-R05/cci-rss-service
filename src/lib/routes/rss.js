'use strict';

var express = require('express');
var rssRouteHandler = require('./rssRouteHandler');

var router = express.Router();

router.route(/^\/([\w-]+)\/?([\w-]+(\/[\w-]+)*)?\/?$/).get(rssRouteHandler.route);

module.exports = router;
