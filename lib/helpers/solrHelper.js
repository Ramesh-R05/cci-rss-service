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
                console.debug('Solr Items page data Found');
                deferred.resolve(obj.response.docs);

            } else {
                console.debug('No Solr Items page data found');
                deferred.resolve(null);
            }
        } else {
            console.error('Solr Items page data error: ' + error.message);
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
    console.debug('Queryinng Solr Home page data');
    client.search(getNodeHomepageQuery(), function(err, obj) {
        if (!err) {
            if (obj.response.numFound == 1) {
                console.debug('Solr Home page data Found');
                deferred.resolve(obj.response.docs);
            } else {
                console.error('Found more than 1 Solr Home page data');
                deferred.reject("Invalid homepage metadata");

            }
        } else {
            console.error('Solr Home page data error: ' + error.message);
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






