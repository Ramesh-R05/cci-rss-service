'use strict';

var stringHelper = require('../helpers/stringHelper');
var configHelper = require('../helpers/configHelper');
var rssHelper = require('../helpers/rssHelper');

var getRouteConfiguration = function (config, routePath)
{
    var routes = config.get('routes');

    if (routes) {
        for (var key in routes) {
            var r = routes[key];
            if (r.path.toLowerCase() === routePath.toLowerCase()) {
                return r;
            }
        }
    }

    return null;
}

var route = function (req, res)
{
    var site = !stringHelper.isEmpty(req.params[0]) ? req.params[0].toLowerCase() : '';
    var routePath = !stringHelper.isEmpty(req.params[1]) ? '/' + req.params[1].toLowerCase() : '/';

    if (site) {

        var props = {
            site: site,
            request: req
        }

        var config = configHelper.config(site, props);

        console.log('site: ' + site + ' : ' + routePath)

        var routeConfig = getRouteConfiguration(config, routePath);

        if (routeConfig) {

            props.route = routeConfig;
            props.config = config;

            try {

                var promise = rssHelper.buildFeed(props);

                promise.then(function (xml) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xml);
                }, function (err) {
                    console.error('[ERROR] ' + err);
                    res.sendStatus(500);
                });

                return promise;
            }
            catch (err) {
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

}

module.exports = {
    route: route
}
