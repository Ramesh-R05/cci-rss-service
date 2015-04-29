'use strict';

var express = require('express');
var stringHelper = require('../helpers/stringHelper');
var configHelper = require('../helpers/configHelper');
var rssHelper = require('../helpers/rssHelper');

var getRouteConfiguration = function(config, routePath)
{
    var routes = config.get('routes');

    if (routes) {
        for(var key in routes)
        {
            var r = routes[key];
            if(r.path.toLowerCase() === routePath.toLowerCase())
            {
                return r;
            }
        }
    }

    return null;
}

var router = express.Router();

router.route('/*').get(function (req, res) {

    var path = stringHelper.split(req.path, "/", true);

    if (path.length > 0) {

        var site = path[0].toLowerCase();
        var routePath = path.length > 1 ? '/' + path.splice(1).join('/') : '/';
        var config = configHelper.config(site);

        var routeConfig = getRouteConfiguration(config, routePath);

        if (routeConfig) {

            var props = {
                site: site,
                route: routeConfig,
                query: res.query,
                config: config,
            };

            try{
                rssHelper.buildFeed(props)
                    .then(function (xml) {
                        res.set('Content-Type', 'text/xml');
                        res.send(xml);
                    }, function (err) {
                        console.error('[ERROR] ' + err);
                        res.sendStatus(500);
                    });
            }
            catch(err)
            {
                console.error('[ERROR] ' + err.message);
                res.sendStatus(500);
            }
        }
        else {
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(404);
    }

});


module.exports = router;
