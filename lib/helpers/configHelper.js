'use strict';

var mustache = require('mustache');
var utils = require('../utils');

var cache = {};

var configManager = {

    getSiteConfig: function(site, props)
    {
        var cacheKey = 'config_' + site;

        var siteConfig = cache[cacheKey];

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

            cache[cacheKey] = siteConfig;

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
                config[i] = mustache.render(propVal, bindingData);
                continue;
            }

            if(typeof propVal === 'object')
            {
                this.bindConfigProperties(propVal, bindingData);
            }
        }
    }

}

module.exports = {

    config: function (site, props) {
        return configManager.getSiteConfig(site, props);
    }
    
}