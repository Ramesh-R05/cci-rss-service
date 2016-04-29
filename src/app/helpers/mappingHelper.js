import utils from'../utils';

let mapDataItems = (mappingConfigs, dataItems, additionalMapData) => {
    let mappedItems = [];

    if (dataItems) {
        dataItems.forEach(mapData => {
            if (additionalMapData) {
                for (let j in additionalMapData) {
                    mapData[j] = additionalMapData[j];
                }
            }
            mappedItems.push(mapDataItem(mappingConfigs, mapData));
        });
    }

    return mappedItems;
};

let getMappingConfigurations = (mappingKeys, config) => {
    let mappingConfigs = [];

    mappingKeys.forEach(key => {
        let mappingKey = 'mappings.' + key;
        if (config.has(mappingKey)) {
            mappingConfigs.push(config.get(mappingKey));
        }
    });

    return mappingConfigs;
};

let mapSolrData = props => {
    let mapped = [];

    if (props.solrData) {
        let additionalMapData = {
            __request: props.request
        };

        props.solrData.forEach(source => {
            let mappingConfigs = getMappingConfigurations(source.mappings, props.config);
            mapped.push({
                key: source.key,
                data: mapDataItems(mappingConfigs, source.data, additionalMapData)
            });
        });
    }

    return mapped;
};


let mapDataItem = (mappingConfigs, mapData) => {
    let mapped = {};

    mappingConfigs.forEach(mapConfig => {
        for (let j in mapConfig) {
            mapped[j] = mapDataItemProperty(mapConfig[j], mapData);
        }
    });

    return mapped;
};

let mapDataItemProperty = (config, mapData) => {
    if (config && config.value) {
        return config.value;
    }

    if (config && config.map) {
        return map(config.map, mapData, config.default, config.afterMap);
    }

    if (config && config.mapArray) {
        return mapArray(config.mapArray, mapData, config.default, config.afterMap);
    }

    if(config && config.mapObject) {
        return mapObject(config.mapObject, mapData);
    }

    if (config && config.mapObjectArray) {
        return mapObjectArray(config.mapObjectArray, mapData);
    }
};

let map = (config, mapData, defaultValue, postMapFunctions) => {
    let val = '';

    if (!defaultValue) {
        defaultValue = '';
    }

    if (config && config instanceof Array) {
        for(let i = 0; i < config.length; i++){
            let mapKey = config[i];
            val = mapValue(mapKey, mapData, defaultValue);
            if(val !== defaultValue){
                break;
            }
        }
    } else {
        val = mapValue(config, mapData, defaultValue);
    }

    if (postMapFunctions) {
        postMapFunctions.forEach(item => {
            let fn = utils.compileFunction(item, mapData, [val]);
            val = fn.execute();
        });
    }

    return val;
};

let mapArray = (config, mapData, defaultValue, postMapFunctions) => {
    let arr = [];

    if (config && config instanceof Array) {
        config.forEach(mapKey => {
            arr.push(map(mapKey, mapData, defaultValue, postMapFunctions));
        });
    }

    return arr;
};

let mapObject = (config, mapData) => {
    let obj = {};

    for (let i in config) {
        obj[i] = mapDataItemProperty(config[i], mapData);
    }

    return obj;
};

let mapObjectArray = (config, mapData) => {
    let arr = [];
    let obj = mapObject(config, mapData);

    for (let i in obj) {
        let o = {};
        o[i] = obj[i];
        arr.push(o);
    }

    return arr;
};

let mapValue = (config, mapData, defaultValue) => {
    if (typeof config === 'string') {
        return utils.getProperty(config, mapData, defaultValue);
    } else if (utils.isFunctionConfig(config)) {
        let fn = utils.compileFunction(config, mapData);
        return fn.execute();
    }
    return defaultValue;
};

export default {
    mapSolrData,
    map,
    mapArray,
    mapObject,
    mapObjectArray,
    mapValue
};
