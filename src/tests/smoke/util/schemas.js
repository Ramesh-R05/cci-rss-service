module.exports = {

    rssHeaderSchema: function() {
        return '<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:mi="http://schemas.ingestion.microsoft.com/common/">'

    },

    rssItemSchema1: function() {
       return '<item><title><![CDATA[Smoke Test Article 85 Long Title]]></title><description><![CDATA[Smoke Test Article 85 Short Teaser]]>' +
       '</description><link>http://cosmo-site-au.sit.bxm.net.au/sex/smoke-test-article-85-1-17652</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/sex/smoke-test-article-85-1-17652</guid>' +
       '<category><![CDATA[Sex]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator>',
       '<enclosure url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/whichcar/2016/04/28/-1/adjust-seat-height-driving-position.jpg?height=600" length="0" type="image/jpeg"/><content:encoded>' +
       '<![CDATA[<p>Smoke Test Article 85 Body Paragraph</p>\n<h2>Smoke Test Article 85 Body Heading</h2>]]></content:encoded>',
       '<mi:hasSyndicationRights>1</mi:hasSyndicationRights><mi:licensorName>BAUER MEDIA PTY LIMITED</mi:licensorName><media:content url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/whichcar/2016/04/28/-1/adjust-seat-height-driving-position.jpg?height=600" type="image/jpeg">' +
       '<media:thumbnail url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/whichcar/2016/04/28/-1/adjust-seat-height-driving-position.jpg?height=600" type="image/jpeg"></media:thumbnail>' +
       '<media:title>Smoke Test Article 85 Long Title</media:title><media:text>Smoke Test Article 85 Short Teaser</media:text><media:credit>Provided by Bauer Media Pty Ltd</media:credit></media:content></item><item><title><![CDATA[Smoke Test Article 83 Long Title]]></title><description>' +
       '<![CDATA[Smoke Test Article 83 Short Teaser]]></description><link>http://cosmo-site-au.sit.bxm.net.au/sex/smoke-test-article-83-17647</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/sex/smoke-test-article-83-17647</guid><category><![CDATA[Sex]]></category><dc:creator><![CDATA[Cosmopolitain]]>' +
       '</dc:creator>',
       '<enclosure url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/whichcar/2016/04/28/-1/adjust-seat-height-driving-position.jpg?height=600" length="0" type="image/jpeg"/><content:encoded>' +
       '<![CDATA[<p>Smoke Test Article 83 Body Paragraph</p>\n<h2>Smoke Test Article 83 Body Heading</h2>]]></content:encoded>',
       '<mi:hasSyndicationRights>1</mi:hasSyndicationRights><mi:licensorName>BAUER MEDIA PTY LIMITED</mi:licensorName>' +
       '<media:content url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/whichcar/2016/04/28/-1/adjust-seat-height-driving-position.jpg?height=600" type="image/jpeg">' +
       '<media:thumbnail url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/whichcar/2016/04/28/-1/adjust-seat-height-driving-position.jpg?height=600" type="image/jpeg"></media:thumbnail><media:title>Smoke Test Article 83 Long Title</media:title><media:text>Smoke Test Article 83 Short Teaser</media:text>' +
       '<media:credit>Provided by Bauer Media Pty Ltd</media:credit></media:content></item><item><title><![CDATA[Lili Reinhart shares a HILAR throwback pic to when she found out she landed Betty Cooper\'s role]]></title><description><![CDATA[Lili Reinhart shares a funny throwback tweet to when she found out she was going to play Betty Cooper on \'Riverdale\'.]]>' +
       '</description><link>http://cosmo-site-au.sit.bxm.net.au/celebrity/lili-reinhart-betty-cooper-throwback-17634</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/celebrity/lili-reinhart-betty-cooper-throwback-17634</guid><category><![CDATA[Celebrity]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator>'

    },


    rssItemSchema2: function() {
        return '<img src="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/cosmo/2017/08/07/1502080186695_lili-reinhart-dylan-sprouse-instagram1.png?width=800" alt="" data-portal-copyright="Provided by Bauer Media Pty Ltd" data-has-syndication-rights="1" />',
        '<mi:hasSyndicationRights>1</mi:hasSyndicationRights><mi:licensorName>BAUER MEDIA PTY LIMITED</mi:licensorName><media:content url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/cosmo/2017/08/07/23550/jughead-(1).jpg?height=600" type="image/jpeg"><media:thumbnail url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/cosmo/2017/08/07/23550/jughead-(1).jpg?height=600" type="image/jpeg">' +
        '</media:thumbnail><media:title>Lili Reinhart&apos;s birthday message to Cole Sprouse is giving us all the feels</media:title><media:text>Bughead ~forever~.</media:text><media:credit>Provided by Bauer Media Pty Ltd</media:credit></media:content></item><item><title><![CDATA[Jordyn Woods spills on being Kylie Jenner\'s bestie]]></title>'
        '<img src="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/cosmo/2017/08/03/1501736713466_womenmovies.jpg?width=800" alt="" data-portal-copyright="Provided by Bauer Media Pty Ltd" data-has-syndication-rights="1" /></div><p>Behind the camera, it&#39;s not much better either (oh, you thought it was time for the good news?). 20.7% of producers are women, 13.2% are writers, 4.2% are directors, and just ' +
        '1.7% are composers. Across 1,006 directors of the 900 films analysed, 53 were Black men, three were Black women, and two were Asian women.</p>\n<p>Representation in film is important because, if we&#39;re meant to see film as a reflection of narratives that matter to our population, right now it&#39;s still perpetuating the notion that only white, cisgender, straight, male, and able-bodied narratives matter. Filmmakers have used all' +
        ' sorts of excuses to justify these numbers, arguing that making characters women or LGBT wouldn&#39;t be honest to the stories they are trying to tell. But that&#39;s because they chose to tell those stories in the first place. They could choose different ones.</p>\n<p>So what&#39;s to be done? USC researchers say there are about 40 speaking characters in every movie, so if &quot;writers were to simply add five female speaking' +
        ' characters to every film, it would increase yearly the percentage of female characters on screen.&quot; It&#39;s a small ask, given that these could be inconsequential background characters, but it would lead to equal representation of women on screen by 2020.</p>\n<p><strong>Raphael Bob-Waksberg</strong>, the creator of <em>BoJack Horseman</em>, spoke about how obvious a choice this was to make — once it was pointed out to him by head' +
        ' designer <strong>Lisa Hanawalt</strong>. He said there is a &quot;tendency for comedy writers, and audiences, and writers... to view comedy characters as inherently male, unless there is something <em>specifically</em> female about them,&quot; and that until Hanawalt started designing characters he had assumed were men as women, he didn&#39;t realise he was making this assumption.</p>\n<p>&quot;The underlying assumption there is that the default' +
        ' mode for any character is male, so to make the characters female is an additional detail <em>on top of that</em>,&quot; he wrote. &quot;In case I&#39;m not being a hundred percent clear, this thinking is stupid and wrong and self-perpetuating unless you actively work against it.&quot;</p>\n<p>Still, background character equality is a low bar to clear. USC also recommends high-profile talent add equity clauses in their contracts, which' +
        ' would specify &quot;a more equitable process for auditioning and casting on‐screen talent and interviewing and hiring for behind‐the‐camera jobs,&quot; and that shareholders make these demands of companies. And as consumers, we can support films that center underrepresented narratives. Which means I can continue giving all my money to the <a href="http://www.cosmopolitan.com.au/celebrity/vin-diesel-new-fast-furious-poster-7408|target=&quot;_blank&quot;">' +
        '<em>Fast and Furious</em></a> franchise.</p>\n<p><em>Via: <a href="http://www.elle.com/culture/movies-tv/news/a47090/women-underrepresented-in-film-study-usc/|target=&quot;_blank&quot;">ELLE US</a></em></p>\n]]></content:encoded><mi:dateTimeWritten>2017-08-03T04:52:49Z</mi:dateTimeWritten><mi:hasSyndicationRights>1</mi:hasSyndicationRights><mi:licensorName>BAUER MEDIA PTY LIMITED</mi:licensorName><media:content url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital' +
        '-cougar-assets/cosmo/2017/08/03/23498/bridesmaids-holding.jpg?height=600" type="image/jpeg"><media:thumbnail url="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/cosmo/2017/08/03/23498/bridesmaids-holding.jpg?height=600" type="image/jpeg"></media:thumbnail><media:title>bridesmaids movie</media:title><media:text>&lt;a href=&quot;http://www.nytimes.com/2011/05/13/movies/bridesmaids-with-kristen-wiig-maya-rudolph-review.html&quot;&gt;&lt;/a&gt;</media:text>' +
        '<media:credit>SUZANNE HANOVER/UNIVERSAL PICTURES</media:credit></media:content></item>'
    },



    rssTopSchema: function() {
        return '><title><![CDATA[Cosmo homepage test title]]></title><description><![CDATA[Cosmo homepage test meta description]]>' +
        '</description><link>http://dev.cosmo-site.bauer-media.net.au</link><generator>RSS for Node</generator>',
        '<atom:link href="http://dev.rss.services.bauer-media.net.au/rss/cosmo/full-content" rel="self" type="application/rss+xml"/><copyright><![CDATA[2017 BAUER MEDIA PTY LIMITED]]></copyright><ttl>60</ttl>' +
        '<item><title><![CDATA[Smoke Test Article 85 Long Title]]></title><description><![CDATA[Smoke Test Article 85 Short Teaser]]></description>' +
        '<link>http://cosmo-site-au.sit.bxm.net.au/sex/smoke-test-article-85-17649</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/sex/smoke-test-article-85-17649</guid>' +
        '<category><![CDATA[Sex]]></category><dc:creator><![CDATA[Cosmopolitain]]></dc:creator>'
    },


    rssParItemSchema: function() {
        return '><item><title><![CDATA[Kev test short title]]></title><description><![CDATA[Kev test short teaser]]></descrip' +
        'tion><link>http://cosmo-site-au.sit.bxm.net.au/fashion/kev-test-17593</link><guid isPermaLink="true">http://cosmo-site-au.sit.bxm.net.au/fashion/kev-test-17593</guid><category><![CDATA[Fashion]]></category><dc:creator><![CDATA[Emily Kerr]]></dc:creator>',
        '<enclosure url="http://dev.assets.cougar.bauer-media.net.au/s3/digital-cougar-assets-dev/Dolly/2017/06/21/17593/Mid-century-style.jpg?height=600" length="0" type="image/jpeg"/></item>',
        '<img src="http://d3lp4xedbqa8a5.cloudfront.net/s3/digital-cougar-assets/cosmo/2017/08/07/1502069687604_kylietrav.jpg?width=800" alt="" data-portal-copyright="Provided by Bauer Media Pty Ltd" data-has-syndication-rights="1" /></div><p>&quot;I become an extended leg of their relationship,” she told <strong>Erin Lim.</strong>',
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
        '6/05/24/79503/HOLDING.jpg?height=600" length="0" type="image/jpeg"/>'

    }

};