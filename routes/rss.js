'use strict';

var express = require('express'),
    router = express.Router(),
    solrHelper = require('../helpers/solrHelper');

router.route('/aww').get(function(req, res) {
    var docs =[];
    solrHelper.getSearchItems()
    .then(function(data){
        res.json({ documents: docs });
    }, function(err) {

    });
});



module.exports = router;
