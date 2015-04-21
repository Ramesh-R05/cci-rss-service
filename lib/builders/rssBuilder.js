'use strict';

var RSS = require('rss');
var lodash = require('lodash');
var isEmpty = lodash.isEmpty;

function getSiteFeedOptions(data) {
    var feedOptions = {
        title: data['pageTitle_t'],
        site_url: data['siteUrl_t'],
        description: data['pageMetaDescription_t'],
        copyright: (new Date()).getFullYear() + ' BAUER MEDIA PTY LIMITED',
        ttl: 60
    };

    return feedOptions;
}

module.exports = {

    buildShortRssFeed: function(data) {
        var channelData = data[0];
        var itemsData = data[1];
        var feed = new RSS(getSiteFeedOptions(channelData));
        console.debug('RSS feed channel created');

        if (!isEmpty(itemsData)) {
            console.debug('RSS feed items created');

            for (var i = 0; i < itemsData.length; i++) {
                var item = itemsData[i];
                var description = item['pageMetaDescription_t'];

                var feedItem = {
                    title: item['pageTitle_t'],
                    description: description,
                    url: item['siteUrl_t'] + item['url_t']
                };

                if (!!item['contentImageUrl_t']) {
                    feedItem.enclosure = {
                        url: item['contentImageUrl_t'] + '?width=800'
                    };
                }

                feed.item(feedItem);
            }

            console.debug('RSS feed items completed');
        }
        return feed;
    }
};
