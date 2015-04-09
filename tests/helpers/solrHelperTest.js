'use strict';

var nock = require('nock'),
    solrHelper = require('../../helpers/solrHelper');

describe('solrHelper', function() {

    describe('getSearchItems', function() {
        var expectedData = {'test': 'hello world'};

        before(function() {

            nock('http://solr-cluster01.digital.dev.local')
                .get('/solr/aww-search/select')
                .reply(200, {'test': 'hello world'});
        });

        it('should return a deferred promise', function() {
            var promise = solrHelper.getSearchItems();
            promise.then(function(data) {
                expect(data).to.eql(expectedData)
            }, function(err) {

            })
        });
    });

});