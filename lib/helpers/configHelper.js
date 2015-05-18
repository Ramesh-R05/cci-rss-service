'use strict';

var mustache = require('mustache');
var utils = require('../utils');

var cache = {};


var getSiteConfig = function (site, props) {

    var cacheKey = 'config_' + site;

    var siteConfig = cache[cacheKey];

    if (siteConfig === undefined) {

        var key = 'sites.' + site;

        siteConfig = config.util.cloneDeep(config);

        if (config.has(key)) {
            siteConfig = config.util.extendDeep(siteConfig, config.get(key));
        }

        if (props) {
            bindConfigProperties(siteConfig, props);
        }

        cache[cacheKey] = siteConfig;

        return siteConfig;
    }

    return siteConfig;
}

var bindConfigProperties = function (config, bindingData) {

    for (var i in config) {

        var propVal = config[i];

        if (!propVal) {
            continue;
        }

        if (typeof propVal === 'string') {
            config[i] = mustache.render(propVal, bindingData);
            continue;
        }

        if (typeof propVal === 'object') {
            bindConfigProperties(propVal, bindingData);
        }
    }
}

var clearCache = function () {
    cache = {};
}

module.exports = {
    config: getSiteConfig,
    clearCache: clearCache
}