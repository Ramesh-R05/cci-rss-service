import mustache from 'mustache';
import config from 'config';

let cache = {};

function bindConfigProperties(configs, bindingData) {
    for (let i in configs) {
        if ({}.hasOwnProperty.call(configs, i)) {
            let propVal = configs[i];

            if (!propVal) {
                continue;
            }

            if (typeof propVal === 'string') {
                if (configs[i] !== mustache.render(propVal, bindingData )) {
                    configs[i] = mustache.render(propVal, bindingData);
                }
                continue;
            }

            if (typeof propVal === 'object') {
                bindConfigProperties(propVal, bindingData);
            }
        }
    }
}

function getSiteConfig(site, props, environment) {
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
        let env = environment || process.env.NODE_ENV;
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

function clearCache() {
    cache = {};
}

export default {
    config: getSiteConfig,
    clearCache
};
