'use strict';

var express = require('express');
var solrHelper = require('../helpers/solrHelper');
var builder = require('../builders/rssBuilder');

var router = express.Router();
router.route('/aww').get(function(req, res) {
    solrHelper.getSearchItems(req)
        .then(function(data){
            var feed = builder.buildShortRssFeed(data);
            var xml = feed.xml();

            res.set('Content-Type', 'text/xml');
            res.send(xml);
        }, function(err) {
            console.error('getSearchItems error: ' + err);
            res.sendStatus(500);
        });
});

module.exports = router;
