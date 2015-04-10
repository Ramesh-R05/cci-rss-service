'use strict';

var express = require('express'),
    router = express.Router(),
    solrHelper = require('../helpers/solrHelper');

router.route('/aww').get(function(req, res) {
    solrHelper.getSearchItems(req)
    .then(function(data){
        res.json({ documents: data });
    }, function(err) {
        console.error('getSearchItems error: ' + err);
    });
});

module.exports = router;
