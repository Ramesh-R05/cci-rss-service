var mappingHelper = require('../../../lib/helpers/mappingHelper');
var configHelper = require('../../../lib/helpers/configHelper');

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
                mappings: ["channel.default", "channel.sponsors"],
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
                mappings: ["item.default", "item.sponsors"],
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

});