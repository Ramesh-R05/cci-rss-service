'use strict';

var solr = require('solr-client');
var urlHelper = require('./urlHelper');
var Q = require('q');

function getSolrOptions(site) {
    var hostKey = "solr-host." + site;
    var host = (config.has(hostKey) ? config.get(hostKey) : config.get("solr-host.default"));

    return {
        "host": host,
        "port": config.get("solr-port"),
        "path": config.get("solr-path"),
        "core": config.get("solr-core." + site)
    }
}

function getSolrQuery(site) {
    var baseKey = "solr-query." + site + ".";
    var nodeType = config.get(baseKey + "nodeType");
    var sortField = config.get(baseKey + "sortField");
    var limit = config.get("solr-query.limit");

    return 'q=*%3A*&fq=nodeTypeAlias_t%3A"' + nodeType + '"&sort=' + sortField + '+desc&rows=' + limit;
}

module.exports = {
    getSearchItems: function(req) {

        var deferred = Q.defer();
        var site = urlHelper.getSiteNameFromRequest(req);
        var options = getSolrOptions(site);
        var client = solr.createClient(options);
        client.search(getSolrQuery(site), function(err, obj){
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






