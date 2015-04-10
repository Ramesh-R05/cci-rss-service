'use strict';

function stripTrailingSlash(str) {
    if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

module.exports = {

    getSolrCoreFromRequest: function (req) {
        var path = stripTrailingSlash(req.originalUrl);
        var site = path.substring(path.lastIndexOf('/') + 1);
        return site + '-search';
    }
};





