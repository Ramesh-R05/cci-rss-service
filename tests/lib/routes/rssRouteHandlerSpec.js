var rssRouteHandler = require('../../../lib/routes/rssRouteHandler');
var solrQueries = require('../mocks/solrQueries');
var configHelper = require('../../../lib/helpers/configHelper');

describe('rssRouteHandler', function () {

    var createMockRequest = function (site, routePath, query, settings) {
        return {
            path: '/' + site + '/' + routePath,
            query: query || {},
            settings: settings || {},
            params: [
                site,
                routePath
            ],
            get: function (key) {
                return this.settings[key];
            }
        }
    };

    var createMockResponse = function () {
        return {
            code: 200,
            content: '',
            headers: {},
            sendStatus: function (code) {
                this.code = code;
            },
            send: function (content) {
                this.content = content;
            },
            set: function (key, val) {
                this.headers[key] = val;
            },
            get: function (key) {
                return this.headers[key];
            }
        };
    };

    describe('route', function () {

        describe('when: site not in path', function () {

            var req = createMockRequest('','', null, null);
            var res = createMockResponse();

            it('should return 404 status', function () {
                rssRouteHandler.route(req, res);
                expect(res.code).to.equal(404);
            });
        });

        describe('when: invalid route path', function () {

            var req = createMockRequest('aww','invalid', null, null);
            var res = createMockResponse();

            it('should return 404 status', function () {
                rssRouteHandler.route(req, res);
                expect(res.code).to.equal(404);
            });

        });

        describe('when: application error thrown', function () {

            var config = configHelper.config('aww', { site: 'aww' });

            var originalVal = config.queries;

            before(function () {
                delete config.queries;
            });

            after(function () {
                config.queries = originalVal;
            });
            
            var req = createMockRequest('aww', '', null, null);
            var res = createMockResponse();

            it('should return 500 status', function () {
                rssRouteHandler.route(req, res);
                expect(res.code).to.equal(500);
            });

        });

        describe('when: default feed path', function () {

            solrQueries.mock('aww');

            var req = createMockRequest('aww', '', null, null);
            var res = createMockResponse();

            it('should return default xml content', function (done) {
                var promise = rssRouteHandler.route(req, res);
                promise.finally(function () {
                    expect(res.code).to.equal(200);
                    expect(res.get('Content-Type')).to.equal('text/xml');
                    expect(res.content.length).to.be.above(0);
                    done();
                })
            });

            describe('and when: site = \'food\'', function () {

                solrQueries.mock('food');

                var req = createMockRequest('food', '', null, null);
                var res = createMockResponse();

                it('should return default xml content', function (done) {
                    var promise = rssRouteHandler.route(req, res);
                    promise.finally(function () {
                        expect(res.code).to.equal(200);
                        expect(res.get('Content-Type')).to.equal('text/xml');
                        expect(res.content.length).to.be.above(0);
                        done();
                    })
                });
            });

        })

        describe('when: sponsor feed path', function () {

            solrQueries.mock('aww');

            var req = createMockRequest('aww', 'sponsored', null, null);
            var res = createMockResponse();

            it('should return sponsored xml content', function (done) {
                var promise = rssRouteHandler.route(req, res);
                promise.finally(function () {
                    expect(res.code).to.equal(200);
                    expect(res.get('Content-Type')).to.equal('text/xml');
                    expect(res.content.length).to.be.above(0);
                    expect(res.content).to.have.string('xmlns:mvcf="http://feed.aww.com.au/ns/mvcf"');
                    done();
                })
            });

        });

        describe('when: invalid site', function () {

            var req = createMockRequest('invalid', '', null, null);
            var res = createMockResponse();

            it('should return 500 status', function (done) {
                var promise = rssRouteHandler.route(req, res);
                promise.catch(function (err) {
                    expect(res.code).to.equal(500);
                    done();
                })
            });

        });

    });

});