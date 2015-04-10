'use strict';

var urlHelper = require('../../../lib/helpers/urlHelper'),
    shared = require('mocha-shared');

describe('urlHelper', function() {
    var request = {
            originalUrl: '/rss/aww'
        },
        expectedResult= 'aww-search';

    shared.behaviour('retrieve solr core from request', function(req) {
        it("should return solr core equal to '" + expectedResult + "'", function() {
            var actualResult = urlHelper.getSolrCoreFromRequest(req);
            expect(actualResult).to.equal(expectedResult);
        });
    });

    describe('getSolrCoreFromRequest', function() {

        describe('when Request does not end with /', function() {
            shared.behavior('retrieve solr core from request', request);
        });

        describe('when Request ends with /', function() {

            before(function() {
                request.originalUrl += '/';
            });

            shared.behavior('retrieve solr core from request', request);
        });
    });
});
