var configHelper = require('../../../lib/helpers/configHelper');

describe('configHelper', function () {

    describe('config', function () {

        describe('when: no binding data set', function () {

            before(function () {
                configHelper.clearCache();
            });

            after(function () {
                configHelper.clearCache();
            });

            it('should not replace configuration binding tags', function () {
                var actual = configHelper.config('aww', null);
                expect(actual.get('solr.core')).to.equal('{{site}}-search');
            });
        });
      
        describe('when: site = \'aww\'', function () {

            it('should return aww configuration', function () {
                var actual = configHelper.config('aww', { site: 'aww' });
                expect(actual.get('solr.core')).to.equal('aww-search');
            });

        });

        describe('when: site = \'food\'', function () {

            it('should return food configuration', function () {
                var actual = configHelper.config('food', { site: 'food' });
                expect(actual.get('solr.core')).to.equal('food-search');
                expect(actual.get('queries.item.default.fq')).to.equal(actual.get('sites.food.queries.item.default.fq'));
            });

        });

    });

});