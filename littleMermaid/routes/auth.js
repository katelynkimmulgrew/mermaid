var express = require('express');
var router = express.Router();
passport = require('passport'),
mongoose = require('mongoose'),
User = mongoose.model('User');
OfficialList = mongoose.model('OfficialList');
SuggestedList = mongoose.model('SuggestedList');

//var isAdmin = false;

router.get('/in', function(req, res) {
	if (req.user) {
		res.render('in', {admin: req.user.username=="admin", title: 'You are Logged In'});
	}
  else {
  	res.redirect(303, '/permissionDenied');
  }
});

router.get('/login', function(req, res) {
  res.render('login', {title: 'Log In'});
});

router.post('/login', function(req,res,next) {
  // NOTE: use the custom version of authenticate so that we can
  // react to the authentication result... and so that we can
  // propagate an error back to the frontend without using flash
  // messages
  
  passport.authenticate('local', function(err,user) {
  	if(err) {
  		res.send("An error occurred");
  	}
    if(user) {
      // NOTE: using this version of authenticate requires us to
      // call login manually
      req.logIn(user, function(err) {
      	if(err) {
      		res.send("An error occurred");
      	}
      	/*if(user.username=="admin") {
      		isAdmin==true;
      	}*/
        res.redirect('/auth/in');
      });
    } else {
    	console.log("else");
      res.render('login', {message:'Your login or password is incorrect.', title: 'Log In'});
    }
  })(req, res, next);
  // NOTE: notice that this form of authenticate returns a function that
  // we call immediately! See custom callback section of docs:
  // http://passportjs.org/guide/authenticate/
});


router.get('/register', function(req, res) {
  res.render('register', {title: 'Register'});
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      // NOTE: error? send message back to registration...
      res.render('register',{message: err, title:'Register'});//'Your registration information is not valid'});
    } else {
      // NOTE: once you've registered, you should be logged in automatically
      // ...so call authenticate if there's no error
      passport.authenticate('local')(req, res, function() {
        res.redirect('/auth/in');
      });
    }
  });   
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//only meant for users
router.get('/suggestionsList', function(req, res, next) {
	if (req.user) {
		var SuggestionsList = SuggestedList.find({}, function(err, suggestedAdaptations, count) {
		if(err) {
			res.send("An error occurred");
		}
		res.render('suggestionsList', {suggestedAdaptations: suggestedAdaptations, title: 'Suggested Adaptations'});
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
			res.send("Enter All Required Fields");
		}
		else {
			res.redirect(303, '/auth/maintain');
		}
		
	});
});

router.post('/maintain/remove', function(req,res) {
	console.log(req.body)
	
	var checkedItems = req.body.radio;
	OfficialList.findOneAndRemove({director:checkedItems}, function(err, object, count){
		if(err) {
			res.send("An error occurred");
		}
		res.redirect(303,'/auth/maintain');
	});
	
});

router.post('/maintain/check', function(req,res) {
	console.log(req.body)
	if(req.body.remove=="submittedRemove") { 
	var checkedItems = req.body.radio;
SuggestedList.findOneAndRemove({director:checkedItems}, function(err, object, count){
		if(err) {
			res.send("An error occurred");
		}
		res.redirect(303,'/auth/maintain');
	});
	}
	if(req.body.add=="submittedAdd") {

	var checkedItems = req.body.radio;
	//console.log(checkedItems);
	if(typeof checkedItems === "string") {
		var SuggestionsList = SuggestedList.findOne({director:checkedItems}, function(err, suggestedAdaptations, count) {
			if(err) {
				res.send("An error occurred");
			}
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
			res.send("Enter All Required Fields");
		}
		SuggestedList.findOneAndRemove({director:checkedItems}, function(err, object, count){
		if(err) {
			res.send("An error occurred");
		}
		res.redirect(303,'/auth/maintain');
	});
	});

	});
	/*	
	SuggestedList.findOneAndRemove({director:checkedItems}, function(err, object, count){
		if(err) {
			res.send("An error occurred");
		}
		res.redirect(303,'/auth/maintain');
	});//.remove().exec;
		//res.redirect(303,'/auth/maintain');
	*/
} 

	} //end if req.body.add
	if(req.body.removeUserAndSubmission="removeUserAndSubmission") {
		var checkedItems = req.body.radio;
	SuggestedList.findOneAndRemove({director:checkedItems}, function(err, object, count){
		User.findOneAndRemove({_id:object.user}, function(err2, object2, count2) {
			if(err) {
			res.send("An error occurred");
		}
		});
		if(err) {
			res.send("An error occurred");
		}
		res.redirect(303,'/auth/maintain');
	});
	}
	/*else {
		res.send("Please Check only one at a time");
	}*/
});
//only meant for users
router.get('/suggest', function(req, res, next) {
	if (req.user) {
		res.render('suggest', {title: 'Suggest an Adaptation'});
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
			res.send("An error occurred");
		}
		else {
			res.redirect(303, '/auth/suggestionsList');
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
		if(err) {
			res.send("An error occurred");
		}
		
	var SuggestionsList = SuggestedList.find({}, function(err, suggestedAdaptations, count) {
		if(err) {
			res.send("An error occurred");
		}
	
		res.render('maintain', {officialAdaptations: officialAdaptations, suggestedAdaptations: suggestedAdaptations, title: 'Admin Maintainence'} );
		});
	});
	} 
  else {
  	res.redirect(303, '/permissionDenied');
  }
});

module.exports = router;