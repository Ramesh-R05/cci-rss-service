'use strict';

var solrHelper = require('./solrHelper');
var mapper = require('./mappingHelper');
var builder = require('../builders/rssBuilder');
var utils = require('../utils');
var Q = require('q');

//HACK: To test DDO-406
//TODO: If works, deal with it in mappings.json. If not, remove this
var dollyTest = function (site, sourceFeed) {
    if (site !== 'dolly' || !sourceFeed || !sourceFeed.items || sourceFeed.items.length < 1) {
        return;
    }

    sourceFeed.items.forEach(function (item) {
        if (item.enclosure && item.enclosure.url) {
            item.enclosure.url = item.enclosure.url.replace('?width=800', '');
        }
    });
}

var buildFeed = function (props, site) {

    var deferred = Q.defer();

    solrHelper.loadData(props)
        .then(function (data) {
            props.solrData = onSolrDataReceived(data, props);

            try {
                var feed = builder.buildFeed(mapper.mapSolrData(props));
                dollyTest(site, feed);
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