var mappingFunctions = require('../../../app/helpers/mappingFunctions');

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

        var testImageUrl = 'http://www.example.com/images/test.png?height=600';
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

    describe('mapAuthorContent', function () {

        var inputJSON;
        var siteName;

        describe("when: author content items set", function () {

            before(function() {
                inputJSON = '[{\"title\":\"Amber Manto\",\"summaryTitle\":\"Amber Manto\",\"typeName\":\"TeaserDto\",\"id\":\"NOW-18977\",\"parentId\":\"NOW-1166\",\"level\":3,\"sortOrder\":226,\"name\":\"Amber Manto\"}]';
                siteName = 'now';
            });

            it('should set the expected name', function () {
                var actual = mappingFunctions.mapAuthorContent(inputJSON, siteName);
                expect(actual).to.equal('Amber Manto');
            });
        });

        describe("when: author content items not set and site name set", function () {

            before(function() {
                inputJSON = '';
                siteName = 'now';
            });

            it('should set the expected name', function () {
                var actual = mappingFunctions.mapAuthorContent(inputJSON, siteName);
                expect(actual).to.equal('Now To Love');
            });
        });

        describe("when: author content items set and site name not set", function () {

            before(function() {
                inputJSON = '[{\"title\":\"Amber Manto\",\"summaryTitle\":\"Amber Manto\",\"typeName\":\"TeaserDto\",\"id\":\"NOW-18977\",\"parentId\":\"NOW-1166\",\"level\":3,\"sortOrder\":226,\"name\":\"Amber Manto\"}]';
                siteName = '';
            });

            it('should set the expected name', function () {
                var actual = mappingFunctions.mapAuthorContent(inputJSON, siteName);
                expect(actual).to.equal('Amber Manto');
            });
        });

        describe("when: author content items not set and site name not set", function () {

            before(function() {
                inputJSON = '';
                siteName = '';
            });

            it('should set the expected name', function () {
                var actual = mappingFunctions.mapAuthorContent(inputJSON, siteName);
                expect(actual).to.equal('');
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

    describe('mapRecipeIngredients', function () {

        var input = [
            {
                heading: 'Test heading 1',
                ingredients: [
                    {
                        quantity: "800",
                        measure: "gram",
                        food: "trimmed pork shoulder"
                    },
                    {
                        quantity: "2",
                        measure: "tablespoons",
                        food: "olive oil"
                    }
                ]
            },
            {
                heading: 'Test heading 2',
                ingredients: []
            },
            {
                heading: 'Test heading 3',
                ingredients: [
                    {
                        quantity: "1",
                        measure: "",
                        food: "brown onion, chopped"
                    },
                    {
                        quantity: "1",
                        measure: "clove",
                        food: "garlic"
                    },
                    {
                        quantity: "",
                        measure: "",
                        food: "salt and pepper to taste"
                    }
                ]
            }
        ];

        describe('when: ingredients data set', function () {

            it('should return correctly formatted ingredients html', function () {
                var actual = mappingFunctions.mapRecipeIngredients(JSON.stringify(input));
                expect(actual).to.have.string('<h3>Test heading 1</h3>');
                expect(actual).to.have.string('<li>800 grams trimmed pork shoulder</li>');
                expect(actual).to.have.string('<li>2 tablespoons olive oil</li>');
                expect(actual).to.not.have.string('<h3>Test heading 2</h3>');
                expect(actual).to.have.string('<h3>Test heading 3</h3>');
                expect(actual).to.have.string('<li>1 brown onion, chopped</li>');
                expect(actual).to.have.string('<li>1 clove garlic</li>');
                expect(actual).to.have.string('<li>salt and pepper to taste</li>');
            });
        });

        describe('when: ingredients data not set', function () {

            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeIngredients('[]');
                expect(actual).to.be.empty;
            });
        });

        describe('when: invalid json', function () {

            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeIngredients('BAD JSON');
                expect(actual).to.be.empty;
            });
        });

    });

    describe('mapRecipeCookingMethod', function () {

        var input = [
            {
                heading: 'Test heading 1',
                methods: [
                    {
                        method: 'Preheat oven to 160°C.'
                    },
                    {
                        method: 'Season pork. Heat oil in a large heavy-based saucepan over high heat.'
                    }
                ]
            },
            {
                heading: 'Test heading 2',
                methods: []
            },
            {
                heading: 'Test heading 3',
                methods: [
                    {
                        method: 'Heat oil in a large saucepan on medium-high.'
                    }
                ]
            }
        ];

        describe('when: cooking method data set', function () {

            it('should return correctly formatted cooking method html', function () {
                var actual = mappingFunctions.mapRecipeCookingMethod(JSON.stringify(input));
                expect(actual).to.have.string('<h3>Test heading 1</h3>');
                expect(actual).to.have.string('<li>Preheat oven to 160°C.</li>');
                expect(actual).to.have.string('<li>Season pork. Heat oil in a large heavy-based saucepan over high heat.</li>');
                expect(actual).to.not.have.string('<h3>Test heading 2</h3>')
                expect(actual).to.have.string('<h3>Test heading 3</h3>');
                expect(actual).to.have.string('<li>Heat oil in a large saucepan on medium-high.</li>');
            });

        });

        describe('when: cooking method data not set', function () {

            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeCookingMethod('[]');
                expect(actual).to.be.empty;
            });
        });

        describe('when: invalid json', function () {

            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeCookingMethod('BAD JSON');
                expect(actual).to.be.empty;
            });
        });
    });

    describe('mapRecipeServings', function () {

        var input;

        describe('when: input data is set', function () {

            before(function () {
                input = {
                    serves: '4',
                    yieldQuantity: '2',
                    yieldMeasure: 'Cup'
                };
            });

            it('should correctly format the input', function () {
                var actual = mappingFunctions.mapRecipeServings(JSON.stringify(input));
                expect(actual).to.have.string('Serves: 4');
                expect(actual).to.have.string('Makes: 2 cups');
            });

            describe('and when: no serves value set', function () {

                before(function () {
                    input = {
                        yieldQuantity: '3',
                        yieldMeasure: 'Litres'
                    }
                });

                it('should not include serves in the output', function () {
                    var actual = mappingFunctions.mapRecipeServings(JSON.stringify(input));
                    expect(actual).to.have.string('Makes: 3 litres');
                    expect(actual).to.not.have.string('Serves:');
                });
            });

            describe('and when: no yield quantity is set', function () {

                before(function () {
                    input = {
                        serves: '4',
                        yieldMeasure: 'Cup'
                    }
                });

                it('should not include a yield in the output', function () {
                    var actual = mappingFunctions.mapRecipeServings(JSON.stringify(input));
                    expect(actual).to.have.string('Serves: 4');
                    expect(actual).to.not.have.string('Makes:');
                });
            });

            describe('and when: yield measure is not set', function () {

                before(function () {
                    input = {
                        yieldQuantity: '2'
                    }
                });

                it('should not include any yield measure', function () {
                    var actual = mappingFunctions.mapRecipeServings(JSON.stringify(input));
                    expect(actual).to.have.string('Makes: 2</');
                })
            });

            describe('and when: yield measure = \'Item\'', function () {

                before(function () {
                    input = {
                        yieldQuantity: '2',
                        yieldMeadure: 'Item'
                    }
                });

                it('should not include any yield measure', function () {
                    var actual = mappingFunctions.mapRecipeServings(JSON.stringify(input));
                    expect(actual).to.have.string('Makes: 2</');
                })
            });

        });

        describe('when: invalid json', function () {

            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeServings('BAD JSON');
                expect(actual).to.be.empty;
            });

        });

    });

    describe('mapRecipeCookingTime', function () {

        var input = {
            times: [
                {
                    id: 'preparation',
                    minutes: 15.0,
                },
                {
                    id: 'cooking',
                    minutes: 60.0,
                    label: '(plus cooling)'
                },
                {
                    id: 'marinating',
                    minutes: 90.0,
                },
                {
                    id: 'resting',
                    minutes: 0.0,
                },
                {
                    id: 'party',
                    minutes: 480.0,
                },
                {
                    id: 'work',
                    minutes: 61.0,
                },
                {
                    id: 'lunch',
                    minutes: 120.167
                },
                {
                    id: 'business',
                    minutes: 60.0167
                }
            ]
        };

        describe('when: input data is set', function () {

            it('should correctly format the input', function () {
                var actual = mappingFunctions.mapRecipeCookingTime(JSON.stringify(input));
                expect(actual).to.have.string('Preparation time: 15 minutes');
                expect(actual).to.have.string('Cooking time: 1 hour (plus cooling)');
                expect(actual).to.have.string('Marinating time: 1 hour 30 minutes');
                expect(actual).to.not.have.string('Resting time:');
                expect(actual).to.have.string('Party time: 8 hours');
                expect(actual).to.have.string('Work time: 1 hour 1 minute');
                expect(actual).to.have.string('Lunch time: 2 hours 10 seconds');
                expect(actual).to.have.string('Business time: 1 hour 1 second')
            });

        });

        describe('when: input data contains no time values', function () {
            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeCookingTime('{}');
                expect(actual).to.be.empty;
            });
        });

        describe('when: invalid json', function () {
            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeCookingTime('BAD JSON');
                expect(actual).to.be.empty;
            });

        });

    });

    describe('mapRecipeImage', function () {

        describe('when: image url is set', function () {
            it('should correctly format the input', function () {
                var actual = mappingFunctions.mapRecipeImage('http://www.example.com/test.jpg');
                expect(actual).to.have.string('<img src="http://www.example.com/test.jpg?width=800" />')
            });

            describe('and when: an image width is set', function () {
                it('should use the width value instead of the default', function () {
                    var actual = mappingFunctions.mapRecipeImage('http://www.example.com/test.jpg', 400);
                    expect(actual).to.have.string('<img src="http://www.example.com/test.jpg?width=400" />')
                });
            });
        });

        describe('when: image url is empty', function () {
            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeImage('');
                expect(actual).to.be.empty;
            });
        });

    });

    describe('mapRecipeTips', function () {

        describe('when input data is set', function () {

            var input = 'Lorem ipsum.\nDolor sit amet.';

            it('should correctly format the input', function () {
                var actual = mappingFunctions.mapRecipeTips(input);
                expect(actual).to.have.string('<h3>Tips</h3>');
                expect(actual).to.have.string('<p>Lorem ipsum.</p>');
                expect(actual).to.have.string('<p>Dolor sit amet.</p>');
            });
        });

        describe('when: input data is empty', function () {
            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeTips('');
                expect(actual).to.be.empty;
            });
        });

    });

    describe('mapRecipeSource', function () {

        describe('when: valid input data is set', function () {

            it('should correctly format the input', function () {
                var actual = mappingFunctions.mapRecipeSource('Woman\'s Day');
                expect(actual).to.have.string('Recipe by: Woman\'s Day');
            });

            describe('and when: input value = \'Recipes Plus\'', function () {
                it('should use value \'Recipes+\' instead', function () {
                    var actual = mappingFunctions.mapRecipeSource('Recipes Plus');
                    expect(actual).to.have.string('Recipe by: Recipes+');
                });
            });

            describe('and when: input value = \'Taste\'', function () {
                it('should use value \'Food To Love\' instead', function () {
                    var actual = mappingFunctions.mapRecipeSource('Taste');
                    expect(actual).to.have.string('Recipe by: Food To Love');
                });
            });

        });

        describe('when: input data is an excluded source', function () {
            it('should return an empty string', function () {
                var actual1 = mappingFunctions.mapRecipeSource('Commercial');
                var actual2 = mappingFunctions.mapRecipeSource('Supplied');
                expect(actual1).to.be.empty;
                expect(actual2).to.be.empty;
            });
        });

        describe('when: input data is empty', function () {
            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeSource('');
                expect(actual).to.be.empty;
            });
        });

    });

    describe('mapRecipeProperty', function () {

        describe('when: input data and label are set', function () {
            it('should correctly format the input', function () {
                var actual = mappingFunctions.mapRecipeProperty('Test', 'Lorem ipsum');
                expect(actual).to.have.string('Test: Lorem ipsum');
            });
        });

        describe('when: input data is empty', function () {
            it('should return an empty string', function () {
                var actual = mappingFunctions.mapRecipeProperty('Test', '');
                expect(actual).to.be.empty;
            });
        });
    });

    describe('mapCategories', function () {

        var input;

        describe('when: input data is set', function () {

            before(function () {
                input = ['A', ['B', 'C'], 'D'];
            });

            it('should concatenate all input items into a single array', function () {
                var actual = mappingFunctions.mapCategories(input);
                expect(actual.length).to.equal(4);
                expect(actual.join(',')).to.equal('A,B,C,D');
            });

            describe('and when: an input item is empty', function () {

                before(function () {
                    input = ['A', ['B', 'C'], [], '', 'D'];
                });

                it('should ignore the item', function () {
                    var actual = mappingFunctions.mapCategories(input);
                    expect(actual.length).to.equal(4);
                    expect(actual.join(',')).to.equal('A,B,C,D');
                });

            });
        });

        describe('when: input data is not set', function () {
            it('should return an empty array', function () {
                var actual = mappingFunctions.mapCategories(null);
                expect(actual).to.be.empty;
            });
        });

    });

});