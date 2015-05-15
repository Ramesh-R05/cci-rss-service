'use strict';

var util = require('util');
var mimeTypeHelper = require('./mimeTypeHelper');
var markdownHelper = require('./markdownHelper');
var stringHelper = require('./stringHelper');

module.exports = {

    sanitise: function (str) {

        if (str) {
          return stringHelper.stripMarkdown(stringHelper.stripHtml(str));
        }

        return '';
    },

    format: function (fmt, str) {

        if (str) {
            return util.format(fmt, str);
        }

        return '';
    },

    mapCopyright: function (mapData) {
        return (new Date()).getFullYear() + ' BAUER MEDIA PTY LIMITED'
    },

    mapItemUrl: function (siteUrl, url) {
        return siteUrl + url;
    },

    mapMimeType: function (imageUrl) {
        return mimeTypeHelper.getType(imageUrl);
    },

    mapCampaignType: function (campaignStr, matchType) {

        try {
            var campaign = JSON.parse(campaignStr);
            var type = campaign[0].campaignType;
            return (type.toLowerCase() === matchType.toLowerCase());
        }
        catch (err) { }

        return false;
    },

    mapCampaignSponsor: function (campaignStr) {

        try {
            var campaign = JSON.parse(campaignStr);
            var sponsor = campaign[0].sponsor;
            if (sponsor && sponsor.length > 0) {
                return sponsor;
            }
        }
        catch (err) { }

        return '';
    },

    mapFeedUrl: function (req) {
        return req.protocol + '://' + req.get('host') + req.originalUrl;
    },

    mapFullContent: function (contentUrl, contentJsonStr, mapSettingsStr) {

        var content = '';
        
        try {

            var contentJson = JSON.parse(contentJsonStr);
            var mapSettings = {};

            if (mapSettingsStr && typeof mapSettingsStr === 'string') {
                mapSettings = JSON.parse(mapSettingsStr);
            }

            var imgSettings = mapSettings.image || { width: 800 };

            contentJson.forEach(function (item) {
                if (item.type && item.content) {
                    switch (item.type) {
                        case 'paragraph':
                        case 'quote':
                            content += markdownHelper.renderParagraph(item.content);
                            break;
                        case 'heading':
                            content += '<h2>' + item.content + '</h2>';
                            break;
                        case 'image':
                            content += markdownHelper.renderImage(item.content, imgSettings);
                            break;
                        case 'video':
                            if (item.content.properties && item.content.properties.videoConfiguration && item.content.properties.videoConfiguration.brightcoveId) {
                                content += markdownHelper.renderParagraph(util.format('<a href="%s" target="_blank">Watch video</a>', contentUrl));
                            }
                            break;
                    }
                }
            });
        }
        catch (err) {
            content = '';
        }

        return content;
    }

}