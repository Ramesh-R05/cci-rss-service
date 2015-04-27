'use strict';

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
    return (str === '' || str === null || typeof str === 'undefined');
}

module.exports = {

    split: split,
    isEmpty: isEmpty

}