'use strict';

var util = require('util');
var mimeTypeHelper = require('./mimeTypeHelper');
var markdownHelper = require('./markdownHelper');
var stringHelper = require('./stringHelper');
var mustache = require('mustache');
var _ = require('underscore');
var S = require('string');

var renderRecipeGroupHeading = function () {
    return function (text, render) {
        var txt = render(text);
        return txt ? '<h3>' + txt + '</h3>' : '';
    }
}

var renderRecipeIngredientQuantityAndMeasure = function () {
    return function (text, render) {
        var displayItems = [];
        var parts = render(text).split(':');
        var quantity = parts[0];
        var measure = parts[1];
        if (quantity) {
            displayItems.push(quantity);
        }
        if (measure) {
            var num = parseInt(quantity, 10);
            if (!isNaN(num) && num > 1) {
                if (measure.charAt(measure.length - 1) !== 's') {
                    measure = measure + 's';
                }
            }
            displayItems.push(measure);
        }
        return displayItems.length > 0 ? displayItems.join(' ') + ' ' : '';
    }
}

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
    
    mapRecipeIngredients: function (ingredientsData) {

        var html = [];

        try {
            var ingredientGroups = JSON.parse(ingredientsData);
            var groupHtml = [];
            var groupTemplate =
                '<div>' +
                    '{{#renderHeading}}{{heading}}{{/renderHeading}}' +
                    '<ul>' +
                        '{{#ingredients}}' +
                            '<li>' +
                                '{{#renderQuantityAndMeasure}}{{quantity}}:{{measure}}{{/renderQuantityAndMeasure}}' +
                                '{{food}}' +
                            '</li>' +
                        '{{/ingredients}}' +
                    '</ul>' +
                '</div>';

            ingredientGroups.forEach(function (group) {
                if (group && group.ingredients && group.ingredients.length > 0) {
                    group.renderHeading = renderRecipeGroupHeading;
                    group.renderQuantityAndMeasure = renderRecipeIngredientQuantityAndMeasure;
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
    },

    mapRecipeCookingMethod: function (methodData) {

        var html = [];

        try {
            var methodGroups = JSON.parse(methodData);
            var groupHtml = [];
            var groupTemplate =
                '<div>' +
                    '{{#renderHeading}}{{heading}}{{/renderHeading}}' +
                    '<ol>' +
                        '{{#methods}}' +
                            '<li>' +
                                '{{method}}' +
                            '</li>' +
                        '{{/methods}}' +
                    '</ol>' +
                '</div>';

            methodGroups.forEach(function (group) {
                if (group && group.methods && group.methods.length > 0) {
                    group.renderHeading = renderRecipeGroupHeading;
                    groupHtml.push(mustache.render(groupTemplate, group));
                }
            });

            if (groupHtml.length > 0) {
                html.push(
                    '<h2>Steps</h2>',
                    groupHtml.join('')
                );
            }
        }
        catch (err) {
            return '';
        }

        return html.join('');
    },

    mapRecipeServings: function (servingsData) {

        var html = [];

        try {
            var servings = JSON.parse(servingsData);
            if (servings.serves) html.push('<h4>Serves: ' + servings.serves + '</h4>');
            if (servings.yieldQuantity) {
                var quantity = parseFloat(servings.yieldQuantity);
                var measure = servings.yieldMeasure && servings.yieldMeasure.toLowerCase() !== 'item' ? servings.yieldMeasure.toLowerCase() : '';
                if (measure && !isNaN(quantity) && quantity > 1) {
                    measure = measure.charAt(measure.length - 1) !== 's' ? measure + 's' : measure;
                }
                html.push('<h4>Makes: ' + servings.yieldQuantity + (measure ? ' ' + measure : '') + '</h4>');
            }
        }
        catch (err) {
            return '';
        }

        return html.join('');
    },

    mapRecipeCookingTime: function (cookingTimeData) {

        var html = [];

        try {
            var cookingTimes = JSON.parse(cookingTimeData);
            if (cookingTimes.times) {
                cookingTimes.times.forEach(function (time) {
                    if (time.minutes) {

                        var timeParts = [];
                        var hours = Math.floor(time.minutes / 60);
                        var mins = time.minutes % 60;

                        timeParts.push(S(time.id).humanize().s + ' time:');

                        if (hours > 0) {
                            var unit = hours === 1 ? 'hour' : 'hours';
                            timeParts.push(hours + ' ' + unit);
                        }

                        if (mins > 0) {
                            if (mins >= 1) {
                                var unit = mins === 1 ? 'minute' : 'minutes';
                                timeParts.push(mins + ' ' + unit);
                            }
                            else {
                                var seconds = Math.round(mins * 60);
                                var unit = seconds === 1 ? 'second' : 'seconds';
                                timeParts.push(seconds + ' ' + unit);
                            }
                        }

                        if (time.label) {
                            timeParts.push(time.label);
                        }

                        html.push('<h4>' + timeParts.join(' ') + '</h4>');
                    }
                });
            }
        }
        catch (err) {
            return '';
        }

        return html.join('');
    },
    
    mapRecipeImage: function (imageUrl, width) {
        width = width || 800;
        return imageUrl
            ? '<div><img src="' + imageUrl + '?width=' + width + '" /></div>'
            : '';
    },

    mapRecipeTips: function (tipsData) {
        var html = [];
        if (tipsData) {
            html.push('<h3>Tips</h3>');
            var tips = stringHelper.split(tipsData, '\n', true);
            tips.forEach(function (tip) {
                html.push('<p>' + tip + '</p>');
            });
        }
        return html.join('');
    },

    mapRecipeSource: function (data) {

        switch (data.toLowerCase()) {

            case 'taste':
                data = 'Food To Love';
                break;

            case 'recipes plus':
                data = 'Recipes+';
                break;

            case 'commercial':
            case 'supplied':
                data = '';
                break;
        }

        return (data)
            ? '<h4>Recipe by: ' + data + '</h4>'
            : '';
    },

    mapRecipeProperty: function (label, data) {
        return data ? '<h4>' + label + ': ' + data + '</h4>' : '';
    }

}