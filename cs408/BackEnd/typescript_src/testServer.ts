//This server will give the front end a way of checking to make sure that the front end is giving the back-end the right code
const http = require('http');
//const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
//TODO make in prop files
const port = 3000;
const url = 'localhost'
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.bodyParser());

app.post("/BackEnd/createUser/", function(req, res) {
    console.log(req.body);
    if (req.body.UserName != null) {
        delete req.body.UserName;
    } else {
        console.log("No UserName in json");
        res.send("No UserName in json");
        return;
    }
    if (req.body.Password != null) {
        delete req.body.Password;
    } else {
        console.log("No Password in json");
        res.send("No Password in json");
        return;
    }
    if (req.body.Picture != null) {
        delete req.body.Picture;
    } else {
        delete req.body.Picture;
        console.log("No Picture in json, not that we need it");
    }
    if (req.body.Birthday != null) {
        //TODO check format
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (regex.exec(req.body.Birthday) === null) {
            console.log("Error in birthday format of mm/dd/yyyy");
            res.send("Error in birthday format of mm/dd/yyyy");
        }
        delete req.body.Birthday;
    } else {
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
    } else {
        console.log("No Gender in json");
        res.send("No Gender in json");
    }
    if (req.body.GenderInto != null) {
        if (!checkGender(req.body.GenderInto)) {
            console.log("GenderInto in wrong format");
            res.send("GenderInto in wrong format");
        }
        delete req.body.GenderInto;
    } else {
        console.log("No GenderInto in json");
        res.send("No GenderInto in json");
    }
    if (req.body.loc != null) {
        delete req.body.loc;
    } else {
        delete req.body.loc;
        console.log("No Location in json not that you need one");
    }
    if (!Object.keys(req.body).length) {
        console.log("Congrats correct json object");
        res.send("Congrats correct json object");
    } else {
        console.log("Too many objects in you json object");
        console.log("None of these should be here");
        console.log(req.body);
        res.send("Too many objects in you json object");
    }
});

app.post("/BackEnd/login/", function(req, res) {
    console.log(req.body);
    if (req.body.UserName != null) {
        delete req.body.UserName;
    } else {
        console.log("No UserName in json");
        res.send("No UserName in json");
        return;
    }
    if (req.body.Password != null) {
        delete req.body.Password;
    } else {
        console.log("No Password in json");
        res.send("No Password in json");
        return;
    }
    if (!Object.keys(req.body).length) {
        console.log("Congrats correct json object");
        res.send("Congrats correct json object");
    } else {
        console.log("Too many objects in you json object");
        console.log("None of these should be here");
        console.log(req.body);
        res.send("Too many objects in you json object");
    }
});
app.post("/BackEnd/editPassword/", function(req, res) {
    console.log(req.body);
    if (req.body.UserID != null) {
        delete req.body.UserID;
    } else {
        console.log("No UserID in json");
        res.send("No UserID in json");
        return;
    }
    if (req.body.oldPassword != null) {
        delete req.body.oldPassword;
    } else {
        console.log("No oldPassword in json");
        res.send("No oldPassword in json");
        return;
    }
    if (req.body.newPassword != null) {
        delete req.body.newPassword;
    } else {
        console.log("No newPassword in json");
        res.send("No newPassword in json");
        return;
    }

    if (!Object.keys(req.body).length) {
        console.log("Congrats correct json object");
        res.send("Congrats correct json object");
    } else {
        console.log("Too many objects in you json object");
        console.log("None of these should be here");
        console.log(req.body);
        res.send("Too many objects in you json object");
    }
});

app.post("/BackEnd/addUserPref/", function(req, res){
	
	//Check for UserID
	if (req.body.UserID != null){
		delete req.body.UserID;
	}
	else{
		console.log("No UserID in json");
		res.send("No UserID in json");
		return;
	}
	
	//Check for Name (prefName)
	if (req.body.Name != null){
		delete req.body.Name;
	}
	else{
		console.log("No Name in json");
		res.send("No Name in json");
		return;
	}
	
	//Check to see that those were the ONLY things in the JSON
	if (Object.keys(req.body).length == 0){
		console.log("Congrats, correct json object!");
		res.send("Congrats, correct json object!");
	}
	else{
		console.log("Too many things in your json object");
		console.log("None of these should be here: ");
		console.log(req.body);
		res.send("Too many objects in your json object");
	}
});

app.post("/BackEnd/getUserPref/", function(req, res){
	//Make sure it has user id
	if (req.body.UserID != null){
		delete req.body.UserID;
	}
	else{
		console.log("No UserID in json");
		res.send("No UserID in json");
		return;
	}
	
	//Check to see that UserID was the ONLY thing in JSON
	if (Object.keys(req.body).length == 0){
		console.log("Congrats, correct json object!");
		res.send("Congrats, correct json object!");
	}
	else{
		console.log("Too many things in json object.");
		console.log("None of these should be here: ");
		console.log(req.body);
		res.send("Too many things in your json object");
	}
});

app.post("/BackEnd/setAge/", function(req, res){
	if (req.body.UserID != null){
		delete req.body.UserID;
	}
	else{
		console.log("No UserID in json");
		res.send("No UserID in json");
		return;
	}
	if (req.body.minAge != null){
		delete req.body.minAge;
	}
	else{
		console.log("No minAge in json not that it is required");
	}
	if (req.body.maxAge != null){
		delete req.body.maxAge;
	}
	else{
		console.log("No maxAge in json not that it is required");
	}
	console.log("Congrats, correct json object!");
	res.send("Congrats, correct json object!");
});

app.post("/BackEnd/blockUser/", function(req, res){
	if (req.body.UserID1 != null){
		delete req.body.UserID1;
	}
	else{
		console.log("No UserID1 in json");
		res.send("No UserID1 in json");
		return;
	}
	if (req.body.UserID2 != null){
		delete req.body.UserID2;
	}
	else{
		console.log("No UserID2 in json");
		res.send("No UserID2 in json");
		return;
	}
	console.log("Congrats, correct json object!");
	res.send("Congrats, correct json object!");
});

app.get("/BackEnd/getMatches/", function(req, res){
	if (req.body.UserID1 != null){
		delete req.body.UserID1;
	}
	else{
		console.log("No UserID1 in json");
		res.send("No UserID1 in json");
		return;
	}
	console.log("Congrats, correct json object!");
	res.send("Congrats, correct json object!");
});

app.get("/BackEnd/getMessages/", function(req, res){
	if (req.body.UserID1 != null){
		delete req.body.UserID1;
	}
	else{
		console.log("No UserID1 in json");
		res.send("No UserID1 in json");
		return;
	}
	if (req.body.UserID2 != null){
		delete req.body.UserID2;
	}
	else{
		console.log("No UserID2 in json");
		res.send("No UserID2 in json");
		return;
	}
	console.log("Congrats, correct json object!");
	res.send("Congrats, correct json object!");
});
var checkGender = function(gender) {
    return (gender === "M" || gender === "F" || gender === "MF");
};
//sets default http server
app.use(express.static(__dirname + '/../public'));
console.log(__dirname + '/../public');
// start server on the specified port and binding host
app.listen(port, url, function() {
    // print a message when the server starts listening
    console.log("server starting on " + url + " on port " + port);
});
