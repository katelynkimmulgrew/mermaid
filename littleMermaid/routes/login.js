var express = require('express');
var router = express.Router();
passport = require('passport'),
mongoose = require('mongoose'),
User = mongoose.model('User');
OfficialList = mongoose.model('OfficialList');
SuggestedList = mongoose.model('SuggestedList');

var isAdmin = false;

router.get('/in', function(req, res) {
	if (req.user) {
		res.render('in', {admin: req.user.username=="admin"});
	}
  else {
  	res.redirect(303, '/permissionDenied');
  }
});

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', function(req,res,next) {
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
    	console.log("else");
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
      res.render('register',{message: err});//'Your registration information is not valid'});
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

router.post('/maintain/add', function(req,res) {
	var newAdaptation = new OfficialList({
		name: req.body.name,
  		screenWriter: req.body.screenWriter,
  		director: req.body.director,
  		company: req.body.company,
  		country: req.body.country,
  		year: req.body.year,
  		link: req.body.link
	});
	newAdaptation.save(function(err,lists,count) {
		if(err) {
			res.send(err);
		}
		else {
			res.redirect(303, '/login/maintain');
		}
		
	});
});

router.post('/maintain/check', function(req,res) {
	
	var checkedItems = req.body.radio;
	//console.log(checkedItems);
	if(typeof checkedItems === "string") {
		var SuggestionsList = SuggestedList.findOne({director:checkedItems}, function(err, suggestedAdaptations, count) {
			var newAdaptation = new OfficialList({
		name: suggestedAdaptations.name,
  		screenWriter: suggestedAdaptations.screenWriter,
  		director: suggestedAdaptations.director,
  		company: suggestedAdaptations.company,
  		country: suggestedAdaptations.country,
  		year: suggestedAdaptations.year,
  		link: suggestedAdaptations.link
	});
	newAdaptation.save(function(err,lists,count) {
		if(err) {
			res.send(err);
		}
		
	});

	});
	SuggestedList.findOneAndRemove({director:checkedItems}, function(err, object, count){
		console.log(err);

	});//.remove().exec;
		res.redirect(303,'/login/maintain');
	
	}
	else {
		res.send("Please Check only one at a time");
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
		//console.log(req.body);
		/*
 	req.session.name = req.body.name;
  	req.session.screenWriter =  req.body.screenWriter;
  	req.session.director = req.body.director;
  	req.session.country =  req.body.country;
  	req.session.year =  req.body.year;
  	req.session.link = req.body.link;
  	*/
	var newAdaptation = new SuggestedList({
		user: req.user,
  		dateSubmitted: Date.now(),
		name: req.body.name,
  		screenWriter: req.body.screenWriter,
  		director: req.body.director,
  		company: req.body.company,
  		country: req.body.country,
  		year: req.body.year,
  		link: req.body.link
	});
	newAdaptation.save(function(err,lists,count) {
		if(err) {
			res.send(err);
		}
		else {
			res.redirect(303, '/login/suggestionsList');
		}
		
	});
}
else {
	res.redirect(303, '/permissionDenied');
}
});

//only meant for admin
router.get('/maintain', function(req, res, next) {
	
	if (req.user&&(req.user.username=="admin")) {//isAdmin==true) {
	var OfficialList2 = OfficialList.find({}, function(err, officialAdaptations, count) {
		
	var SuggestionsList = SuggestedList.find({}, function(err, suggestedAdaptations, count) {
		
	
		res.render('maintain', {officialAdaptations: officialAdaptations, suggestedAdaptations: suggestedAdaptations} );
		});
	});
	} 
  else {
  	res.redirect(303, '/permissionDenied');
  }
});

module.exports = router;