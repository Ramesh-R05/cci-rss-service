'use strict';

var nock = require('nock'),
    proxyquire = require('proxyquire');

var urlHelperStub = {
        getSolrCoreFromRequest: function() {
            return 'aww-search';
        }
    },
    solrHelper = proxyquire('../../../lib/helpers/solrHelper', {
        './urlHelper': urlHelperStub
    });

describe('solrHelper', function() {

    describe('getSearchItems', function() {

        describe('Successful response from Solr with valid items', function() {
            var solrResult = {
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

            before(function() {
                nock('http://solr-cluster01.digital.dev.local')
                    .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"BauerArticle"&sort=pageDateCreated_dt+desc&rows=50&wt=json')
                    .reply(200, JSON.stringify(solrResult));
            });

            it('should return items from a deferred promise', function() {
                var promise = solrHelper.getSearchItems({});
                promise.then(function(data) {
                    expect(data).to.eql(solrResult.docs);
                    done();
                }, function(err) {
                    assert.ok(false, 'deferred promise should not have error');
                    done();
                });

            });
        });

        describe('Successful response from Solr with no items', function() {
            var solrResult = {
                responseHeader: {
                    status: 0,
                    QTime: 2
                },
                response: {
                    numFound: 0,
                    start: 0,
                    docs: []
                }
            };

            before(function() {
                nock('http://solr-cluster01.digital.dev.local')
                    .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"BauerArticle"&sort=pageDateCreated_dt+desc&rows=50&wt=json')
                    .reply(200, JSON.stringify(solrResult));
            });

            it('should return items from a deferred promise', function() {
                var promise = solrHelper.getSearchItems({});
                promise.then(function(data) {
                    expect(data).to.be.null;
                    done();
                }, function(err) {
                    assert.ok(false, 'deferred promise should not have error');
                    done();
                });

            });
        });

        describe('Unsuccesful response from Solr', function() {
            before(function() {
                nock('http://solr-cluster01.digital.dev.local')
                    .get('/solr/aww-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A"BauerArticle"&sort=pageDateCreated_dt+desc&rows=50&wt=json')
                    .reply(400);
            });

            it ('should return an error', function() {
                var promise = solrHelper.getSearchItems({});
                promise.then(function(data) {
                    assert.ok(false, 'deferred promise should not have data');
                    done();
                }, function(err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });
        });

    });

});