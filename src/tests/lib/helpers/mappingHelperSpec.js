var mappingHelper = require('../.././helpers/mappingHelper');
var configHelper = require('../.././helpers/configHelper');

describe('mappingHelper', function () {

    var testProps = {
        site: 'aww',
        request: {
            protocol: 'http',
            originalUrl: '/rss/some-feed',
            get: function (x) {
                if (x.toLowerCase() === 'host') {
                    return 'www.example.com'
                }
            }
        },
        solrData: [
            {
                key: 'channel',
                mappings: ["channel.default", "channel.sponsored"],
                data: [
                    {
                        pageTitle_t: 'Donec magna purus',
                        siteUrl_t: 'http://www.aww.com.au',
                        pageMetaDescription_t: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                    }
                ]
            },
            {
                key: 'items',
                mappings: ["item.default", "item.sponsored"],
                data: [
                    {
                        pageTitle_t: '',
                        contentTitle_t: '',
                        nodeName_t: 'Donec blandit eget ex feugiat',
                        pageMetaDescription_t: 'Morbi tortor eros, blandit id libero eu, accumsan facilisis leo.',
                        siteUrl_t: 'http://www.example.com',
                        url_t: '/test/some-page',
                        contentImageUrl_t: 'http://www.example.com/images/test.jpg',
                        contentCampaign_t: '[{ "campaignType": "Native", "sponsor": "Kellogs" }]'
                    }
                ]
            }
        ]
    }

    testProps.config = configHelper.config(testProps.site, testProps);

    describe('mapSolrData', function () {

        describe('when: solr data set', function () {

            var actual;
            var channelData;
            var itemsData;

            before(function () {
                actual = mappingHelper.mapSolrData(testProps);
                channelData = actual[0].data;
                itemsData = actual[1].data;
            });

            it('should return channel data', function () {

                expect(channelData).exist;
                expect(channelData.length).to.equal(testProps.solrData[0].data.length);

            });

            it('should return items data', function () {

                expect(itemsData).to.exist;
                expect(itemsData.length).to.equal(testProps.solrData[1].data.length);

            });


            describe('when: channel data returned', function () {

                var channel;

                before(function () {
                    channel = channelData[0];
                });

                it('should have a channel title', function () {
                    expect(channel.title).to.equal(testProps.solrData[0].data[0].pageTitle_t);
                })

                it('should have a channel feed url', function () {
                    var expectedFeedUrl = 'http://www.example.com/rss/some-feed';
                    expect(channel.feed_url).to.equal(expectedFeedUrl);
                });

                it('should have a channel site url', function () {
                    expect(channel.site_url).to.equal(testProps.solrData[0].data[0].siteUrl_t);
                });

                it('should have a channel description', function () {
                    expect(channel.description).to.equal(testProps.solrData[0].data[0].pageMetaDescription_t);
                });

                it('should have a channel copyright', function () {
                    expect(channel.copyright.length).to.be.above(0);
                });

                it('should have a channel ttl', function () {
                    expect(channel.ttl).to.be.above(0);
                });

                it('should have a channel custom namespace', function () {
                    expect(channel.custom_namespaces).to.exist;
                    expect(channel.custom_namespaces).to.not.be.empty;
                });

            });


            describe('when: items data returned', function () {

                var item;

                before(function () {
                    item = itemsData[0];
                });

                it('should have an item title', function () {
                    expect(item.title).to.equal(testProps.solrData[1].data[0].nodeName_t);
                });

                it('should have an item description', function () {
                    expect(item.description).to.equal(testProps.solrData[1].data[0].pageMetaDescription_t);
                });

                it('should have an item url', function () {
                    var expectedItemUrl = 'http://www.example.com/test/some-page';
                    expect(item.url).to.equal(expectedItemUrl);
                });

                it('should have an item enclosure', function () {
                    var expectedEnclosureUrl = testProps.solrData[1].data[0].contentImageUrl_t + '?width=800';
                    expect(item.enclosure).to.exist;
                    expect(item.enclosure.url).to.equal(expectedEnclosureUrl)
                    expect(item.enclosure.type).to.equal('image/jpeg');
                });


                it('should have an item category', function () {
                    expect(item.categories).to.exist;
                    expect(item.categories.length).to.be.above(0);
                    expect(item.categories[0].toLowerCase()).to.equal('kellogs');
                });

                it('should have an item custom elements', function () {
                    expect(item.custom_elements).to.exist;
                    expect(item.custom_elements.length).to.be.above(0);
                    expect(item.custom_elements[0]['mvcf:is_bauer_native']).to.be.true;
                    expect(item.custom_elements[1]['mvcf:is_bauer_advertorial']).to.be.false;
                });

            });

        });

    });

    describe('mapValue', function () {

        var config;
        var defaultValue = '!';
        var mapData = {
            a: 'lorem',
            b: {
                x: 'ipsum',
                y: 'dolor'
            },
            c: 'sit'
        }

        describe('when: map config is a string', function () {

            it('should return the corresponding property from the mapping data', function () {
                var actual = mappingHelper.mapValue('b.x', mapData, defaultValue);
                expect(actual).to.equal('ipsum');
            });

            describe('and when: the property does not exist in the mapping data', function () {
                it('should return the default value', function () {
                    var actual = mappingHelper.mapValue('b.z', mapData, defaultValue);
                    expect(actual).to.equal(defaultValue);
                });
            });
        });

        describe('when: map config is a mapping function config object', function () {

            before(function () {
                config = {
                    fn: 'format',
                    params: ['[%s]', '@b.y']
                };
            });

            it('should execute the mapping function and return the result', function () {
                var actual = mappingHelper.mapValue(config, mapData, defaultValue);
                expect(actual).to.equal('[dolor]');
            });
        })

        describe('when: map config is an unsupported type', function () {
            it('should return the default value', function () {
                var actual = mappingHelper.mapValue(['b.x'], mapData, defaultValue);
                expect(actual).to.equal(defaultValue);
            });
        });

    });

    describe('mapObjectArray', function () {

        var config;
        var mapData = {
            a: 'lorem',
            b: {
                x: 'ipsum',
                y: 'dolor'
            },
            c: 'sit'
        }

        describe('when: mapping config set', function () {

            before(function () {
                config = {
                    x: {
                        map: 'a'
                    },
                    y: {
                        map: 'b.x'
                    },
                    z: {
                        map: 'b.y'
                    }
                };
            });

            it('should return a mapped object for each item in the mapping config', function () {
                var actual = mappingHelper.mapObjectArray(config, mapData);
                expect(actual.length).to.equal(3);
                expect(actual[0].x).to.equal('lorem');
                expect(actual[1].y).to.equal('ipsum');
                expect(actual[2].z).to.equal('dolor');
            });

        });

        describe('when: mapping config is empty', function () {
            it('should return an empty array', function () {
                var actual = mappingHelper.mapObjectArray({}, mapData);
                expect(actual).to.exist.and.be.empty;
                expect(actual instanceof Array).to.be.true;
            });
        });

    });

    describe('mapObject', function () {

        var config;
        var mapData = {
            a: 'lorem',
            b: {
                x: 'ipsum',
                y: 'dolor'
            },
            c: 'sit'
        };

        describe('when: mapping config set', function () {

            before(function () {
                config = {
                    x: {
                        map: 'b.y'
                    },
                    y: {
                        map: 'c'
                    }
                };
            });

            it('should return an object with each item in the mapping config mapped', function () {
                var actual = mappingHelper.mapObject(config, mapData);
                expect(actual).to.exist.and.not.be.empty;
                expect(actual.x).to.equal('dolor');
                expect(actual.y).to.equal('sit');
            });
        });

        describe('when: mapping config is empty', function () {
            it('should return an empty object', function () {
                var actual = mappingHelper.mapObject({}, mapData);
                expect(actual).to.exist.and.be.empty;
            });
        });

    });

    describe('mapArray', function () {

        var config;
        var defaultValue = '!';
        var mapData = {
            a: 'lorem',
            b: {
                x: 'ipsum',
                y: 'dolor'
            },
            c: 'sit'
        }

        describe('when: mapping config is set', function () {

            before(function () {
                config = [
                    'a',
                    'b.x',
                    'b.y',
                    'c'
                ];
            });

            it('should return an array of mapped values', function () {
                var actual = mappingHelper.mapArray(config, mapData, defaultValue, null);
                expect(actual.length).to.equal(4);
                expect(actual.join(' ')).to.equal('lorem ipsum dolor sit');
            });

            describe('and when: mapping config is not an array', function () {
                it('should return an empty array', function () {
                    var actual = mappingHelper.mapArray({ x: { map: 'b.x' }}, mapData, defaultValue, null);
                    expect(actual).to.exist.and.be.empty;
                    expect(actual instanceof Array).to.be.true;
                });
            });

            describe('and when: post map functions are set', function () {

                var postMapFunctions;
                before(function () {
                    postMapFunctions = [
                        {
                            fn: 'format',
                            params: ['[%s]']
                        }
                    ];
                });

                it('should apply the post map functions to each mapped item', function () {
                    var actual = mappingHelper.mapArray(config, mapData, defaultValue, postMapFunctions);
                    expect(actual.length).to.equal(4);
                    expect(actual.join(' ')).to.equal('[lorem] [ipsum] [dolor] [sit]');
                });
            });

        });

        describe('when: mapping config is not set', function () {
            it('should return an empty array', function () {
                var actual = mappingHelper.mapArray(null, mapData, defaultValue, null);
                expect(actual).to.exist.and.be.empty;
                expect(actual instanceof Array).to.be.true;
            });
        });

    });

    describe('map', function () {

        var mapData = {
            a: 'lorem',
            b: {
                x: 'ipsum',
                y: 'dolor'
            },
            c: 'sit'
        };

        describe('when: mapping config is set', function () {
            it('should return a mapped value', function () {
                var actual = mappingHelper.map('b.y', mapData, null, null);
                expect(actual).to.equal('dolor');
            });

            describe('and when: the mapping config is an array', function () {
                it('should return the first successfully mapped value from the config', function () {
                    var actual = mappingHelper.map(['d', 'b.z', 'b.y', 'b.x'], mapData, null, null);
                    expect(actual).to.equal('dolor');
                })
            });

            describe('and when: post map functons are set', function () {

                var postMapFunctions;
                before(function () {
                    postMapFunctions = [
                        {
                            fn: 'format',
                            params: ['[%s]']
                        }
                    ];
                });

                it('should apply the post map functions to the mapped value', function () {
                    var actual = mappingHelper.map(['d', 'b.z', 'b.y', 'b.x'], mapData, null, postMapFunctions);
                    expect(actual).to.equal('[dolor]');
                });
            });
        });

        describe('when: mapping config is not set', function () {
            it('should return the default value', function () {
                var actual = mappingHelper.map(null, mapData, null, null);
                expect(actual).to.be.empty;
            });
        });

    });

});