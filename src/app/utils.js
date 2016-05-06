import stringHelper from './helpers/stringHelper';
import functions from './functions';

function getProperty(propName, obj, defaultValue) {
    try {
        let parts = stringHelper.split(propName, '.', true);
        let prop = obj;

        parts.forEach(part => {
            prop = prop[part];
        });

        if (prop && prop !== obj) {
            return prop;
        }
    } catch (err) {
        //Intentionally empty
    }

    return defaultValue;
}

function compileFunction(config, data, additionalParams) {
    let fn = {
        func: function() {
            return '';
        },
        params: [],
        scope: this,
        execute: function() {
            return this.func.apply(this.scope, this.params);
        }
    };

    if (config && config.fn) {
        let fnInfo = getFunctionInfo(config);
        if (fnInfo) {
            fn.func = fnInfo.func;
            fn.scope = fnInfo.scope;
            if (config.params) {
                config.params.forEach(param => {
                    fn.params.push(compileFunctionParameter(param, data));
                });
            }
            if (isArray(additionalParams)) {
                fn.params = fn.params.concat(additionalParams);
            }
        }
    }
    return fn;
}

function compileFunctionParameter(param, data) {
    if (typeof param === 'string') {
        return bindParameterValue(param, data);
    }

    if (isFunctionConfig(param)) {
        return compileFunction(param, data).execute();
    }

    if (param && typeof param === 'object') {
        let obj = isArray(param) ? [] : {};
        for (let i in param) {
            if (param.hasOwnProperty(i)) {
                obj[i] = compileFunctionParameter(param[i], data);
            }
        }
        return obj;
    }
    return param;
}

function bindParameterValue(bindingKey, bindingData) {
    let val = bindingKey;
    if (bindingKey.length > 1 && bindingKey.indexOf('@') === 0) {
        val = getProperty(bindingKey.substring(1), bindingData, '');
    }
    return val;
}

function getFunctionInfo(config) {
    let info = {
        scope: null,
        func: null
    };

    if (config.scope) {
        info.scope = getProperty(config.scope, functions, null);
    }

    if (info.scope) {
        info.func = info.scope[config.fn];
        if (isFunction(info.func)) {
            return info;
        }
    } else {
        let fn = functions[config.fn];
        if (isFunction(fn)) {
            info.scope = functions;
            info.func = fn;
            return info;
        }
        for (let i in functions) {
            if (functions.hasOwnProperty(i)) {
                let scope = functions[i];
                let f = scope[config.fn];
                if (isFunction(f)) {
                    info.scope = scope;
                    info.func = f;
                    return info;
                }
            }
        }
    }
    return null;
}

function isFunction(obj) {
    return (obj && typeof obj === 'function');
}

function isFunctionConfig(obj) {
    return (obj && obj.fn && typeof obj.fn === 'string');
}

function isArray(obj) {
    return (obj && obj instanceof Array);
}

export default {
    getProperty,
    compileFunction,
    isFunction,
    isFunctionConfig,
    isArray,
    functions
};
