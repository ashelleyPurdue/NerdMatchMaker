const http = require('http');
//const url = require('url');
const path = require('path');
const fs = require('fs'); 
const express = require('express');
const app = express();
//TODO make in prop files
const port = 3000;
const url = 'localhost'

//sets default http server
app.use(express.static(__dirname + '/../public'));
console.log(__dirname + '/../public');
// start server on the specified port and binding host
app.listen(port, url, function() {
  // print a message when the server starts listening
  console.log("server starting on " + url + " on port " + port );
});



