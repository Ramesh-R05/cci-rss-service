'use strict';
require('@bxm/node-apm')('rss service', 'service');
require('babel/register')();

module.exports = require('./app/server')();