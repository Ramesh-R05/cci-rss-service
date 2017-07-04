module.exports = {

    rssHeaderSchema: function() {
        return '<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">'
    },

    rssItemSchema1: function() {
       return '<item><title><![CDATA[' +
        'Joe Test Article]]></title><description><![CDATA[Joe Test Article]]></description><link>http://cosmo-site-au.sit.bxm.net.au/fashion/joe-test-article-17585</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/fashion/joe-test-article-17585</guid><c' +
        'ategory><![CDATA[Fashion]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator><pubDate>2017-04-05T12:50:18Z</pubDate><dc:modified>2017-06-22T11:18:44.18Z</dc:modified><enclosure url="http://dev.assets.cougar.bauer-media.net.au/s3/digital-cougar-assets' +
        '-dev/Dolly/2017/04/05/17585/image2.JPG?height=600" length="0" type="false"/><content:encoded><![CDATA[<p>Test Test</p>\n<div><img src="http://dev.assets.cougar.bauer-media.net.au/s3/digital-cougar-assets-dev/cosmo/2017/06/22/1498094310634_0020420cosmopolitan-au' +
        'stralia-magazine-subscription.jpeg?width=800" alt="This is an image caption" /><p>This is an image caption</p>\n</div>]]></content:encoded></item><item>',
       '<item><title><![CDATA[Emma Stone looked like a glittery ~*GoDdEsS*~ at the Venice 73rd Film Festival]]></title><des' +
       'cription><![CDATA[Emma Stone looked like a glittery ~GoDdEsS~ at the Venice 73rd Film Festival]]></description><link>http://dev.cosmo-site.bauer-media.net.au/fashion/emma-stone-73-venice-film-festival-16088</link><guid isPermaLink="true">http://dev.cosmo-site.b' +
       'auer-media.net.au/fashion/emma-stone-73-venice-film-festival-16088</guid><category><![CDATA[Fashion]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator><pubDate>2016-09-01T17:38:00Z</pubDate><dc:modified>2017-06-21T13:31:27.81Z</dc:modified><enclosur' +
       'e url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/Cosmo/2016/09/01/88154/emma-hs.jpg?height=600" length="0" type="image/jpeg"/><content:encoded>',
       '<item><tit' +
       'le><![CDATA[Emma Markezic: Make love, not war]]></title><description><![CDATA[Comedian Emma Markezic says even the nastiest of fights can have a silver lining]]></description><link>http://cosmo-site-au.sit.bxm.net.au/sex/emma-markezic-make-love-not-war-1198</li' +
       'nk><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/sex/emma-markezic-make-love-not-war-1198</guid><category><![CDATA[Sex]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator><pubDate>2012-01-03T15:38:00Z</pubDate><dc:modified>2017-06-21T1' +
       '5:22:09.08Z</dc:modified>'

    },


    rssItemSchema2: function() {
        return '<enclosure url="http://dev.assets.cougar.bauer-media.net.au/s3/digital-cougar-assets-dev/Dolly/2017/06/21/17593/Mid-century-style.jpg?height=600" length="0" type="imag' +
        'e/jpeg"/><content:encoded><![CDATA[<h2>Heading 1</h2><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliqu' +
        'ip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n<ol>\n<li>Lore' +
        'm ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </li>\n<li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>\n<li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>\n</ol>\n<ol>\n<li>Ut enim ad minim veniam, quis nostr' +
        'ud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>\n<li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia d' +
        'eserunt mollit anim id est laborum.</li>\n</ol>\n<p><a href="http://cosmo-site-au.sit.bxm.net.au/fashion/kev-test-17593" target="_blank">Watch video</a></p>\n<h2>Optional sub-heading</h2><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmo' +
        'd tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariat' +
        'ur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi' +
        'nim veniam.</p>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aut' +
        'e irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n]]></content:encoded></item>'
    },



    rssTopSchema: function() {
        return '<title><![CDATA[Cosm' +
            'o homepage test title]]></title><description><![CDATA[Cosmo homepage test meta description]]></description><link>http://dev.cosmo-site.bauer-media.net.au</link><generator>RSS for Node</generator>',
            '<atom:link href="http://dev.rss.services.bauer-media.net.au/rss/cosmo/full-content" rel="self" type="application/rss+xml"/><copyright>'
    },


    rssParItemSchema: function() {
        return '><item><title><![CDATA[Kev test short title]]></title><description><![CDATA[Kev test short teaser]]></descrip' +
        'tion><link>http://cosmo-site-au.sit.bxm.net.au/fashion/kev-test-17593</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/fashion/kev-test-17593</guid><category><![CDATA[Fashion]]></category><dc:creator><![CDATA[Emily Kerr]]></dc:creator>',
        '<enclosure url="http://dev.assets.cougar.bauer-media.net.au/s3/digital-cougar-assets-dev/Dolly/2017/06/21/17593/Mid-century-style.jpg?height=600" length="0" type="image/jpeg"/></item>',
        '<item><title><![CDATA[Joe Test Article]]></title><description><![CDATA[Joe Test Article]]></description><link>http://cosmo-site-au.sit.bxm.net.au/fashion/joe-test-article-17585</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/fashion/joe-te' +
        'st-article-17585</guid><category><![CDATA[Fashion]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator><pubDate>2017-04-05T12:50:18Z</pubDate><dc:modified>2017-06-22T11:18:44.18Z</dc:modified><enclosure url="http://dev.assets.cougar.bauer-media.net.au' +
        '/s3/digital-cougar-assets-dev/Dolly/2017/04/05/17585/image2.JPG?height=600" length="0" type="false"/></item>',
        '<item><title><![CDATA[Emma Stone looked like a glittery ~*GoDdEsS*~ at the Venice 73rd Film Festival]]></title><description><![CDATA[Emma Stone looked li' +
        'ke a glittery ~GoDdEsS~ at the Venice 73rd Film Festival]]></description><link>http://dev.cosmo-site.bauer-media.net.au/fashion/emma-stone-73-venice-film-festival-16088</link><guid isPermaLink="true">http://dev.cosmo-site.bauer-media.net.au/fashion/emma-stone-7' +
        '3-venice-film-festival-16088</guid><category><![CDATA[Fashion]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator>',
        '<enclosure url="http://d3lp4xedbqa8a5.cloudfron' +
        't.net/s3/digital-cougar-assets/Cosmo/2016/09/01/88154/emma-hs.jpg?height=600" length="0" type="image/jpeg"/></item><item><title><![CDATA[46 times Kim \'s style had our heads spinning]]></title><description><![CDATA[Kim Kardashian has had some major fas' +
        'hion moments both on and off the red carpet.]]></description><link>http://dev.cosmo-site.bauer-media.net.au/fashion/kim-kardashian-style-16085</link><guid isPermaLink="true">http://dev.cosmo-site.bauer-media.net.au/fashion/kim-kardashian-style-16085</guid><cate' +
        'gory><![CDATA[Fashion]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator>',
        '<enclosure url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/Cosmo/201' +
        '6/05/24/79503/HOLDING.jpg?height=600" length="0" type="image/jpeg"/></item>',
        '<item><title><![CDATA[9 things he sa' +
        'ys during sex vs what he actually means]]></title><description><![CDATA[9 things he says during sex vs what he actually means]]></description><link>http://cosmo-site-au.sit.bxm.net.au/sex/things-he-says-in-sex-15903</link><guid isPermaLink="true">http://cosmo-s' +
        'ite-au.sit.bxm.net.au/sex/things-he-says-in-sex-15903</guid><category><![CDATA[Sex]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator>',
        '<enclosure url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/Cosmo/2016/07/13/84675/789.gif?height=600" length="0" type="image/gif"/></item>'



    }

};