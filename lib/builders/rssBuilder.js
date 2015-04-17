'use strict';

var RSS = require('rss');
var lodash = require('lodash');
var isEmpty = lodash.isEmpty;

module.exports = {

    buildShortRssFeed: function(site, items) {
        var feed = new RSS(this.getSiteFeedOptions(site));

        if (!isEmpty(items)) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var description = (!!item['contentSummary_t'] ? item['contentSummary_t'] : item['contentTitle_t']);

                var feedItem = {
                    title: item['contentTitle_t'],
                    description: description,
                    url: item['siteUrl_t'] + item['url_t']
                };

                if (!!item['contentImageUrl_t']) {
                    feedItem.enclosure = {
                        url: item['contentImageUrl_t']
                    };
                }

                feed.item(feedItem);
            }
        }
        return feed;
    },

    getSiteFeedOptions: function(site) {
        // eventually need to convert to handle different options for different sites

        var feedOptions = {
            title: "Recipes, Celebrity News, Diet, Living, Family, Food Recipes : Australian Women's Weekly",
            site_url: 'http://www.aww.com.au/', // TODO figure out how to grab the correct URL per environment
            description: "Food Recipes, Latest Recipe Collections, Celebrity News, Diet, Living, Family, Parenting, Relationships, Style - Australian Women’s Weekly.",
            copyright: (new Date()).getFullYear() + ' BAUER MEDIA PTY LIMITED',
            ttl: 60
        };

        return feedOptions;
    }
};
