var http = require('http');
//const url = require('url');
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require("body-parser");
var sqlFile = require("../BackEnd/temp.js");
//TODO make in prop files
var port = 3000;
var url = 'localhost';
var con = sqlFile.createCon();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/BackEnd/createUser/", function (req, res) {
    console.log(req.body);
    var callback = { success: sqlFile.createAccountCallback, error: sqlFile.createAccountError };
    sqlFile.createAccount(req.body, callback, res);
});
app.post("/BackEnd/login/", function (req, res) {
    console.log(req.body);
    var callback = { success: sqlFile.loginTest, Empty: sqlFile.loginEmptySet, error: sqlFile.genSQLError };
    sqlFile.login(req.body, res, callback);
});
app.post("/BackEnd/changePassword/", function (req, res) {
    var callback = { success: sqlFile.loginForEdPassSuc, Empty: sqlFile.loginEmptySet, error: sqlFile.genSQLError };
    //login then can call editPassword
    sqlFile.login(req.body, res, callback);
});
app.post("/BackEnd/getPrefs/", function (req, res) {
    var callback = { success: sqlFile.getPrefsSuccess, error: genSQLError };
    sqlFile.getPrefs(req.body, callback, res);
});
//sets default http server
app.use(express.static(__dirname + '/../public'));
console.log(__dirname + '/../public');
// start server on the specified port and binding host
app.listen(port, url, function () {
    // print a message when the server starts listening
    console.log("server starting on " + url + " on port " + port);
});
