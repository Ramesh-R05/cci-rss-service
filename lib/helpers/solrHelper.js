'use strict';

var solr = require('solr-client');
var Q = require('q');

var compileQuery = function(queryConfig)
{
    var query = [];

    for(var i in queryConfig)
    {
        query.push(i + '=' + escape(queryConfig[i]));
    }

    return query.join('&');
}

var getDataSources = function(props)
{
    var dataSources = [];

    for (var i in props.route.data)
    {
        var source = props.route.data[i];
        dataSources.push(querySolrData(source, props));
    }

    return dataSources;
}

var querySolrData = function(dataSource, props)
{
    var deferred = Q.defer();

    var queryConfig = props.config.get('queries.' + dataSource.query);

    if (queryConfig)
    {
        var compiledQuery = compileQuery(queryConfig);
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
    }
    else {
        deferred.reject('Query configuration not found for key: ' + dataSource.query);
    }

    return deferred.promise;
}

module.exports = {

    loadData: function(props)
    {
        return Q.all(getDataSources(props));
    }

};






