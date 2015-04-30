'use strict';

var NodeCache = require('node-cache');
var utils = require('../utils');

var cache = new NodeCache();
var cacheDuration = 900;

var configManager = {

    getSiteConfig: function(site, props)
    {
        var cacheKey = 'config_' + site;

        var siteConfig = cache.get(cacheKey);

        if (siteConfig === undefined)
        {
            var key = 'sites.' + site;

            siteConfig = config.util.cloneDeep(config);

            if (config.has(key)) {
                siteConfig = config.util.extendDeep(siteConfig, config.get(key));
            }

            if (typeof props !== 'undefined' && props) {
                this.bindConfigProperties(siteConfig, props);
            }

            cache.set(cacheKey, siteConfig, cacheDuration);

            return siteConfig;
        }

        return siteConfig;
    },

    bindConfigProperties: function(config, bindingData)
    {
        for(var i in config)
        {
            var propVal = config[i];

            if (!propVal) {
                continue;
            }

            if(typeof propVal === 'string')
            {
                config[i] = this.bindProperty(propVal, bindingData)
                continue;
            }

            if(typeof propVal === 'object')
            {
                this.bindConfigProperties(propVal, bindingData);
            }
        }
    },

    bindProperty: function(propVal, bindingData)
    {
        var matches = propVal.match(/{{.+}}/g);

        if(matches && matches.length > 0)
        {
            for (var i = 0; i < matches.length; i++)
            {
                var match = matches[i];
                propVal = propVal.replace(match, this.getBindingValue(match.replace(/[{}]+/g, ''), bindingData, ''));
            }
        }

        return propVal;
    },

    getBindingValue: function(bindingKey, bindingData, defaultValue)
    {
        return utils.getProperty(bindingKey, bindingData, defaultValue);
    }

}

module.exports = {

    config: function (site, props) {
        return configManager.getSiteConfig(site, props);
    }
    
}