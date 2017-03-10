import http = require('http');
//import url = require('url');
import path = require('path');
import fs = require('fs'); 
import express = require('express');
import bodyParser =  require("body-parser");
import io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});
socket.on("success",function(data){
		console.log("success");
});
socket.on("err",function(data){
	console.log("Error in sent message"+data.Error);
});
socket.on("message",function(data){
	console.log(data.Message);
	socket.emit("send",{UserID:4,Message:"Sup doc"});
});
socket.emit("hello",{UserID:2});
