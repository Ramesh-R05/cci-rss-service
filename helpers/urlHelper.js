/**
 * Created by AMeghraj on 9/04/2015.
 */
'use strict';
//var config = require('../config/solr.config');


function stripTrailingSlash(str) {
    if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

module.exports = {

    getSolrRequestUrl: function (req) {
        var host = req.get('host');
        var path = req.originalUrl;
        var site = stripTrailingSlash(path).substring(path.lastIndexOf('/') + 1);
        return site + '-search';
    }
};





