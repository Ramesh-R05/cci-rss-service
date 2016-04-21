import mustache from 'mustache';
import utils from '../utils';
import config from 'config';

let cache = {};

let getSiteConfig = (site, props, environment) => {
    let cacheKey = 'config_' + site;
    let siteConfig = cache[cacheKey];

    if (siteConfig === undefined) {
        siteConfig = config.util.cloneDeep(config);

        let key = 'sites.' + site;
        
        //site specific config overrides
        if (config.has(key)) {
            siteConfig = config.util.extendDeep(siteConfig, config.get(key));
        }

        //site environment specific config overrides
        var env = environment || process.env.NODE_ENV;
        if (env) {
            key = key + '_' + env;
            if (config.has(key)) {
                siteConfig = config.util.extendDeep(siteConfig, config.get(key));
            }
        }

        if (props) {
            bindConfigProperties(siteConfig, props);
        }

        cache[cacheKey] = siteConfig;
        return siteConfig;
    }

    return siteConfig;
}

let bindConfigProperties = (config, bindingData) => {
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

let clearCache = () => {
    cache = {};
}

export default {
    config: getSiteConfig,
    clearCache
};
