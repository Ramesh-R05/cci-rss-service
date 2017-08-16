//HACK: supertest doesn't support ES6 yet
var request = require('supertest');
const app = "http://dev.rss.services.bauer-media.net.au";
const assert = require('chai').assert;
var schemas  = require("./util/schemas.js")


describe('Smoke test of rss service', function() {
    this.retries(4);

    it('respond with APP NAME', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .expect(function(res) {
                if (res.text !== 'RSS_SERVICE') throw new Error("ERROR");
            })
            .end(done);
    });

    it('want to get full content from cosmo', function(done) {
        request(app)
            .get('/rss/cosmo/full-content')
            .expect(function(res) {
                const result = res.text;
                assert.include(result, schemas.rssHeaderSchema());
                assert.include(result, schemas.rssItemSchema());
                assert.include(result, schemas.rssBodySchema());
            })
            .end(done);
    });

    it('want to get partial content from cosmo', function(done) {
        request(app)
            .get('/rss/cosmo')
            .expect(function(res) {
                const result = res.text;
                assert.include(result, schemas.rssHeaderSchema());
                assert.include(result, schemas.rssParItemSchema());
            })
            .end(done);
    });


});