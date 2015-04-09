/**
 * Created by AMeghraj on 8/04/2015.
 */
'use strict';

var solr = require('solr-client');
var urlHelper = require('./urlHelper');
var options = {
    "host": "solr-cluster01.digital.dev.local",
    "port": 80,
    "path": "/solr",
    "core": 'aww-search'
};

var Q = require('q');

module.exports = {
    getSearchItems: function(req) {
        var deferred = Q.defer();
        options.core = urlHelper.getSolrRequestUrl(req);
        var client = solr.createClient(options);
        client.search('q=*%3A*&fq=nodeTypeAlias_t%3A"BauerArticle"&sort=pageDateCreated_dt+desc&rows=50', function(err, obj){
            if (!err) {
                if (obj.response.numFound > 0) {
                    deferred.resolve(obj.response.docs);

                } else {
                    deferred.resolve(null);

                }
            } else {
                deferred.reject(err);
            }
        });

        return deferred.promise;
    }
};






