import configHelper from '../helpers/configHelper';
import rssHelper from '../helpers/rssHelper';

let getRouteConfiguration = (config, routePath) => {

    let routes = config.get('routes');

    if (routes) {
        for (let key in routes) {
            let r = routes[key];
            if (r.path.toLowerCase() === routePath.toLowerCase()) {
                return r;
            }
        }
    }

    return null;
}

let route = (req, res) => {

    let site = req.params.site.toLowerCase();
    let routePath = '/' + (req.params.route_path ? req.params.route_path : '');

    if (site) {

        let props = {
            site: site,
            request: req
        }

        let config = configHelper.config(site, props);
        let routeConfig = getRouteConfiguration(config, routePath);

        if (routeConfig) {

            props.route = routeConfig;
            props.config = config;
            props.queryParams = req.query;

            try {

                let promise = rssHelper.buildFeed(props);

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


