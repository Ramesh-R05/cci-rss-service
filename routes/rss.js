'use strict';

var express = require('express'),
    router = express.Router();

router.route('/aww').get(function(req, res) {
  res.json({message: 'FOOD RSS'})
});

module.exports = router;
