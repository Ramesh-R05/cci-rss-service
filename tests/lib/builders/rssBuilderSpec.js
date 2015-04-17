var builder = require('../../../lib/builders/rssBuilder');
var shared = require('mocha-shared');

describe('rssBuilder', function() {

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

        describe('when there are no items for the feed', function() {
            var actualFeed = builder.buildShortRssFeed();

            shared.behaviour('should have the correct rss feed fields', actualFeed);

            it('should have a new RSS feed without any items', function() {
                expect(actualFeed.items.length).to.equal(0);
            });

        });

        describe('when there are items for the feed', function() {
            var items = [
                {
                    contentTitle_t: 'Item Title',
                    contentSummary_t: 'Item Short Teaser Summary',
                    contentImageUrl_t: 'http://what.image.com'
                }
            ];

            var actualFeed = builder.buildShortRssFeed('aww', items);

            shared.behaviour('should have the correct rss feed fields', actualFeed);

            it('should have a new RSS feed with an item', function() {
                expect(actualFeed.items.length).to.equal(items.length);
            });

            it('should have item title set to: ' + items[0].contentTitle_t, function() {
                expect(actualFeed.items[0].title).to.be.equal(items[0].contentTitle_t);
            });

            it('should have item description set to: ' + items[0].contentSummary_t, function() {
                expect(actualFeed.items[0].description).to.be.equal(items[0].contentSummary_t);
            });

            it('should have item enclosure url set to: ' + items[0].contentImageUrl_t, function() {
                expect(actualFeed.items[0].enclosure.url).to.be.equal(items[0].contentImageUrl_t);
            });

            describe('and when item has no content summary', function() {

                before(function() {
                   items[0].contentSummary_t = null;
                });

                after(function() {
                    items[0].contentSummary_t = 'Item Short Teaser Summary';
                });

                it('should have item description set to item title', function() {
                    var feed = builder.buildShortRssFeed('aww', items);
                    expect(feed.items[0].description).to.be.equal(items[0].contentTitle_t);
                });
            });

            describe('and when item has no image url', function() {
                before(function() {
                    items[0].contentImageUrl_t = null;
                });

                after(function() {
                    items[0]. contentImageUrl_t = 'http://what.image.com'
                });

                it ('should have no item enclosure', function() {
                    var feed = builder.buildShortRssFeed('aww', items);
                    expect(feed.items[0].enclosure).to.be.falsy;
                });
            })

        });
    });

    describe('getSiteFeedOptions', function() {
        var feedOption = builder.getSiteFeedOptions('aww');

        shared.behaviour('should have the correct rss feed fields', feedOption);

    });

});