import http = require('http');
//import url = require('url');
import path = require('path');
import fs = require('fs'); 
import express = require('express');
import bodyParser =  require("body-parser");
import sqlFile = require("./sql");
import io = require('socket.io');
import multer  = require('multer')
//import HashTable = require('hashtable');
//needs to contain {socket:,userID:} turn into a hash table with id being the key
//var allClients = new HashTable();
var allClients = [];
//TODO make in prop files
const port = 3000;
const url = 'localhost'

const UPDATE_MATCHES_INTERVAL: number = 30000000000000000000;	//Matches will be updated after this number of milliseconds

var con = sqlFile.createCon();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//handles uploading an image


app.post('/BackEnd/file_upload',function(req,res){
	var url;
	console.log("Called upon");
	var storage =   multer.diskStorage({
  		destination: function (req, file, callback) {
    		callback(null, '../public/Images/');
  		},
  		filename: function (req, file, callback) {
	  		url =file.fieldname + '-' + Date.now()
    		callback(null, url);
  		}
	});
	var upload = multer({ storage : storage}).single("userPhoto");
	upload(req,res,function(err) {
        if(err) {
			console.log(err);
            return res.end("Error uploading file.");
        }
		url = "Images/"+url;
		console.log("Images/"+url);
        res.end(url);
    });
});

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

app.post("/BackEnd/setAge/", function(req, res){
	var callback = {success:sqlFile.genSuccess, error:sqlFile.genSQLError};
	sqlFile.setAge(req.body, callback, res);
});

app.post("/BackEnd/blockUser/", function(req, res){
	var callback = {success:sqlFile.genSuccess, error:sqlFile.genSQLError};
	sqlFile.blockUser(req.body, callback, res);
});

app.get("/BackEnd/getMatches/", function(req, res){
	console.log(req.query)
	var callback = {success:sqlFile.sendRows, error:sqlFile.genSQLError};
	sqlFile.getMatches(req.query, callback, res);
});

app.get("/BackEnd/getMessages/", function(req, res){
	console.log("Messages" + req.query);
	var callback = {success:sqlFile.sendRows, error:sqlFile.genSQLError};
	sqlFile.getMessages(req.query, callback, res);
});

app.post("/BackEnd/inARelationship/", function(req, res){
	var callback = {success:sqlFile.genSuccess, error:sqlFile.genSQLError};
	sqlFile.changeRelationStatus(req.body, callback, res);
});

app.get("/BackEnd/getUserLanguage/", function(req, res){
	var callback = {success:sqlFile.sendRows, error:sqlFile.genSQLError};
	sqlFile.getUserLan(req.query, callback, res);
});

app.post("/BackEnd/addUserLanguage/", function(req, res){
	var callback = {success:sqlFile.genSuccess, error:sqlFile.genSQLError};
	sqlFile.addUserLan(req.body, callback, res);
});

app.post("/BackEnd/editPicture/", function(req, res){
	var callback = {success:sqlFile.genSuccess, error:sqlFile.genSQLError};
	sqlFile.editPicture(req.body, callback, res);
});
//sets default http server
app.use(express.static(__dirname + '/../public'));
console.log(__dirname + '/../public');
// start server on the specified port and binding host
var server = app.listen(port, url, function() {
  // print a message when the server starts listening
  console.log("server starting on " + url + " on port " + port );
});
/*
//Set the timer for updating matches
onUpdateMatchesTimer();

function onUpdateMatchesTimer(){
	console.log("updating matches");
	
	let callback = {success: sqlFile.genSuccess, error: sqlFile.genSQLError};
	
	//Update the matches
	sqlFile.updateMatches(null, callback, null);
	
	//Set this to happen again on a timer
	setInterval(onUpdateMatchesTimer, UPDATE_MATCHES_INTERVAL);
}*/

//socket io part
//app.listen(3000);
var socket = io.listen(server);

socket.on('connection', function(client) {
   var userID;
   var sendSuccess = function (rows, json, res, callback) {
	  //var socket2 = allClients.get(json.UserID2); 
	   var socket2 = null;
	   for (var i = 0; i < allClients.length; i++){
  			// look for the entry with a matching `code` value
  			if (allClients[i].UserID == json.UserID2){
				socket2 = allClients[i].client;
				console.log("Found "+allClients[i].UserID);
  			}
		}
      if(socket2 != null){
        socket2.emit('message',{UserID:userID,Message:json.Message});
      }
	  client.emit('success',{success:0});
   }
   var sendError = function(err, json, res, callback, con){
	   client.emit('err',{Error:-2});
	   console.log(err);
   }
   var sendEmpty = function(){
		client.emit('err',{Error:-1,err:"User does not exist or can not chat with user"});   
   }
   client.on('disconnect', function() {
      console.log('Got disconnect!');
      if(userID != null){
        for (var i = 0; i < allClients.length; i++){
  			// look for the entry with a matching `code` value
  			if (allClients[i].UserID == userID){
				allClients.splice( i, 1 )
  			}
		}
      }
   });
   client.on("hello",function(data){
    userID = data.UserID;
	   allClients[allClients.length] = {UserID:data.UserID,client:client}
    //allClients.push({data.UserID:client); 
   });
   client.on("send",function(data){
	console.log("recieved message");
	if(data.UserID != null){
	  //TODO change to make deal with sending error and success with messages
	  let callback = {success:sendSuccess,error:sendError,Empty:sendEmpty};
      sqlFile.insertMessage({UserID1:userID,UserID2:data.UserID,Message:data.Message},callback,null);
    }
   });
});

