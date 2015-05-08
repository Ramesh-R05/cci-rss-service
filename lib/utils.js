'use strict';

var stringHelper = require('./helpers/stringHelper');

var getProperty = function (propName, obj, defaultValue)
{
    try {
        var parts = stringHelper.split(propName, '.', true);
        var prop = obj;

        for (var i = 0; i < parts.length; i++) {
            prop = prop[parts[i]];
        }

        if (prop && prop !== obj) {
            return prop
        }
    }
    catch (err) { }

    return defaultValue;
}

module.exports = {

    getProperty: getProperty

}