'use strict';

var configManager = {

    getSiteConfig: function(site)
    {
        /* Todo: return site specific config */
        return config;
    }

}

module.exports = {

    config: function (site) {
        return configManager.getSiteConfig(site);
    }
    
}