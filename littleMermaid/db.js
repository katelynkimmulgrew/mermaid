var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
// users
// * our site requires authentication...
// * so users have a username and password
// * ideally they could also upload images to also be considered
var User = new mongoose.Schema({
  // username, password provided by plugin
});
User.plugin(passportLocalMongoose);
// the official list of adaptations
// * includes the information about each adaptation
// * ideally I could have the link section be a list of links (how would this be done?)
var OfficialList = new mongoose.Schema({
  name: {type: String, required: true},
  screenWriter: {type: String, required: true},
  director: {type: String, required: true},
  country: {type: String, required: true},
  year: {type: Number, required: true},
  link: {type: String, required: true},
	
});

// a suggestions list
// * each suggested adaptation must have a related user
// * every suggestion has a date submitted so I the administrator can view them in order submitted
// * ideally I could have the link section be a list of links (how would this be done?)
var SuggestedList = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  dateSubmitted: {type: Date, required: true},
  name: {type: String, required: true},
  screenWriter: {type: String, required: true},
  director: {type: String, required: true},
  country: {type: String, required: true},
  year: {type: Number, required: true},
  link: {type: String, required: true},
	
});

mongoose.model('User', User);
mongoose.model('OfficialList', OfficialList);
mongoose.model('SuggestedList', SuggestedList);

mongoose.connect('mongodb://localhost/littleMermaiddb');