import http = require('http');
//import url = require('url');
import path = require('path');
import fs = require('fs'); 
import express = require('express');
import bodyParser =  require("body-parser");
import sqlFile = require("./temp");
import io = require('socket.io-client');
import HashTable = require('hashtable');
var socket = io.connect('http://localhost:3000', {reconnect: true});
socket.on("success",function(data){
		console.log("success");
});
socket.on('err',function(data){
	console.log("Error in sent message"+data.Error);
});
socket.on("message",function(data){
	console.log(data.Message);
	socket.emit("send",{UserID:5,Message:"Should not send"});
	socket.emit("send",{UserID:7,Message:"Not active"});
});
socket.emit("hello",{UserID:1});
socket.emit("send",{UserID:2,Message:"How is life"})