const http = require('http');
//const url = require('url');
const path = require('path');
const fs = require('fs'); 
const express = require('express');
const bodyParser =  require("body-parser");
const sqlFile = require("../BackEnd/sql.js");
//TODO make in prop files
const port = 3000;
const url = 'localhost'
var con = sqlFile.createCon();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/BackEnd/createUser/",function(req,res){
  //sqlFile.createAccount(req.body,con,res);
  console.log(req.body);
  res.send();
});
app.post("/BackEnd/login",function(req,res){
  sqlFile.login(req.body,con,res,false);
  res.send();
});
app.post("/BackEnd/changePassword/",function(req,res){
  sqlFile.editPassword(req.body,con,res);
  res.send();
});


//sets default http server
app.use(express.static(__dirname + '/../public'));
console.log(__dirname + '/../public');
// start server on the specified port and binding host
app.listen(port, url, function() {
  // print a message when the server starts listening
  console.log("server starting on " + url + " on port " + port );
});

