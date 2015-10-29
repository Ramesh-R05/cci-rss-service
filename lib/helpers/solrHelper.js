'use strict';

var solr = require('solr-client');
var Q = require('q');
var merge = require('lodash/object/merge');

var compileQuery = function (queryConfig, queryParams) {
    var query = [];

    for(var i in queryConfig) {
        if (i !== 'queryParams') query.push(i + '=' + escape(queryConfig[i]));
    }

    if (queryConfig.queryParams) {
        for (var j in queryParams) {
            query.push(j + '=' + queryParams[j]);
        }
    }

    return query.join('&');
}

var getDataSources = function (props) {

    var dataSources = [];
    for (var i in props.route.data) {
        var source = props.route.data[i];
        dataSources.push(querySolrData(source, props));
    }

    return dataSources;
}

var querySolrData = function (dataSource, props) {

    var deferred = Q.defer();

    var queryConfig = props.config.get('queries.' + dataSource.query);

    if (queryConfig) {
        var compiledQuery = compileQuery(queryConfig, props.queryParams);
        var client = solr.createClient(props.config.get('solr'));
        client.search(compiledQuery, function (err, obj) {
            if (!err) {
                deferred.resolve({
                    key: dataSource.key,
                    data: obj.response.docs,
                    mappings: dataSource.mappings ? dataSource.mappings : [dataSource.query]
                });
            } else {
                deferred.reject(err);
            }
        });
    } else {
        deferred.reject('Query configuration not found for key: ' + dataSource.query);
    }

    return deferred.promise;
}

module.exports = {
    loadData: function(props) {
        return Q.all(getDataSources(props));
    },
    compileQuery: compileQuery
};






