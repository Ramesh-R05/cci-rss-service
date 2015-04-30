'use strict';

var mimeTypes = require('../../config/mimeTypes');
var stringHelper = require('./stringHelper');
var path = require('path');

var getType = function(filePath)
{
    if (filePath && filePath.length > 0)
    {
        var parts = stringHelper.split(filePath, '?', true);
        var ext = path.extname(parts[0]);

        for(var i = 0; i < mimeTypes.length; i++)
        {
            var item = mimeTypes[i];

            if(item.suffix === ext)
            {
                return item.type;
            }
        }
    }
    
    return '';
}

module.exports = {

    getType: getType

}