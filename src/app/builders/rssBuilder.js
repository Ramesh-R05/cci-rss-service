import RSS from '@bxm/rss-builder';

function getDataSource(dataSources, key) {
    for (var i = 0; i < dataSources.length; i++) {
        var source = dataSources[i];
        if (source.key.toLowerCase() === key.toLowerCase()) {
            return source.data;
        }
    }
    return null;
}

export function buildFeed(dataSources) {
    const channelData = getDataSource(dataSources, "channel");

    if (channelData && channelData.length > 0) {

        var feed = new RSS(channelData[0]);

        var itemsData = getDataSource(dataSources, "items");

        if (itemsData && itemsData.length > 0) {
            itemsData.forEach(item => feed.item(item));
        }
        return feed;
    }

    throw new Error('Channel data not set.')
};
