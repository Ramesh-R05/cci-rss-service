import util from 'util';
import mimeTypeHelper from './mimeTypeHelper';
import markdownHelper from './markdownHelper';
import stringHelper from './stringHelper';
import mustache from 'mustache';
import _ from 'underscore';
import s from 'string';

let renderRecipeGroupHeading = () => {
    return (text, render) => {
        let txt = render(text);
        return txt ? '<h3>' + txt + '</h3>' : '';
    };
};

let renderRecipeIngredientQuantityAndMeasure = () => {
    return (text, render) => {
        let displayItems = [];
        let parts = render(text).split(':');
        let quantity = parts[0];
        let measure = parts[1];
        if (quantity) {
            displayItems.push(quantity);
        }
        if (measure) {
            let num = parseInt(quantity, 10);
            if (!isNaN(num) && num > 1) {
                if (measure.charAt(measure.length - 1) !== 's') {
                    measure = measure + 's';
                }
            }
            displayItems.push(measure);
        }
        return displayItems.length > 0 ? displayItems.join(' ') + ' ' : '';
    };
};

export default {
    sanitise(str) {
        return str ? stringHelper.stripMarkdown(stringHelper.stripHtml(str)) : '';
    },

    format(fmt, str) {
        return str ? util.format(fmt, str) : '';
    },

    mapCopyright() {
        return (new Date()).getFullYear() + ' BAUER MEDIA PTY LIMITED';
    },

    mapItemUrl(siteUrl, url) {
        return siteUrl + url;
    },

    mapMimeType(imageUrl) {
        return mimeTypeHelper.getType(imageUrl);
    },

    mapCampaignType(campaignStr, matchType) {
        try {
            let campaign = JSON.parse(campaignStr);
            let type = campaign[0].campaignType;
            return (type.toLowerCase() === matchType.toLowerCase());
        } catch (err) {
            //Intentionally empty
        }

        return false;
    },

    mapCampaignSponsor(campaignStr) {
        try {
            let campaign = JSON.parse(campaignStr);
            let sponsor = campaign[0].sponsor;
            if (sponsor && sponsor.length > 0) {
                return sponsor;
            }
        } catch (err) {
            //Intentionally empty
        }

        return '';
    },

    mapFeedUrl(req) {
        return req.protocol + '://' + req.get('host') + req.originalUrl;
    },

    mapFullContent(contentUrl, contentJsonStr, mapSettingsStr) {
        let content = '';
        try {
            let contentJson = JSON.parse(contentJsonStr);
            let mapSettings = {};

            if (mapSettingsStr && typeof mapSettingsStr === 'string') {
                mapSettings = JSON.parse(mapSettingsStr);
            }

            let imgSettings = mapSettings.image || { width: 800 };

            contentJson.forEach(item => {
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
                        default:
                            break;
                    }
                }
            });
        } catch (err) {
            content = '';
        }

        return content;
    },

    mapTags(tagGroupList) {
        let tags = [];

        tagGroupList.forEach(item => {
            if (item && item instanceof Array) {
                item.forEach(tag => {
                    let tagLeaf = tag.split(':').slice(-1)[0];
                    if (tagLeaf) {
                        let cleanTag = tagLeaf.replace(/[\[\]{}"]/g, '').toLowerCase().trim();
                        if (cleanTag && !_.contains(cleanTag, tags)) {
                            tags.push(cleanTag);
                        }
                    }
                });
            }
        });

        return tags;
    },

    mapRecipeContent(recipeContentItems) {
        let content = [];

        if (recipeContentItems) {
            recipeContentItems.forEach(item => {
                if (item) {
                    content.push(item);
                }
            });
        }
        return content.join('');
    },

    mapRecipeIngredients(ingredientsData) {
        let html = [];
        try {
            let ingredientGroups = JSON.parse(ingredientsData);
            let groupHtml = [];
            let groupTemplate =
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

            ingredientGroups.forEach(group => {
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
        } catch (err) {
            return '';
        }

        return html.join('');
    },

    mapRecipeCookingMethod(methodData) {
        let html = [];
        try {
            let methodGroups = JSON.parse(methodData);
            let groupHtml = [];
            let groupTemplate =
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

            methodGroups.forEach(group => {
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
        } catch (err) {
            return '';
        }

        return html.join('');
    },

    mapRecipeServings(servingsData) {
        let html = [];
        try {
            let servings = JSON.parse(servingsData);
            if (servings.serves) html.push('<h4>Serves: ' + servings.serves + '</h4>');
            if (servings.yieldQuantity) {
                let quantity = parseFloat(servings.yieldQuantity);
                let measure = servings.yieldMeasure && servings.yieldMeasure.toLowerCase() !== 'item' ? servings.yieldMeasure.toLowerCase() : '';
                if (measure && !isNaN(quantity) && quantity > 1) {
                    measure = measure.charAt(measure.length - 1) !== 's' ? measure + 's' : measure;
                }
                html.push('<h4>Makes: ' + servings.yieldQuantity + (measure ? ' ' + measure : '') + '</h4>');
            }
        } catch (err) {
            return '';
        }

        return html.join('');
    },

    mapRecipeCookingTime(cookingTimeData) {
        let html = [];
        try {
            let cookingTimes = JSON.parse(cookingTimeData);
            if (cookingTimes.times) {
                cookingTimes.times.forEach(time => {
                    if (time.minutes) {
                        let timeParts = [];
                        let hours = Math.floor(time.minutes / 60);
                        let mins = time.minutes % 60;

                        timeParts.push(s(time.id).humanize().s + ' time:');

                        if (hours > 0) {
                            let unit = hours === 1 ? 'hour' : 'hours';
                            timeParts.push(hours + ' ' + unit);
                        }

                        if (mins > 0) {
                            if (mins >= 1) {
                                let unit = mins === 1 ? 'minute' : 'minutes';
                                timeParts.push(mins + ' ' + unit);
                            } else {
                                let seconds = Math.round(mins * 60);
                                let unit = seconds === 1 ? 'second' : 'seconds';
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
        } catch (err) {
            return '';
        }

        return html.join('');
    },

    mapRecipeImage(imageUrl, width) {
        let newWidth = width || 800;
        return imageUrl
            ? '<div><img src="' + imageUrl + '?width=' + newWidth + '" /></div>'
            : '';
    },

    mapRecipeTips(tipsData) {
        let html = [];
        if (tipsData) {
            html.push('<h3>Tips</h3>');
            let tips = stringHelper.split(tipsData, '\n', true);
            tips.forEach(tip => {
                html.push('<p>' + tip + '</p>');
            });
        }
        return html.join('');
    },

    mapRecipeSource(data) {
        let newData = data;
        switch (data.toLowerCase()) {
            case 'taste':
                newData = 'Food To Love';
                break;
            case 'recipes plus':
                newData = 'Recipes+';
                break;
            case 'commercial':
            case 'supplied':
                newData = '';
                break;
            default:
                break;
        }

        return (newData)
            ? '<h4>Recipe by: ' + newData + '</h4>'
            : '';
    },

    mapRecipeProperty(label, data) {
        return data ? '<h4>' + label + ': ' + data + '</h4>' : '';
    },

    mapCategories(categoryGroups) {
        let categories = [];

        if (categoryGroups) {
            categoryGroups.forEach(group => {
                if (group) {
                    categories = categories.concat(group);
                }
            });
        }

        return categories;
    }
};
