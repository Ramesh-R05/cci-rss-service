var mappingFunctions = require('../../../lib/helpers/mappingFunctions');

describe('mappingFunctions', function () {

    var testCampaignData = '[{ "campaignType": "Native", "sponsor": "Kellogs" }]';

    describe('formatString', function () {

        var testFormat = '[%s]';
        var testInput = 'test';
        var expectedResult = '[test]';

        describe('when: is valid format string', function () {

            it('should return formatted input value', function () {
                expect(mappingFunctions.formatString(testFormat, testInput)).to.equal(expectedResult);
            });

        });

    });

    describe('mapCopyright', function () {

        var currentYear = new Date().getFullYear().toString();
        var copyrightText = 'bauer media pty limited';

        describe('when: called', function () {

            it('should return current year followed by \'' + copyrightText + '\'', function () {

                var actual = mappingFunctions.mapCopyright().toLowerCase();

                var idxYear = actual.indexOf(currentYear);
                var idxText = actual.indexOf(copyrightText);
                
                expect(idxYear).to.be.at.least(0);
                expect(idxText).to.be.above(idxYear);
                
            });

        });

    });

    describe('mapItemUrl', function () {

        var testSiteUrl = 'http://www.example.com';
        var testPageUrl = '/test/some-page';
        var expectedResult = 'http://www.example.com/test/some-page';

        describe("when: site url and page url are set", function () {

            it('should concatenate site url and page url', function () {
                expect(mappingFunctions.mapItemUrl(testSiteUrl, testPageUrl)).to.equal(expectedResult);
            });

        });

    });

    describe('mapMimeType', function () {

        var testImageUrl = 'http://www.example.com/images/test.png?width=800';
        var expectedResult = 'image/png';

        describe('when: image url set', function () {

            it('should return the correct image mime type', function () {
                expect(mappingFunctions.mapMimeType(testImageUrl)).to.equal(expectedResult);
            });

        });

    });

    describe('mapFeedUrl', function () {

        var testRequest = {
            protocol: 'http',
            originalUrl: '/rss/some-feed',
            get: function(x)
            {
                if(x.toLowerCase() === 'host')
                {
                    return 'www.example.com'
                }
            }
        }

        var expectedResult = 'http://www.example.com/rss/some-feed';

        describe('when: request is set', function () {

            it('should return the full feed url', function () {
                expect(mappingFunctions.mapFeedUrl(testRequest)).to.equal(expectedResult);
            });

        });

    });

    describe('mapCampaignType', function () {

        describe('when: campaign set and matchType = \'native\'', function () {

            it('should return \'true\'', function () {

                expect(mappingFunctions.mapCampaignType(testCampaignData, 'native')).to.be.true;

            });

        });

        describe('when: campaign set and matchType = \'advertorial\'', function () {

            it('should return \'false\'', function () {

                expect(mappingFunctions.mapCampaignType(testCampaignData, 'advertorial')).to.be.false;

            });

        });

        describe('when: campaign not set', function () {

            it('should return \'false\'', function () {

                expect(mappingFunctions.mapCampaignType('', 'advertorial')).to.be.false;

            });

        });

    });


    describe('mapCampaignSponsor', function () {

        var expectedResult = 'Kellogs';

        describe('when: campaign set', function () {

            it('should return the campaign sponsor', function () {

                expect(mappingFunctions.mapCampaignSponsor(testCampaignData)).to.equal(expectedResult);

            });
        });

        describe('when: campaign not set', function () {

            it('should return an empty string', function () {

                expect(mappingFunctions.mapCampaignSponsor('')).to.equal('');

            });
        });

    });

});