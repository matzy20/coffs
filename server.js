var express = require("express");
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/', function(req, res){
  console.log("Hello Coffs!");
});

app.listen(8079, function(){
  console.log("server is listening");
});