'use strict';

var async = require('async');
var request = require('request');
var HttpProxyAgent = require('http-proxy-agent');
var Q = require('q');
var _ = require('lodash');
var solrHelper = require('./solrHelper');
var mapper = require('./mappingHelper');
var builder = require('../builders/rssBuilder');
var utils = require('../utils');

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

var agent = process.env.NODE_ENV
    ? null
    : new HttpProxyAgent('http://sydproxy.acp.net:8080');   //Has proxy issue in local
var setImageLength = function(items) {
    var deferred = Q.defer();

    async.map(items, function(item, callback) {
        //HACK: Ignores tests with 'example.com'
        if (!item.enclosure || !item.enclosure.url || _.includes(item.enclosure.url, 'example.com')) {
            callback(null, null);
        } else {
            request({ uri: item.enclosure.url, method: "GET", agent: agent }, function (error, response) {
                if (!error && response.statusCode == 200) {
                    item.enclosure.size = response.headers['content-length'];
                    callback(null, null);
                } else {
                    console.error('[ERROR] get image URL:' + item.enclosure.url + ', error: ' + err);
                    callback(null, null);   //Still needs success callback!
                }
            });
        }
    }, function() {
        //Even if any error from the queue, should not stop other processes!
        deferred.resolve();
    });

    return deferred.promise;
}

var buildFeed = function (props, site) {
    var deferred = Q.defer();

    solrHelper.loadData(props)
        .then(function (data) {
            props.solrData = onSolrDataReceived(data, props);

            try {
                var feed = builder.buildFeed(mapper.mapSolrData(props));
                dollyTest(site, feed);
                setImageLength(feed.items).then(function() {
                    deferred.resolve(feed.xml());
                });
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