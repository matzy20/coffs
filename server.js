var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');

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

//use mongoose to create Schema
//confirm with Jon how seed files were created in Get A Life
//using mongoose create DB, passport, and routes

app.get('/', function(req, res){
  console.log("Hello Coffs!");
});

app.listen(8079, function(){
  console.log("server is listening");
});