var dataHandlers = require('../../../lib/helpers/dataHandlers');

describe('dataHandlers', function () {

    describe('onSponsoredDataReceived', function () {

        var campaignFieldName = 'contentCampaign_t';
        var testData = [
            {
                key: 'channel',
                data: []
            },
            {
                key: 'items',
                data: [
                    {
                        contentCampaign_t: '[{ "campaignType": "Native", "sponsor": "Kellogs" }]'
                    }
                ]
            }
        ];

        describe('when: item campaign does not contain a sponsor', function () {

            before(function () {
                testData[1].data.push({ contentCampaign_t: '[{ "campaignType": "Native" }]' });
            });

            it('should ignore the item', function () {
                var actual = dataHandlers.onSponsoredDataReceived(campaignFieldName, testData);
                expect(actual[1].data.length).to.equal(1);
            });

        });

        describe('when: item campaign does not contain a campaign type', function () {

            before(function () {
                testData[1].data.push({ contentCampaign_t: '[{ "sponsor": "Kellogs" }]' });
            });

            it('should ignore the item', function () {
                var actual = dataHandlers.onSponsoredDataReceived(campaignFieldName, testData);
                expect(actual[1].data.length).to.equal(1);
            });

        });

        describe('when: item does not contain campaign data', function () {

            before(function () {
                testData[1].data.push({ contentCampaign_t: '' });
            });

            it('should ignore the item', function () {
                var actual = dataHandlers.onSponsoredDataReceived(campaignFieldName, testData);
                expect(actual[1].data.length).to.equal(1);
            });

        });

    });

});