'use strict';

var express = require('express'),
    router = express.Router();

router.get('/aww', function(req, res) {
  res.json({message: 'FOOD RSS'})
});

module.exports = router;
