import http = require('http');
//import url = require('url');
import path = require('path');
import fs = require('fs'); 
import express = require('express');
import bodyParser =  require("body-parser");
import sqlFile = require("../BackEnd/temp.js");

//TODO make in prop files
const port = 3000;
const url = 'localhost'
var con = sqlFile.createCon();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/BackEnd/createUser/",function(req,res){
  console.log(req.body);
  var callback = {success:sqlFile.createAccountCallback,error:sqlFile.createAccountError};
  sqlFile.createAccount(req.body,callback,res);
});
app.post("/BackEnd/login/",function(req,res){
  console.log(req.body);
  var callback = {success: sqlFile.loginTest,Empty:sqlFile.loginEmptySet ,error:sqlFile.genSQLError};
  sqlFile.login(req.body,res,callback);
});

app.post("/BackEnd/editPassword/",function(req,res){
  console.log(req.body);
  var callback = {success: sqlFile.loginForEdPassSuc,Empty:sqlFile.loginEmptySet ,error:sqlFile.genSQLError};
  //login then can call editPassword
  sqlFile.loginWithID(req.body,res,callback);
});
app.post("/BackEnd/getPrefs/",function(req,res){
  var callback = {success:sqlFile.getPrefsSuccess,error:sqlFile.genSQLError};
  sqlFile.getPrefs(req.body,callback,res);
});

app.post("/BackEnd/addUserPref/", function(req, res){
	console.log("addUserPref");
	var callback = {success:sqlFile.genSuccess, error:sqlFile.genSQLError};
	sqlFile.addUserPref(req.body, callback, res);
});

app.post("/BackEnd/getUserPref/", function(req, res){
	var callback = {success:sqlFile.genSuccess, error:sqlFile.genSQLError};
	sqlFile.getUserPref(req.body, callback, res);
});
//sets default http server
app.use(express.static(__dirname + '/../public'));
console.log(__dirname + '/../public');
// start server on the specified port and binding host
app.listen(port, url, function() {
  // print a message when the server starts listening
  console.log("server starting on " + url + " on port " + port );
});

