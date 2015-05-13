'use strict';

var striptags = require('striptags');
var unmarked = require('remove-markdown');

var paramListOpen = '(';
var paramListClose = ')';
var paramListSeparator = ',';
var escapeCharacter = '\\';

var split = function (str, separator, removeEmpty) {

    separator = !isEmpty(separator) ? separator : ',';
    removeEmpty = !isEmpty(removeEmpty) ? removeEmpty : false;

    var items = str.split(separator);

    if (removeEmpty) {
        var clean = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!isEmpty(item)) {
                clean.push(item);
            }
        }

        items = clean;
    }

    return items;
}

var isEmpty = function (str)
{
    return (typeof str === 'undefined' || str === '' || str === null);
}

var stripHtml = function(str, allowedTags)
{
    return striptags(str, allowedTags);
}

var stripMarkdown = function(str)
{
    return unmarked(str);
}

module.exports = {
    split: split,
    isEmpty: isEmpty,
    stripHtml: stripHtml,
    stripMarkdown: stripMarkdown
}