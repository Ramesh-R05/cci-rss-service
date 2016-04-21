import configHelper from '../helpers/configHelper';
import rssHelper from '../helpers/rssHelper';

var getRouteConfiguration = function (config, routePath) {

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

var route = function (req, res) {

    var site = req.params.site.toLowerCase();
    var routePath = '/' + (req.params.route_path ? req.params.route_path : '');

    if (site) {

        var props = {
            site: site,
            request: req
        }

        var config = configHelper.config(site, props);
        var routeConfig = getRouteConfiguration(config, routePath);

        if (routeConfig) {

            props.route = routeConfig;
            props.config = config;
            props.queryParams = req.query;

            try {

                var promise = rssHelper.buildFeed(props);

                promise.then(function (xml) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xml.replace(/[\u001f\u001e]/g, ''));
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

export default {
    route
};


