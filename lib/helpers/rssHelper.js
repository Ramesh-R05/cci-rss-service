'use strict';

var solrHelper = require('./solrHelper');
var mapper = require('./mappingHelper');
var builder = require('../builders/rssBuilder');
var Q = require('q');

var buildFeed = function(props)
{
    var deferred = Q.defer();

    solrHelper.loadData(props)
        .then(function (data) {

            props.solrData = data;

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

module.exports = {
    buildFeed: buildFeed
}