import {Router} from 'express';
import rssRouteHandler from './rssRouteHandler';

/*eslint-disable */
const router = Router();
/*eslint-enable */

router.get('/rss/:site/:route_path?', rssRouteHandler.route);

export default router;
