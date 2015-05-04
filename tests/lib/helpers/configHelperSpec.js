var configHelper = require('../../../lib/helpers/configHelper');

describe('configHelper', function () {

    describe('config', function () {

        describe('when: site = \'aww\'', function () {

            it('should return aww configuration', function () {

                var actual = configHelper.config('aww', { site: 'aww' });

                var core = actual.get('solr.core');
                expect(core).to.equal('aww-search');

            });

        });

        describe('when: site = \'food\'', function () {

            it('should return food configuration', function () {

                var actual = configHelper.config('food', { site: 'food' });

                var core = actual.get('solr.core');
                expect(core).to.equal('food-search');

                var fq = actual.get('queries.item.default.fq');
                expect(fq).to.equal(actual.get('sites.food.queries.item.default.fq'));


            });

        });

    });

});