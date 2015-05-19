'use strict';

var util = require('util');
var mimeTypeHelper = require('./mimeTypeHelper');
var markdownHelper = require('./markdownHelper');
var stringHelper = require('./stringHelper');
var mustache = require('mustache');
var _ = require('underscore');

module.exports = {

    sanitise: function (str) {
        return str ? stringHelper.stripMarkdown(stringHelper.stripHtml(str)) : '';
    },

    format: function (fmt, str) {
        return  str ? util.format(fmt, str) : '';
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
    },

    mapTags: function (tagGroupList) {

        var tags = [];

        tagGroupList.forEach(function (item) {
            if (item && item instanceof Array) {
                item.forEach(function (tag) {
                    var tagLeaf = tag.split(':').slice(-1)[0];
                    if (tagLeaf) {
                        var cleanTag = tagLeaf.replace(/[\[\]{}"]/g, '').toLowerCase().trim();
                        if (cleanTag && !_.contains(cleanTag, tags)) {
                            tags.push(cleanTag);
                        }
                    }
                });
            }
        });

        return tags;

    },

    mapRecipeContent: function (recipeContentItems) {

        var content = [];

        if (recipeContentItems) {
            recipeContentItems.forEach(function (item) {
                if (item) {
                    content.push(item);
                }
            });
        }

        return content.join('');
    },
    
    mapRecipeIngredients: function(ingredientsData)
    {
        var html = [];

        try {

            var ingredients = JSON.parse(ingredientsData);

            var groupHtml = [];
            var groupTemplate =
                '<div>' +
                    '{{#renderHeading}}{{heading}}{{/renderHeading}}' +
                    '<ul>' +
                        '{{#ingredients}}' +
                            '<li>' +
                                '{{#renderQuantityAndMeasure}}{{quantity}}:{{measure}}{{/renderQuantityAndMeasure}} ' +
                                '{{food}}' +
                            '</li>' +
                        '{{/ingredients}}' +
                    '</ul>' +
                '</div>';

            ingredients.forEach(function (group) {

                if (group && group.ingredients && group.ingredients.length > 0) {

                    group.renderHeading = function () {
                        return function (text, render) {
                            var txt = render(text);
                            return txt ? '<h3>' + txt + '</h3>' : '';
                        }
                    };
                    
                    group.renderQuantityAndMeasure = function () {
                        return function (text, render) {
                            var displayItems = [];
                            var parts = render(text).split(':');
                            var quantity = parts[0];
                            var measure = parts[1];
                            if (quantity) {
                                displayItems.push(quantity);
                                if (measure) {
                                    var num = parseInt(quantity, 10);
                                    if (!isNaN(num) && num > 1) {
                                        if (measure.charAt(measure.length - 1) !== 's') {
                                            measure = measure + 's';
                                        }
                                    }
                                    displayItems.push(measure);
                                }
                            }
                            return displayItems.join(' ');
                        }
                    };

                    groupHtml.push(mustache.render(groupTemplate, group));
                }
            });

            if (groupHtml.length > 0) {
                html.push(
                    '<h2>Ingredients</h2>',
                    groupHtml.join('')
                );
            }
        }
        catch (err) {
            return '';
        }

        return html.join('');
    }

}