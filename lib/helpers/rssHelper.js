'use strict';

var solrHelper = require('./solrHelper');
var mapper = require('./mappingHelper');
var builder = require('../builders/rssBuilder');
var utils = require('../utils');
var Q = require('q');

var buildFeed = function (props) {

    var deferred = Q.defer();

    solrHelper.loadData(props)
        .then(function (data) {

            props.solrData = onSolrDataReceived(data, props);

            try {
                var feed = builder.buildFeed(mapper.mapSolrData(props));
                deferred.resolve(feed.xml());
            }
            catch (err) {
                deferred.reject(err.message);
            }

        }, function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

var onSolrDataReceived = function (data, props) {

    if (props.route.onDataReceived) {
        props.route.onDataReceived.forEach(function (func) {
            var handler = utils.compileFunction(func, {}, [data]);
            data = handler.execute();
        });
    }
    
    return data;
}

module.exports = {
    buildFeed: buildFeed
}