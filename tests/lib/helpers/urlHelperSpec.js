'use strict';

var urlHelper = require('../../../lib/helpers/urlHelper');
var shared = require('mocha-shared');

describe('urlHelper', function() {
    var request = {
            originalUrl: '/rss/aww'
        },
        expectedResult= 'aww';

    shared.behaviour('retrieve site name from request', function(req) {
        it("should return site name equal to '" + expectedResult + "'", function() {
            var actualResult = urlHelper.getSiteNameFromRequest(req);
            expect(actualResult).to.equal(expectedResult);
        });
    });

    describe('getSiteNameFromRequest', function() {

        describe('when Request does not end with /', function() {
            shared.behavior('retrieve site name from request', request);
        });

        describe('when Request ends with /', function() {

            before(function() {
                request.originalUrl += '/';
            });

            shared.behavior('retrieve site name from request', request);
        });
    });
});
