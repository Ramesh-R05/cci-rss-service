var builder = require('../../../app/builders/rssBuilder');

describe('rssBuilder', function () {

    var testData = [
        {
            key: 'channel',
            data: [
                {
                    title: 'Donec magna purus',
                    feed_url: 'http://www.example.com/rss/some-feed',
                    site_url: 'http://www.aww.com.au',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    copyright: '2015 Bauer Media Pty Ltd',
                    ttl: 60,
                    custom_namespaces: {
                        mvcf: 'http://feed.aww.com.au/ns/mvcf'
                    }
                }
            ]
        },
        {
            key: 'items',
            data: [
                {
                    title: 'Donec blandit eget ex feugiat',
                    description: 'Morbi tortor eros, blandit id libero eu, accumsan facilisis leo.',
                    url: 'http://www.example.com/test/some-page',
                    enclosure: {
                        url: 'http://www.example.com/images/test.jpg?width=800',
                        type: 'image/jpeg'
                    },
                    categories: ['Kellogs'],
                    custom_elements: [
                        {
                            "mvcf: is_bauer_native": true
                        },
                        {
                            "mvcf:is_bauer_advertorial": false
                        }
                    ]
                }
            ]
        }
    ]

    describe('buildFeed', function () {

        var actual = builder.buildFeed(testData);

        describe('when: channel data set', function () {

            it('should have a title', function () {
                expect(actual.title).to.equal(testData[0].data[0].title);
            });

            it('should have a feed url', function () {
                expect(actual.feed_url).to.equal(testData[0].data[0].feed_url);
            });

            it('should have a site url', function () {
                expect(actual.site_url).to.equal(testData[0].data[0].site_url);
            });

            it('should have a description', function () {
                expect(actual.description).to.equal(testData[0].data[0].description);
            });

            it('should have a copyright', function () {
                expect(actual.copyright).to.equal(testData[0].data[0].copyright);
            });

            it('should have a ttl', function () {
                expect(actual.ttl).to.equal(testData[0].data[0].ttl);
            });


            describe('if custom namespace data exists', function () {
                it('should have a custom namespace', function () {
                    expect(actual.custom_namespaces).to.exist.and.to.not.be.empty;
                });
            })

            describe('if custom namespace data does not exist', function () {

                var originalVal;

                before(function () {
                    originalVal = testData[0].data[0].custom_namespaces;
                    delete testData[0].data[0].custom_namespaces;
                });

                after(function () {
                    testData[0].data[0].custom_namespace = originalVal;
                });

                it('should not have a custom namespace', function () {
                    var result = builder.buildFeed(testData);
                    expect(result.custom_namespaces).to.be.empty;
                });

            })
            

        })

        describe('when: channel data not set', function () {

            it('should throw an error', function () {
                expect(builder.buildFeed.bind(builder,[])).to.throw(Error);
            });
        })

        describe('when: items data set', function () {

            var item = actual.items[0];

            it('should have feed items', function () {
                expect(actual.items).to.exist.and.to.not.be.empty;
            });

            it('should have an item title', function () {
                expect(item.title).to.equal(testData[1].data[0].title);
            });

            it('should have an item description', function () {
                expect(item.description).to.equal(testData[1].data[0].description);
            });

            it('should have an item url', function () {
                expect(item.url).to.equal(testData[1].data[0].url);
            });


            describe('if enclosure data exists', function () {

                it('should have an item enclosure', function () {
                    expect(item.enclosure).to.exist;
                    expect(item.enclosure.url).to.equal(testData[1].data[0].enclosure.url);
                    expect(item.enclosure.type).to.equal(testData[1].data[0].enclosure.type);
                });

            });

            describe('if enclosure data does not exist', function () {

                var originalVal;

                before(function () {
                    originalVal = testData[1].data[0].enclosure;
                    delete testData[1].data[0].enclosure;
                });

                after(function () {
                    testData[1].data[0].enclosure = originalVal;
                });

                it('should not have an item enclosure', function () {
                    var result = builder.buildFeed(testData);
                    expect(result.items[0].enclosure).to.be.false;
                });

            });

            describe('if category data exists', function () {
                it('should have an item category', function () {
                    expect(item.categories).to.exist;
                    expect(item.categories.length).to.be.above(0);
                    expect(item.categories[0]).to.equal('Kellogs');
                });
            });

            describe('if category data does not exist', function () {

                var originalVal;

                before(function () {
                    originalVal = testData[1].data[0].categories;
                    delete testData[1].data[0].categories;
                });

                after(function () {
                    testData[1].data[0].categories = originalVal;
                });

                it('should not have item categories', function () {
                    var result = builder.buildFeed(testData);
                    expect(result.items[0].categories).to.exist.and.be.empty;
                });

            });

            describe('if custom element data exists', function () {
                it('should have item custom elements', function () {
                    expect(item.custom_elements).to.exist.and.to.not.be.empty;
                })
            });

            describe('if custom element data does not exist', function () {

                var originalVal;

                before(function () {
                    originalVal = testData[1].data[0].custom_elements;
                    delete testData[1].data[0].custom_elements;
                });

                after(function () {
                    testData[1].data[0].custom_elements = originalVal;
                });

                it('should not have item custom elements', function () {
                    var result = builder.buildFeed(testData);
                    expect(result.items[0].custom_elements).to.exist.and.to.be.empty;
                })
            });

        });

        describe('when: items data not set', function () {

            var originalVal;

            before(function () {
                originalVal = testData[1].data;
                testData[1].data = [];
            });

            after(function () {
                testData[1].data = originalVal;
            });

            it('should contain no feed items', function () {
                var result = builder.buildFeed(testData);
                expect(result.items).to.be.empty;
            });

        });

    });

});