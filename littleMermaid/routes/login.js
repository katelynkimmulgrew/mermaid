var express = require('express');
var router = express.Router();

//only meant for users
router.get('/suggest', function(req, res, next) {
  res.render('suggest');
});

//only meant for admin
router.get('/maintain', function(req, res, next) {
  res.render('maintain');
});

module.exports = router;