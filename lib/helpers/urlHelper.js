'use strict';

function stripTrailingSlash(str) {
    if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

module.exports = {

    getSiteNameFromRequest: function (req) {
        var path = stripTrailingSlash(req.originalUrl);
        return path.substring(path.lastIndexOf('/') + 1);
    }
};





