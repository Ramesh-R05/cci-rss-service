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
    if (config && config.value)
    {
        return config.value;
    }

    if(config && config.map)
    {
        return map(config.map, mapData, config.default, config.afterMap);
    }

    if (config && config.mapArray)
    {
        return mapArray(config.mapArray, mapData, config.default, config.afterMap);
    }

    if(config && config.mapObject)
    {
        return mapObject(config.mapObject, mapData);
    }

    if (config && config.mapObjectArray)
    {
        return mapObjectArray(config.mapObjectArray, mapData);
    }
}

var map = function (config, mapData, defaultValue, postMapFunctions)
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

    if (postMapFunctions)
    {
        postMapFunctions.forEach(function (item, i, arr) {
            var fn = utils.compileFunction(item, mapData, [val]);
            val = fn.execute();
        });
    }

    return val;
}

var mapArray = function (config, mapData, defaultValue, postMapFunctions)
{
    var arr = [];

    if (config && config instanceof Array)
    {
        for (var i = 0; i < config.length; i++)
        {
            var mapKey = config[i];
            arr.push(map(mapKey, mapData, defaultValue, postMapFunctions));
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

var mapValue = function(config, mapData, defaultValue)
{
    if (typeof config === 'string')
    {
      return utils.getProperty(config, mapData, defaultValue);
    }
    else if (utils.isFunctionConfig(config)) {
        var fn = utils.compileFunction(config, mapData);
        return fn.execute();
    }
    else {
        return defaultValue;
    }
}


module.exports = {

    mapSolrData: mapSolrData

}