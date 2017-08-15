import { backendLogger as logger } from '@bxm/winston-logger';
import configHelper from '../helpers/configHelper';
import stringHelper from '../helpers/stringHelper';
import rssHelper from '../helpers/rssHelper';

function getRouteConfiguration(config, routePath, sourceQuery, site) {
    let routes = config.get('routes');
    const siteConfig = config.sites[site.toLowerCase()];
    const filterEnable = siteConfig && siteConfig.enableFilterWithSourceName && sourceQuery;

    if (routePath === '/' && filterEnable ) {
        return routes.sourcefilter;
    }

    for (let key in routes) {
        if (routes.hasOwnProperty(key)) {
            let r = routes[key];
            if (r.path.toLowerCase() === routePath.toLowerCase()) {
                return routes.hasOwnProperty(`${key}sourcefilter`) && filterEnable ? routes[`${key}sourcefilter`] : r;
            }
        }
    }
    return null;
}

function route(req, res) {
    const site = !stringHelper.isEmpty(req.params[0]) ? req.params[0].toLowerCase() : '';
    const routePath = !stringHelper.isEmpty(req.params[1]) ? '/' + req.params[1].toLowerCase() : '/';
    if (site) {
        let props = {
            site: site,
            request: req
        };

        props.queryParams = req.query;
        const sourceQuery = props.queryParams && props.queryParams.source;
        let config = configHelper.config(site, props);
        let routeConfig = getRouteConfiguration(config, routePath, sourceQuery, site);

        if (routeConfig) {
            props.route = routeConfig;
            props.config = config;
            try {
                let promise = rssHelper.buildFeed(props);

                promise.then(xml => {
                    res.set('Content-Type', 'text/xml');
                    res.send(xml.replace(/[\u001f\u001e]/g, ''));
                }, err => {
                    logger.log('error', err.message, { stack: err.stack });
                    res.status(500).send(err.stack);
                });

                return promise;
            } catch (err) {
                logger.log('error', err.message, { stack: err.stack });
                res.status(500).send(err.stack);
            }
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
}

export default {
    route
};


