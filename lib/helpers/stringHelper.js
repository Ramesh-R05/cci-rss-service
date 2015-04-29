'use strict';

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
    return (str === '' || str === null || typeof str === 'undefined');
}

var parseFunction = function(fnStr)
{
    var fn = {
        name: fnStr,
        params: []
    };

    var paramsIdx = fnStr.indexOf(paramListOpen);

    if (paramsIdx > 0)
    {
        fn.name = fnStr.substring(0, paramsIdx);

        var startIdx = paramsIdx + paramListOpen.length;

        if (startIdx < fnStr.length)
        {
            var paramStr = fnStr.substring(startIdx);
            var subFnCount = 0;
            var escape = false;
            var param = '';

            for (var i = 0; i < paramStr.length; i++)
            {
                var c = paramStr[i];

                if (escape) {
                    escape = false;
                    param = param.concat(c);
                    continue;
                }

                if (c === escapeCharacter)
                {
                    escape = true;
                    continue;
                }

                if (c === paramListOpen)
                {
                    param = param.concat(c);
                    subFnCount++;
                    continue;
                }

                if (c === paramListClose) {
                    if (subFnCount > 0) {
                        param = param.concat(c);
                        subFnCount = Math.max(0, subFnCount - 1);
                    }
                    continue;
                }

                if(c === paramListSeparator && subFnCount === 0)
                {
                    fn.params.push(param.trim());
                    param = '';
                    continue;
                }

                param = param.concat(c);
            }

            if(param.length > 0)
            {
                fn.params.push(param.trim());
            }
        }
    }

    return fn;
}

module.exports = {

    split: split,
    isEmpty: isEmpty,
    parseFunction: parseFunction

}