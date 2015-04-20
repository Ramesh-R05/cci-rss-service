'use strict';

var solr = require('solr-client');
var urlHelper = require('./urlHelper');
var Q = require('q');

function getSolrOptions(site) {
    var hostKey = "solr.host." + site;
    var host = (config.has(hostKey) ? config.get(hostKey) : config.get("solr.host.default"));

    return {
        "host": host,
        "port": config.get("solr.port"),
        "path": config.get("solr.path"),
        "core": config.get("solr.core." + site)
    }
}

function getSolrItemsQuery(site) {
    var baseKey = "solr.query." + site + ".";
    var nodeType = config.get(baseKey + "nodeType");
    var sortField = config.get(baseKey + "sortField");
    var limit = config.get("solr.query.limit");

    return 'q=*%3A*&fq=nodeTypeAlias_t%3A"' + nodeType + '"&sort=' + sortField + '+desc&rows=' + limit;
}

function getItemsData(site, solrOptions) {
    var deferred = Q.defer();

    var client = solr.createClient(solrOptions);
    client.search(getSolrItemsQuery(site), function(err, obj) {
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

function getNodeHomepageQuery() {
    return 'q=*%3A*&fq=nodeTypeAlias_t%3A"Homepage"';
}

function getHomepageData(solrOptions) {
    var deferred = Q.defer();

    var client = solr.createClient(solrOptions);
    client.search(getNodeHomepageQuery(), function(err, obj) {
        if (!err) {
            if (obj.response.numFound == 1) {
                deferred.resolve(obj.response.docs);

            } else {
                deferred.reject("Invalid homepage metadata");

            }
        } else {
            deferred.reject(err);
        }
    });

    return deferred.promise;
}

module.exports = {
    getSearchItems: function(req) {

        var site = urlHelper.getSiteNameFromRequest(req);
        var options = getSolrOptions(site);

        return Q.all([
            getHomepageData(options),
            getItemsData(site, options)
        ]);
    }
};






