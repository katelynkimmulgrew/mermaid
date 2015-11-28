var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'A Semi-Comprehensive List of Little Mermaid Adaptations' });
});
router.get('/about', function(req, res) {
	res.render('about');
});

router.get('/littleMermaid/adaptations', function(req, res) {
	var OfficialList = OfficialList.find({}, function(err, adaptations, count) {
		res.render('adaptations', {adaptations: adaptations});
	}
	
});

router.get('/about', function(req, res) {
	res.render('about');
});

router.get('/permissionDenied', function(req, res) {
	res.render('permissionDenied');
});


module.exports = router;
