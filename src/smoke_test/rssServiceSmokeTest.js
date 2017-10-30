//HACK: supertest doesn't support ES6 yet
var nconf = require('nconf');
nconf.argv().env();
var baseUrl = nconf.get('URL');
var parser = require('xml2json');
var request = require('supertest');
const assert = require('chai').assert;
var schemas  = require("./util/schemas.js");

const app = baseUrl;

console.log('running on url :: ' + baseUrl);

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
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.rss["channel"].ttl > 1).to.eq(true); //To ensure more than one item is in the feed
                expect(data.rss["channel"]["item"][0]["title"] == "").to.eq(false); // To ensure the title of a feed item is not empty
                expect(data.rss["channel"]["item"][2]["dc:creator"] == "").to.eq(false); // To ensure the creator name is not empty
                expect(typeof(data.rss["channel"]["item"][0]["content:encoded"]) === "undefined").to.eq(false); // To ensure the content:encoded of a feed item is defined
                expect(data.rss["channel"]["item"][0]["content:encoded"] == "").to.eq(false); // To ensure the content:encoded of a feed item is not empty
            })
            .end(done);
    });

    it('want to get partial content from cosmo', function(done) {
        request(app)
            .get('/rss/cosmo')
            .expect(function(res) {
                const result = res.text;
                assert.include(result, schemas.rssHeaderSchema());
                const data = JSON.parse(parser.toJson(res.text));
                expect(typeof(data.rss["channel"]["item"][0]["content:encoded"]) === "undefined").to.eq(true); // To ensure the content:encoded of a feed item is not defined
            })
            .end(done);
    });


});