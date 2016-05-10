import RSS from '@bxm/rss-builder';

function getDataSource(dataSources, key) {
    for (let i = 0; i < dataSources.length; i++) {
        let source = dataSources[i];
        if (source.key.toLowerCase() === key.toLowerCase()) {
            return source.data;
        }
    }
    return null;
}

function buildFeed(dataSources) {
    const channelData = getDataSource(dataSources, 'channel');

    if (channelData && channelData.length > 0) {
        let feed = new RSS(channelData[0]);

        let itemsData = getDataSource(dataSources, 'items');

        if (itemsData && itemsData.length > 0) {
            itemsData.forEach(item => feed.item(item));
        }
        return feed;
    }

    throw new Error('Channel data not set.');
}

export default {
    buildFeed
};
