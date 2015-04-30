'use strict';

var RSS = require('@bxm/rss-builder');
var lodash = require('lodash');
var isEmpty = lodash.isEmpty;

var getDataSource = function(dataSources, key)
{
    for (var i = 0; i < dataSources.length; i++)
    {
        var source = dataSources[i];

        if(source.key.toLowerCase() === key.toLowerCase())
        {
            return source.data;
        }
    }

    return null;
}

module.exports = {

    buildFeed: function(dataSources)
    {
        var channelData = getDataSource(dataSources, "channel");

        if(!isEmpty(channelData) && channelData.length > 0)
        {
            var feed = new RSS(channelData[0]);

            var itemsData = getDataSource(dataSources, "items");
   
            if (!isEmpty(itemsData) && itemsData.length > 0)
            {
                for (var i = 0; i < itemsData.length; i++)
                {
                    feed.item(itemsData[i]);
                }
            }

            return feed;
        }
        else {
            throw new Error('Channel data not set.')
        }
       
    }

};
