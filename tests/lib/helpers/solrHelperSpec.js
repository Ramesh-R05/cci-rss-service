'use strict';

var nock = require('nock');
var proxyquire = require('proxyquire');

var urlHelperStub = {
    getSiteNameFromRequest: function() {
        return 'aww';
    }
};

var solrHelper = proxyquire('../../../lib/helpers/solrHelper', {
    './urlHelper': urlHelperStub
});

describe('solrHelper', function() {

    describe('getSearchItems', function() {
        var solrItemsResult = {
            responseHeader: {
                status: 0,
                QTime: 2
            },
            response: {
                numFound: 1,
                start: 0,
                docs: 'hello world!'
            }
        };

        describe('when searching for homepage data', function() {

            before(function() {
                nock('http://solr-cluster01.digital.dev.local')
                    .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"BauerArticle"&sort=pageDateCreated_dt+desc&rows=50&wt=json')
                    .reply(200, JSON.stringify(solrItemsResult));
            });

            describe('and received successful response from solr', function() {

                describe('and with valid data', function() {

                    before(function() {
                        nock('http://solr-cluster01.digital.dev.local')
                            .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"Homepage"&wt=json')
                            .reply(200, JSON.stringify(solrItemsResult));
                    });

                    it('should return successful header data from a deferred proomise', function() {
                        var promise = solrHelper.getSearchItems({originalUrl: '/rss/aww'});
                        promise.then(function(data) {
                            expect(data[0]).to.equal(solrItemsResult.response.docs)
                        }, function(err) {
                            assert.ok(false, 'deferred promise for header data should not have error');
                        }).done();
                    });

                });

                describe('and with no valid data', function() {

                    before(function() {
                        solrItemsResult.response = {
                            numFound: 0,
                            start: 0,
                            docs: []
                        };

                        nock('http://solr-cluster01.digital.dev.local')
                            .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"Homepage"&wt=json')
                            .reply(200, JSON.stringify(solrItemsResult));
                    });

                    it('should return error header data from a deferred promise', function() {
                        var promise = solrHelper.getSearchItems({originalUrl: '/rss/aww'});
                        promise.then(function(data) {
                            assert.ok(false, 'deferred promise for header data should not have data');
                        }, function(err) {
                            expect(err).to.not.be.null;
                        }).done();
                    });
                });
            });

            describe('and received unsuccesful response from solr', function() {

                before(function() {
                    nock('http://solr-cluster01.digital.dev.local')
                        .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"Homepage"&wt=json')
                        .reply(400);
                });

                it('should return error header data from a deferred promise', function() {
                    var promise = solrHelper.getSearchItems({originalUrl: '/rss/aww'});
                    promise.then(function(data) {
                        assert.ok(false, 'deferred promise for header data should not have data');
                    }, function(err) {
                        expect(err).to.not.be.null;
                    }).done();
                });
            });
        });

        describe('when searching for items data', function() {

            before(function() {
                nock('http://solr-cluster01.digital.dev.local')
                    .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3AHomepage&wt=json')
                    .reply(200, JSON.stringify(solrItemsResult));
            });

            describe('and received successful response from solr', function() {

                describe('with valid items', function() {

                    before(function() {
                        nock('http://solr-cluster01.digital.dev.local')
                            .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"Homepage"&wt=json')
                            .reply(200, JSON.stringify(solrItemsResult));
                    });

                    //shared.behaviour('return successful result items from a deferred promise', solrItemsResult.response.docs);
                    it('should return successful items data from a deferred proomise', function() {
                        var promise = solrHelper.getSearchItems({originalUrl: '/rss/aww'});
                        promise.then(function(data) {
                            expect(data[1]).to.equal(solrItemsResult.response.docs)
                        }, function(err) {
                            assert.ok(false, 'deferred promise for header data should not have error');
                        }).done();
                    });
                });

                describe('with no items', function() {

                    before(function() {
                        solrItemsResult.response.numFound = 0;
                        solrItemsResult.response.docs = [];

                        nock('http://solr-cluster01.digital.dev.local')
                            .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"BauerArticle"&sort=pageDateCreated_dt+desc&rows=50&wt=json')
                            .reply(200, JSON.stringify(solrItemsResult));
                    });

                    it('should return successful items data from a deferred proomise', function() {
                        var promise = solrHelper.getSearchItems({originalUrl: '/rss/aww'});
                        promise.then(function(data) {
                            expect(data[1]).to.be.null;
                        }, function(err) {
                            assert.ok(false, 'deferred promise for header data should not have error');
                        }).done();
                    });
                });
            });

            describe('and received unsuccesful response from Solr', function() {
                before(function() {
                    nock('http://solr-cluster01.digital.dev.local')
                        .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"BauerArticle"&sort=pageDateCreated_dt+desc&rows=50&wt=json')
                        .reply(400);
                });

                it('should return error items data from a deferred promise', function() {
                    var promise = solrHelper.getSearchItems({originalUrl: '/rss/aww'});
                    promise.then(function(data) {
                        assert.ok(false, 'deferred promise for items data should not have data');
                    }, function(err) {
                        expect(err).to.not.be.null;
                    }).done();
                });
            });
        });

    });

});