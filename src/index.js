'use strict';
require('@bxm/node-apm')('entity service', 'service');
require('babel/register')();

module.exports = require('./app/server')();