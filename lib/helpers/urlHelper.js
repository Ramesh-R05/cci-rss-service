'use strict';

function stripTrailingSlash(str) {
    if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

module.exports = {

    getSolrRequestUrl: function (req) {
        var path = req.originalUrl;
        var site = stripTrailingSlash(path).substring(path.lastIndexOf('/') + 1);
        return site + '-search';
    }
};





