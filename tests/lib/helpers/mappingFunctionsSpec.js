var mappingFunctions = require('../../../lib/helpers/mappingFunctions');

describe('mappingFunctions', function () {

    var testCampaignData = '[{ "campaignType": "Native", "sponsor": "Kellogs" }]';

    describe('sanitise', function () {

        var testInput = '<strong>Lorem</strong> **ipsum** <a href="#">dolor</a> [sit](http://www.example.com) amet.';
        var expectedResult = 'Lorem ipsum dolor sit amet.';

        describe('when: input string set', function () {

            it('should remove all html tags and markdown from the input string', function () {
                expect(mappingFunctions.sanitise(testInput)).to.equal(expectedResult);
            });

        });

        describe('when: no input string set', function () {

            it('should return an empty string', function () {
                expect(mappingFunctions.sanitise(null)).to.equal('');
            });

        });

    });

    describe('format', function () {

        var testFormat = '[%s]';
        var testInput = 'test';
        var expectedResult = '[test]';

        describe('when: is valid format string', function () {

            it('should return formatted input value', function () {
                expect(mappingFunctions.format(testFormat, testInput)).to.equal(expectedResult);
            });

        });

        describe('when: no input value set', function () {
            it('should return an empty string', function () {
                expect(mappingFunctions.format(testFormat, null)).to.equal('');
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

    describe('mapFullContent', function () {

        var contentUrl = 'http://www.example.com/test-content';
        var input = [
            {
                type: "paragraph",
                content: "Test paragraph text"
            },
            {
                type: "quote",
                content: "Test quote text"
            },
            {
                type: "heading",
                content: "Test heading text"
            },
            {
                type: 'image',
                content: {
                    url: "http://www.example.com/test.jpg",
                    caption: 'Test caption text'
                }
            },
            {
                type: "video",
                content: {
                    properties: {
                        videoConfiguration: {
                            brightcoveId: "12345678"
                        }
                    }
                }
            }
        ];

        describe('when: valid content set', function () {

            var expectedParagraphText;
            var expectedQuoteText;
            var expectedHeadingText;
            var expectedImageText;
            var expectedVideoText;

            before(function () {
                expectedParagraphText = '<p>' + input[0].content + '</p>';
                expectedQuoteText = '<p>' + input[1].content + '</p>';
                expectedHeadingText = '<h2>' + input[2].content + '</h2>';
                expectedImageText = '<img src="' + input[3].content.url + '?width=800" alt="' + input[3].content.caption + '" />';
                expectedVideoText = '<a href="' + contentUrl + '" target="_blank">Watch video</a>';
            });

            it('should return formatted content html', function () {
                var actual = mappingFunctions.mapFullContent(contentUrl, JSON.stringify(input));
                expect(actual).to.have.string(expectedParagraphText);
                expect(actual).to.have.string(expectedQuoteText);
                expect(actual).to.have.string(expectedHeadingText);
                expect(actual).to.have.string(expectedImageText);
                expect(actual).to.have.string(expectedVideoText);
            });

            describe('and when: item content not set', function () {

                var originalVal;

                before(function () {
                    originalVal = input[2].content;
                    input[2].content = '';
                });

                after(function () {
                    input[2].content = originalVal;
                })

                it('should ignore the item', function () {
                    var actual = mappingFunctions.mapFullContent(contentUrl, JSON.stringify(input));
                    expect(actual).to.not.have.string('<h2>');
                })
            });

            describe('and when: item video id not set', function () {

                var originalVal;

                before(function () {
                    originalVal = input[4].content.properties.videoConfiguration.brightcoveId;
                    input[4].content.properties.videoConfiguration.brightcoveId = '';
                });

                after(function () {
                    input[4].content.properties.videoConfiguration.brightcoveId = originalVal;
                });

                it('should not include a video link', function () {
                    var actual = mappingFunctions.mapFullContent(contentUrl, JSON.stringify(input));
                    expect(actual).to.not.have.string('Watch video');
                });
            });

            describe('and when: image settings passed as parameter', function () {

                var settings = {
                    image: {
                        width: 640,
                        height: 480
                    }
                };

                before(function () {
                    expectedImageText = '<img src="' + input[3].content.url + '?width=' + settings.image.width + '&height=' + settings.image.height + '" alt="' + input[3].content.caption + '" />';
                });

                it('should use the image setting values', function () {
                    var actual = mappingFunctions.mapFullContent(contentUrl, JSON.stringify(input), JSON.stringify(settings));
                    expect(actual).to.have.string(expectedImageText);
                });
            });

        });

        describe('when: invalid content set', function () {

            it('should return an empty string', function () {
                var actual = mappingFunctions.mapFullContent(contentUrl, 'BAD JSON');
                expect(actual).to.be.empty;
            });

        });

    });

    describe('mapTags', function () {

        var input;

        describe('when: tag groups set', function () {

            before(function () {
                input = [
                    [ 'food:Meal:Dessert', 'food:Dish type:Cake' ],
                    [ 'food:Difficulty:Moderate' ]
                ];
            });

            it('should return a list containing the lowercase tag name from all groups', function () {
                var actual = mappingFunctions.mapTags(input);
                expect(actual.length).to.equal(3);
                expect(actual[2]).to.equal('moderate');
            });

            describe('and when: tag group contains an empty tag', function () {

                before(function () {
                    input = [['food:Meal:Dessert', '', 'food:Difficulty:Moderate']];
                });

                it('should not include the empty tag', function () {
                    var actual = mappingFunctions.mapTags(input);
                    expect(actual.length).to.equal(2);
                    expect(actual[0]).to.equal('dessert');
                    expect(actual[1]).to.equal('moderate');
                });
            });

            describe('and when: tag group is not an array', function () {

                before(function () {
                    input = [
                        ['food:Meal:Dessert'  ],
                        'food:Dish type:Cake', 
                        ['food:Difficulty:Moderate']
                    ];
                });

                it('should ignore the tag group', function () {
                    var actual = mappingFunctions.mapTags(input);
                    expect(actual.length).to.equal(2);
                    expect(actual[0]).to.equal('dessert');
                    expect(actual[1]).to.equal('moderate');
                });
            });

            describe('and when: tag contains invalid characters', function () {

                before(function () {
                    input = [['food:Meal:[{"Dessert"}]']]
                });

                it('should strip invalid characters from the tag', function () {
                    var actual = mappingFunctions.mapTags(input);
                    expect(actual.length).to.equal(1);
                    expect(actual[0]).to.equal('dessert');
                });
            });

            describe('and when: tag contains all invalid characters', function () {

                before(function () {
                    input = [['food:Meal:[{""}]']]
                });

                it('should ignore the tag', function () {
                    var actual = mappingFunctions.mapTags(input);
                    expect(actual).to.exist.and.be.empty;
                });
            });

        });

        describe('when: tag groups not set', function () {

            before(function () {
                input = [];
            });

            it('should return an empty array', function () {
                var actual = mappingFunctions.mapTags(input);
                expect(actual).to.exist.and.to.be.empty;
            });
        });

    });

    describe('mapRecipeContent', function () {

        var input;

        describe("when: recipe content items set", function () {

            before(function () {
                input = ['<p>Lorem</p>', '<p>ipsum</p>', '<p>dolor</p>'];
            });

            it('should append each content item to a string', function () {
                var actual = mappingFunctions.mapRecipeContent(input);
                expect(actual).to.equal('<p>Lorem</p><p>ipsum</p><p>dolor</p>');
            });

            describe('and when: empty content items exist', function () {

                before(function () {
                    input = ['<p>Lorem</p>', '', '<p>dolor</p>']
                });

                it('should ignore the empty items', function () {
                    var actual = mappingFunctions.mapRecipeContent(input);
                    expect(actual).to.equal('<p>Lorem</p><p>dolor</p>');
                });
            });

        });

        describe("when: recipe content items not set", function () {

            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeContent(null);
                expect(actual).to.be.empty;
            });

        });
    });

});