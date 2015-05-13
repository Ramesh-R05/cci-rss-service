'use strict';

var stringHelper = require('./stringHelper');
var mapFunctions = require('./mappingFunctions');
var utils = require('../utils');

var mapSolrData = function(props)
{
    var mapped = [];

    if (props.solrData)
    {
        var additionalMapData = {
            __request: props.request
        };

        for(var i = 0; i < props.solrData.length; i++)
        {
            var source = props.solrData[i];
            var mappingConfigs = getMappingConfigurations(source.mappings, props.config);

            mapped.push({
                key: source.key,
                data: mapDataItems(mappingConfigs, source.data, additionalMapData)
            });
        }
    }

    return mapped;
}

var getMappingConfigurations = function (mappingKeys, config) {

    var mappingConfigs = [];

    for (var i = 0; i < mappingKeys.length; i++) {

        var key = mappingKeys[i];

        try {

            var mapConfig = config.get('mappings.' + key);

            if (mapConfig) {
                mappingConfigs.push(mapConfig);
            }
            else {
                throw new Error('Mapping configuration not found for key: ' + key);
            }
        }
        catch (err) {
            console.error('[ERROR] ' + err.message);
        }
    }

    return mappingConfigs;
}

var mapDataItems = function(mappingConfigs, dataItems, additionalMapData)
{
    var mappedItems = [];

    for (var i = 0; i < dataItems.length; i++)
    {
        var mapData = dataItems[i];

        if (typeof additionalMapData !== 'undefined' && additionalMapData)
        {
            for(var j in additionalMapData)
            {
                mapData[j] = additionalMapData[j];
            }
        }

        mappedItems.push(mapDataItem(mappingConfigs, dataItems[i]));
    }

    return mappedItems;
}

var mapDataItem = function (mappingConfigs, mapData)
{
    var mapped = {};

    for (var i = 0; i < mappingConfigs.length; i++)
    {
        var mapConfig = mappingConfigs[i];

        for(var j in mapConfig)
        {
            mapped[j] = mapDataItemProperty(mapConfig[j], mapData);
        }
    }

    return mapped;
}

var mapDataItemProperty = function (config, mapData)
{
    if (typeof config.value !== 'undefined' && config.value)
    {
        return config.value;
    }

    if(typeof config.map !== 'undefined' && config.map)
    {
        return map(config.map, mapData, config.format, config.default, config.after);
    }

    if (typeof config.mapArray !== 'undefined' && config.mapArray)
    {
        return mapArray(config.mapArray, mapData, config.format, config.default, config.after);
    }

    if(typeof config.mapObject !== 'undefined' && config.mapObject)
    {
        return mapObject(config.mapObject, mapData);
    }

    if (typeof config.mapObjectArray !== 'undefined' && config.mapObjectArray)
    {
        return mapObjectArray(config.mapObjectArray, mapData);
    }
}

var map = function (config, mapData, format, defaultValue, postMapFunctions)
{
    var val = '';

    if (!defaultValue)
    {
        defaultValue = '';
    }

    if (config && config instanceof Array)
    {
        for(var i = 0; i < config.length; i++)
        {
            var mapKey = config[i];

            val = mapValue(mapKey, mapData, defaultValue);

            if(val !== defaultValue)
            {
                break;
            }
        }
    }
    else {
        val = mapValue(config, mapData, defaultValue);
    }

    if (format && format.length > 0 && val !== defaultValue)
    {
        val = mapFunctions.formatString(format, val);
    }

    if (postMapFunctions)
    {
        postMapFunctions.forEach(function (item, i, arr) {
            var fn = mapFunctions[item];
            if (fn) {
                val = fn(val);
            }
        });
    }

    return val;
}

var mapArray = function (config, mapData, format, defaultValue, postMapFunctions)
{
    var arr = [];

    if (config && config instanceof Array)
    {
        for (var i = 0; i < config.length; i++)
        {
            var mapKey = config[i];
            arr.push(map(mapKey, mapData, format, defaultValue, postMapFunctions));
        }
    }

    return arr;
}

var mapObject = function (config, mapData)
{
    var obj = {};

    for (var i in config)
    {
        obj[i] = mapDataItemProperty(config[i], mapData);
    }

    return obj;

}

var mapObjectArray = function (config, mapData)
{
    var arr = [];

    var obj = mapObject(config, mapData);

    for (var i in obj) {
        var o = {};
        o[i] = obj[i];

        arr.push(o);
    }

    return arr;
}

var mapValue = function(mapKey, mapData, defaultValue)
{
    if (typeof mapKey === 'string')
    {
        var fn = compileMappingFunction(mapKey, mapData, [mapData]);

        if (fn) {
            return fn.execute();
        }
        else {
            return utils.getProperty(mapKey, mapData, defaultValue);
        }
    }
    else {
        return mapKey;
    }
}

var compileMappingFunction = function(fnStr, bindingData, additionalParams)
{
    var fn = stringHelper.parseFunction(fnStr);

    if (fn.name.length > 0)
    {
        var mapFunc = mapFunctions[fn.name];

        if (typeof mapFunc === 'function')
        {
            var params = fn.params;

            if (bindingData)
            {
                var boundParams = [];

                for (var i = 0; i < params.length; i++)
                {
                    boundParams.push(mapValue(params[i], bindingData, params[i]))
                }

                params = boundParams;
            }
            
            if (additionalParams && additionalParams instanceof Array)
            {
                params = params.concat(additionalParams);
            }

            var fn = {
                func: mapFunc,
                params: params,
                scope: mapFunctions,
                execute: function()
                {
                    return this.func.apply(this.scope, this.params);
                }
            }

            return fn;
        }
    }

    return null;
}

module.exports = {

    mapSolrData: mapSolrData

}