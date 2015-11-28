var express = require('express');
var router = express.Router();
var isAdmin = false;

router.get('/in', function(req, res) {
  res.render('in');
});

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/login', function(req,res,next) {
  // NOTE: use the custom version of authenticate so that we can
  // react to the authentication result... and so that we can
  // propagate an error back to the frontend without using flash
  // messages
  passport.authenticate('local', function(err,user) {
    if(user) {
      // NOTE: using this version of authenticate requires us to
      // call login manually
      req.logIn(user, function(err) {
      	if(user.username=="admin" && user.password=="securePassword") {
      		isAdmin==true;
      	}
        res.redirect('/login/in');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
  // NOTE: notice that this form of authenticate returns a function that
  // we call immediately! See custom callback section of docs:
  // http://passportjs.org/guide/authenticate/
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      // NOTE: error? send message back to registration...
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      // NOTE: once you've registered, you should be logged in automatically
      // ...so call authenticate if there's no error
      passport.authenticate('local')(req, res, function() {
        res.redirect('/login/in');
      });
    }
  });   
});

//only meant for users
router.get('/suggestionsList', function(req, res, next) {
	if (req.user) {
		var SuggestionsList = SuggestedList.find({}, function(err, suggestedAdaptations, count) {
		res.render('suggestionsList', {suggestedAdaptations: suggestedAdaptations});
	});
	}
	else {
  	res.redirect(303, '/permissionDenied');
  }
});

//only meant for users
router.get('/suggest', function(req, res, next) {
	if (req.user) {
		res.render('suggest');
	}
  else {
  	res.redirect(303, '/permissionDenied');
  }
});

router.post('/suggest', function(req, res, next) {
	if (req.user) {
 	req.session.name: req.body.name;
  	req.session.screenWriter: req.body.screenWriter;
  	req.session.director: req.body.director;
  	req.session.country: req.body.country;
  	req.session.year: req.body.year;
  	req.session.link: req.body.link;
	var newAdaptation = new OfficialList({
		user: req.user;
  		dateSubmitted: Date.now();
		req.session.name;
  		req.session.screenWriter;
  		req.session.director;
  		req.session.country;
  		req.session.year;
  		req.session.link;
	});
	newAdaptation.save(function(err,lists,count) {
		
		res.redirect(303, '/login/suggestionsList');
	});
}
else {
	res.redirect(303, '/permissionDenied');
}
});

//only meant for admin
router.get('/maintain', function(req, res, next) {
	if (req.user&&isAdmin==true) {
		res.render('maintain');
	} 
  else {
  	res.redirect(303, '/permissionDenied');
  }
});

module.exports = router;