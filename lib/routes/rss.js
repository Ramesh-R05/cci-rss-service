'use strict';

var express = require('express');
var solrHelper = require('../helpers/solrHelper');
var stringHelper = require('../helpers/stringHelper');
var configHelper = require('../helpers/configHelper');
var builder = require('../builders/rssBuilder');

var getRouteConfiguration = function(config, route)
{
    var routes = config.get('routes');

    if (routes) {
        for(var key in routes)
        {
            var r = routes[key];
            if(r.path.toLowerCase() === route.toLowerCase())
            {
                return r;
            }
        }
    }

    return null;
}

var router = express.Router();

router.route('/*').get(function (req, res) {

    var status = 404;
    var body = 'Not Found';

    var path = stringHelper.split(req.path, "/", true);

    if (path.length > 0) {

        var site = path[0].toLowerCase();
        var route = path.length > 1 ? '/' + path.splice(1).join('/') : '/';
        var config = configHelper.config(site);

        var routeConfig = getRouteConfiguration(config, route);

        if (routeConfig) {

            var props = {
                site: site,
                route: route,
                query: res.query,
                config: config
            };

            status = 200;
            body = "OK"
        }
    }

    res.status(status).send(body);

});

/*
        solrHelper.getSearchItems(req)
            .then(function (data) {
                var feed = builder.buildShortRssFeed(data);
                var xml = feed.xml();
                res.set('Content-Type', 'text/xml');
                res.send(xml);
            }, function (err) {
                console.error('getSearchItems error: ' + err);
                res.sendStatus(500);
            });
*/

module.exports = router;
