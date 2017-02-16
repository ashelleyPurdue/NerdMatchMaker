//This server will give the front end a way of checking to make sure that the front end is giving the back-end the right code
var http = require('http');
//const url = require('url');
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require("body-parser");
//TODO make in prop files
var port = 3000;
var url = 'localhost';
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.bodyParser());
app.post("/BackEnd/createUser/", function (req, res) {
    console.log(req.body);
    if (req.body.UserName != null) {
        delete req.body.UserName;
    }
    else {
        console.log("No UserName in json");
        res.send("No UserName in json");
        return;
    }
    if (req.body.Password != null) {
        delete req.body.Password;
    }
    else {
        console.log("No Password in json");
        res.send("No Password in json");
        return;
    }
    if (req.body.Picture != null) {
        delete req.body.Picture;
    }
    else {
        delete req.body.Picture;
        console.log("No Picture in json, not that we need it");
    }
    if (req.body.Birthday != null) {
        //TODO check format
        var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (regex.exec(req.body.Birthday) === null) {
            console.log("Error in birthday format of mm/dd/yyyy");
            res.send("Error in birthday format of mm/dd/yyyy");
        }
        delete req.body.Birthday;
    }
    else {
        console.log("No Birthday in json");
        res.send("No Birthday in json");
    }
    if (req.body.Gender != null) {
        //TODO check to make sure format is correct
        if (!checkGender(req.body.Gender)) {
            console.log("Gender in wrong format");
            res.send("Gender in wrong format");
        }
        delete req.body.Gender;
    }
    else {
        console.log("No Gender in json");
        res.send("No Gender in json");
    }
    if (req.body.GenderInto != null) {
        if (!checkGender(req.body.GenderInto)) {
            console.log("GenderInto in wrong format");
            res.send("GenderInto in wrong format");
        }
        delete req.body.GenderInto;
    }
    else {
        console.log("No GenderInto in json");
        res.send("No GenderInto in json");
    }
    if (req.body.loc != null) {
        delete req.body.loc;
    }
    else {
        delete req.body.loc;
        console.log("No Location in json not that you need one");
    }
    if (req.body.InARelationship != null) {
        if (typeof (req.body.InARelationship) !== 'boolean') {
            console.log("Please give InARelationship of type boolean");
            res.send("Please give InARelationship of type boolean");
        }
        delete req.body.InARelationship;
    }
    else {
        console.log("No InARelationship in json");
        res.send("No InARealtionship in json");
    }
    if (!Object.keys(req.body).length) {
        console.log("Congrats correct json object");
        res.send("Congrats correct json object");
    }
    else {
        console.log("Too many objects in you json object");
        console.log("None of these should be here");
        console.log(req.body);
        res.send("Too many objects in you json object");
    }
});
app.post("/BackEnd/login/", function (req, res) {
    console.log(req.body);
    if (req.body.UserName != null) {
        delete req.body.UserName;
    }
    else {
        console.log("No UserName in json");
        res.send("No UserName in json");
        return;
    }
    if (req.body.Password != null) {
        delete req.body.Password;
    }
    else {
        console.log("No Password in json");
        res.send("No Password in json");
        return;
    }
    if (!Object.keys(req.body).length) {
        console.log("Congrats correct json object");
        res.send("Congrats correct json object");
    }
    else {
        console.log("Too many objects in you json object");
        console.log("None of these should be here");
        console.log(req.body);
        res.send("Too many objects in you json object");
    }
});
app.post("/BackEnd/changePassword/", function (req, res) {
    if (req.body.UserName != null) {
        delete req.body.UserName;
    }
    else {
        console.log("No UserName in json");
        res.send("No UserName in json");
        return;
    }
    if (req.body.oldPassword != null) {
        delete req.body.oldPassword;
    }
    else {
        console.log("No oldPassword in json");
        res.send("No oldPassword in json");
        return;
    }
    if (req.body.newPassword != null) {
        delete req.body.newPassword;
    }
    else {
        console.log("No newPassword in json");
        res.send("No newPassword in json");
        return;
    }
    if (!Object.keys(req.body).length) {
        console.log("Congrats correct json object");
        res.send("Congrats correct json object");
    }
    else {
        console.log("Too many objects in you json object");
        console.log("None of these should be here");
        console.log(req.body);
        res.send("Too many objects in you json object");
    }
});
app.post("/BackEnd/addUserPref", function (req, res) {
    //TODO:
});
var checkGender = function (gender) {
    return (gender === "M" || gender === "F" || gender === "MF");
};
//sets default http server
app.use(express.static(__dirname + '/../public'));
console.log(__dirname + '/../public');
// start server on the specified port and binding host
app.listen(port, url, function () {
    // print a message when the server starts listening
    console.log("server starting on " + url + " on port " + port);
});
