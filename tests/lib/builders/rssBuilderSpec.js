var builder = require('../../../lib/builders/rssBuilder');

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


    });

});