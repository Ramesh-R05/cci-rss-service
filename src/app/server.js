import Server from '@bxm/microservice';
import routes from './routes/rss';
import version from './../version';

export default function() {
    const server = new Server({
        name: 'RSS_SERVICE',
        version: version,
        docs: './docs/api.raml',
        routes: routes
    });

    server.start();
    return server;
}
