﻿'use strict';

var util = require('util');
var mimeTypeHelper = require('./mimeTypeHelper');

module.exports = {

    formatString: function(fmt, str)
    {
        return util.format(fmt, str);
    },

    mapCopyright: function (mapData)
    {
        return (new Date()).getFullYear() + ' BAUER MEDIA PTY LIMITED'
    },

    mapItemUrl: function(siteUrl, url)
    {
        return siteUrl + url;
    },

    mapMimeType: function (imageUrl)
    {
        return mimeTypeHelper.getType(imageUrl);
    },

    mapCampaignType: function(campaignStr, matchType)
    {
        try {
            var campaign = JSON.parse(campaignStr);
            var type = campaign[0].campaignType;
            return (type.toLowerCase() === matchType.toLowerCase());
        }
        catch (err) { }

        return false;
    },

    mapCampaignSponsor: function(campaignStr)
    {
        try {
            var campaign = JSON.parse(campaignStr);
            var sponsor = campaign[0].sponsor;
            if(sponsor && sponsor.length > 0)
            {
                return sponsor;
            }
        }
        catch (err) { }

        return '';
    },

    mapFeedUrl: function(req)
    {
        return req.protocol + '://' + req.get('host') + req.originalUrl;
    }

}