var rssRouteHandler = require('../../../app/routes/rssRouteHandler');
var solrQueries = require('../mocks/solrQueries');
var configHelper = require('../../../app/helpers/configHelper');

describe('rssRouteHandler', function () {

    var createMockRequest = function (site, route_path, query, settings) {
        return {
            path: '/' + site + '/' + route_path,
            query: query || {},
            settings: settings || {},
            params: {
                site,
                route_path,
            },
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

            var req = createMockRequest('aww', '', null, null);
            var res = createMockResponse();

            var config;
            var originalVal;

            before(function () {
                config = configHelper.config('aww', { site: 'aww' });
                originalVal = config.queries;
                delete config.queries;
            });

            after(function () {
                config.queries = originalVal;
            });
            
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
                    expect(res.content).to.have.string('xmlns:mvcf="http://feed.aww.com.au/ns/mvcf/"');
                    done();
                })
            });

        });

        describe('when: full content feed path', function () {

            solrQueries.mock('aww');

            var req = createMockRequest('aww', 'full-content', null, null);
            var res = createMockResponse();

            it('should return xml with full content', function (done) {
                var promise = rssRouteHandler.route(req, res);
                promise.finally(function () {
                    expect(res.code).to.equal(200);
                    expect(res.get('Content-Type')).to.equal('text/xml');
                    expect(res.content.length).to.be.above(0);
                    expect(res.content).to.have.string('<p>Aenean mauris elit, congue quis leo sit amet.</p>');
                    done();
                })
            });

        });
        
        describe('when: recipe feed path', function () {

            solrQueries.mock('food');

            var req = createMockRequest('food', 'recipes', null, null);
            var res = createMockResponse();

            it('should return recipe xml content', function (done) {
                var promise = rssRouteHandler.route(req, res);
                promise.finally(function () {
                    expect(res.code).to.equal(200);
                    expect(res.get('Content-Type')).to.equal('text/xml');
                    expect(res.content.length).to.be.above(0);
                    expect(res.content).to.have.string('6 or more ingredients');
                    done();
                })
            });

        });

        describe('when: full content recipe feed path', function () {

            solrQueries.mock('food');

            var req = createMockRequest('food', 'recipes/full-content', null, null);
            var res = createMockResponse();

            it('should return recipe xml with full content', function (done) {
                var promise = rssRouteHandler.route(req, res);
                promise.finally(function () {
                    expect(res.code).to.equal(200);
                    expect(res.get('Content-Type')).to.equal('text/xml');
                    expect(res.content.length).to.be.above(0);
                    expect(res.content).to.have.string('6 or more ingredients');
                    expect(res.content).to.have.string('<h3>Balsamic honey pulled-pork buns</h3>');
                    expect(res.content).to.have.string('<li>800 grams trimmed pork shoulder</li>');
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