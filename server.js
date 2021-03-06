var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
// var isAuthenticated = require('../middleware/isAuthenticated');

var app = express();

mongoose.connect('mongodb://localhost/Get_A_Life');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  created: Date,
});

var User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '..','public')));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'placeholder'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy (
  {
    passReqToCallback: true
  },
  function (req, username, password, done) {
    console.log('searching...');
    return User.findOne({
      username: username
    })
      .then(function (user) {
        console.log("user test", user);
        if (user.password !== password) {
          return done(null, false);
        }
        return done(null, user);
      })
        .catch(function (err) {
          return done(null, false);
        });
  })
);

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId)
    .then(function(userId) {
      if (!userId) {
        return done(null, false);
      }
      return done(null, userId);
    });
});

//TODO: re-add back 'isAuthenticated'
//ERROR: couldn't find module, check if b/c no '/login' route created yet
app.get('/api/users', function(req, res) {
  User.find({}, function(err, users) {
    if(err) {
      res.send("can't find user");
    }
    res.json(users);
  });
});

app.post('/register', function(req, res) {
  var newUser = new User ({
    username: req.body.username,
    password: req.body.password
  });
  console.log(newUser);
  newUser.save(function(err, event){
    var userId = newUser._id;
    res.json(event);
  });
});

app.post('/main', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
  if (err) {
    return next(err);
  }
  if (!user) {
    return res.status(401).json({
      err: info
    });
  }
  req.logIn(user, function(err) {
    if (err) {
      return res.status(500).json({
        err: 'Could not log in user'
      });
    }
    //Jon had a res.send({key: CONFIG.session.AUTH});
    //Which we don't need due to no Social Media, yet ..
    res.send('you\'ve successully logged in');
  });
  })(req, res, next);
});

app.listen(8079, function(){
  console.log("server is listening");
});