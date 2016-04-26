import stringHelper from  './helpers/stringHelper';
import functions from './functions';

var getProperty = function (propName, obj, defaultValue) {
    try {
        var parts = stringHelper.split(propName, '.', true);
        var prop = obj;

        parts.forEach(function (part) {
            prop = prop[part];
        });

        if (prop && prop !== obj) {
            return prop
        }
    }
    catch (err) { }

    return defaultValue;
};

var compileFunction = function (config, data, additionalParams) {
    var fn = {
        func: function () {
            return '';
        },
        params: [],
        scope: this,
        execute: function () {
            return this.func.apply(this.scope, this.params);
        }
    };

    if (config && config.fn) {

        var fnInfo = getFunctionInfo(config);

        if (fnInfo) {
            fn.func = fnInfo.func;
            fn.scope = fnInfo.scope;
            if (config.params) {
                config.params.forEach(function (param) {
                    fn.params.push(compileFunctionParameter(param, data))
                });
            }
            if (isArray(additionalParams)) {
                fn.params = fn.params.concat(additionalParams);
            }
        }
    }

    return fn;
};

var compileFunctionParameter = function (param, data) {
    if (typeof param === 'string') {
        return bindParameterValue(param, data);
    }

    if (isFunctionConfig(param)) {
        return compileFunction(param, data).execute();
    }

    if (param && typeof param === 'object') {
        var obj = isArray(param) ? [] : {};
        for (var i in param) {
            obj[i] = compileFunctionParameter(param[i], data);
        }
        return obj;
    }

    return param;
};

var bindParameterValue = function (bindingKey, bindingData) {
    var val = bindingKey;

    if (bindingKey.length > 1 && bindingKey.indexOf('@') === 0) {
        val = getProperty(bindingKey.substring(1), bindingData, '');
    }

    return val;
};

var getFunctionInfo = function (config) {
    var info = {
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
    }
    else {
        var fn = functions[config.fn];
        if (isFunction(fn)) {
            info.scope = functions;
            info.func = fn;
            return info;
        }
        else {
            for(var i in functions) {
                var scope = functions[i];
                var fn = scope[config.fn];
                if (isFunction(fn)) {
                    info.scope = scope;
                    info.func = fn;
                    return info;
                }
            }
        }
    }

    return null;
}

var isFunction = function(obj) {
    return (obj && typeof obj === 'function');
};

var isFunctionConfig = function(obj) {
    return (obj && obj.fn && typeof obj.fn === 'string');
};

var isArray = function(obj) {
    return (obj && obj instanceof Array);
};

export default {
    getProperty,
    compileFunction,
    isFunction,
    isFunctionConfig,
    isArray,
    functions
};