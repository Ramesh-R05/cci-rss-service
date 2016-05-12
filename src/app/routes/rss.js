import {Router} from 'express';
import rssRouteHandler from './rssRouteHandler';

/*eslint-disable */
const router = Router();
/*eslint-enable */

router.get(/^\/rss\/([\w-]+)\/?([\w-]+(\/[\w-]+)*)?\/?$/, rssRouteHandler.route);

export default router;
