'use strict';

var marked = require('marked');
var util = require('util');

var options = {
    breaks: true
};

var renderParagraph = function (content) {

    if (content) {
        return marked(content, options);
    }

    return '';
}

var renderImage = function(content, attributes)
{
    if (content && content.url) {

        var url = content.url;

        if (attributes) {
            var attList = [];
            for (var i in attributes) {
                attList.push(i + '=' + attributes[i]);
            }
            url += '?' + attList.join('&');
        }

        var caption = content.caption || '';

        var html = util.format('<img src="%s" alt="%s" />', url, caption);

        if (caption) {
            html += renderParagraph(caption);
        }

        return '<div>' + html + '</div>';
    }

    return '';
}

module.exports = {
    renderParagraph: renderParagraph,
    renderImage: renderImage
}