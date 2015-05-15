var solrHelper = require('../../../lib/helpers/solrHelper');
var configHelper = require('../../../lib/helpers/configHelper');
var solrQueries = require('../mocks/solrQueries');

solrQueries.mock('aww');

describe('solrHelper', function () {

    var testProps = {
        site: 'aww',
        route: {
            "path": "/",
            "data": [
              {
                  "key": "channel",
                  "query": "channel.default"
              },
              {
                  "key": "items",
                  "query": "item.default"
              }
            ]
        }
    };

    testProps.config = configHelper.config(testProps.site, testProps);

    describe('loadData', function () {

        describe('when: properties set', function () {

            it('should return an array of data sources', function (done) {

                var actual = solrHelper.loadData(testProps);
                actual.then(function (data) {
                    expect(data.length).to.equal(2);
                    expect(data[0].key).to.equal('channel');
                    expect(data[0].data).to.exist.and.not.be.empty;
                    expect(data[0].mappings).to.exist.and.not.be.empty;
                    expect(data[1].key).to.equal('items');
                    expect(data[1].data).to.exist.and.not.be.empty;
                    expect(data[1].mappings).to.exist.and.not.be.empty;
                    done();
                })

            });

        });

        describe('when: properties not set', function () {

            it('should throw an error', function () {
                expect(solrHelper.loadData.bind(solrHelper, null)).to.throw(Error);
            });

        });

        describe('when: null query configuration', function () {

            var originalVal;

            before(function () {
                originalVal = testProps.config.queries.channel.default;
                testProps.config.queries.channel.default = null;
            });

            after(function () {
                testProps.config.queries.channel.default = originalVal;
            });

            it('should throw an error', function (done) {
                var actual = solrHelper.loadData(testProps);
                actual.catch(function (err) {
                    expect(err.toLowerCase()).to.have.string('query configuration not found for key:');
                    done();
                });
            });

        });

    });

});