var builder = require('../../../lib/builders/rssBuilder');
var shared = require('mocha-shared');

describe('rssBuilder', function() {
    var defaultChannelData = {
        pageTitle_t: "Recipes, Celebrity News, Diet, Living, Family, Food Recipes : Australian Women's Weekly",
        siteUrl_t: 'http://www.aww.com.au/',
        pageMetaDescription_t: "Food Recipes, Latest Recipe Collections, Celebrity News, Diet, Living, Family, Parenting, Relationships, Style - Australian Women’s Weekly."
    };
    var defaultItemData = {
        pageTitle_t: 'Item Title',
        pageMetaDescription_t: 'Item Short Teaser Summary',
        contentImageUrl_t: 'http://what.image.com'
    };

    shared.behaviour('should have the correct rss feed fields', function(actualFeedOptions) {
        var expectedResult = {
            title: "Recipes, Celebrity News, Diet, Living, Family, Food Recipes : Australian Women's Weekly",
            site_url: 'http://www.aww.com.au/',
            description: "Food Recipes, Latest Recipe Collections, Celebrity News, Diet, Living, Family, Parenting, Relationships, Style - Australian Women’s Weekly.",
            copyright: (new Date()).getFullYear() + ' BAUER MEDIA PTY LIMITED',
            ttl: 60
        };

        it('should have title set to: ' + expectedResult.title, function() {
            expect(actualFeedOptions.title).to.be.equal(expectedResult.title);
        });

        it('should have site URL set to: ' + expectedResult.site_url, function() {
            expect(actualFeedOptions.site_url).to.be.equal(expectedResult.site_url);
        });

        it('should have description set to: ' + expectedResult.description, function() {
            expect(actualFeedOptions.description).to.be.equal(expectedResult.description);
        });

        it('should have copyright set to: ' + expectedResult.copyright, function() {
            expect(actualFeedOptions.copyright).to.be.equal(expectedResult.copyright);
        });

        it('should have ttl set to: ' + expectedResult.ttl, function() {
            expect(actualFeedOptions.ttl).to.be.equal(expectedResult.ttl);
        });
    });

    describe('buildShortRssFeed', function() {
        var data = [
            defaultChannelData,
            [defaultItemData]
        ];

        describe('the channel data', function() {
            var actualFeed = builder.buildShortRssFeed(data);
            shared.behaviour('should have the correct rss feed fields', actualFeed);
        });

        describe('the items data', function() {
            describe('when there are no items for the feed', function() {

                before(function() {
                    data[1] = null;
                });

                after(function() {
                    data[1] = [defaultItemData]
                });

                var actualFeed = builder.buildShortRssFeed(data);
                shared.behaviour('should have the correct rss feed fields', actualFeed);

                it('should have a new RSS feed without any items', function() {
                    actualFeed = builder.buildShortRssFeed(data);
                    expect(actualFeed.items.length).to.equal(0);
                });

            });

            describe('when there are items for the feed', function() {
                var actualFeed = builder.buildShortRssFeed(data);
                var expectedItems = data[1];

                shared.behaviour('should have the correct rss feed fields', actualFeed);

                it('should have a new RSS feed with an item', function() {
                    expect(actualFeed.items.length).to.equal(expectedItems.length);
                });

                it('should have item title set to: ' + expectedItems[0].pageTitle_t, function() {
                    expect(actualFeed.items[0].title).to.be.equal(expectedItems[0].pageTitle_t);
                });

                it('should have item description set to: ' + expectedItems[0].pageMetaDescription_t, function() {
                    expect(actualFeed.items[0].description).to.be.equal(expectedItems[0].pageMetaDescription_t);
                });

                it('should have item enclosure url set to: ' + expectedItems[0].contentImageUrl_t, function() {
                    expect(actualFeed.items[0].enclosure.url).to.be.equal(expectedItems[0].contentImageUrl_t + '?width=800');
                });

                describe('and when item has no image url', function() {
                    before(function() {
                        expectedItems[0].contentImageUrl_t = null;
                    });

                    after(function() {
                        expectedItems[0]. contentImageUrl_t = 'http://what.image.com'
                    });

                    it ('should have no item enclosure', function() {
                        var feed = builder.buildShortRssFeed(data);
                        expect(feed.items[0].enclosure).to.be.falsy;
                    });
                })

            });
        });


    });

});