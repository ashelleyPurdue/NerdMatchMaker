//Imports/requires
var request = require('request');
const fs = require('fs');
const bodyParser =  require("body-parser");

//Function types
type RequestFunction = (error, response, body) => void;

//Interfaces (blueprints for objects; like classes but without methods)
interface OptionSet{
	url: string;
	method: string;
	headers: any;
	form: any;
}

interface TestCase{
	options: OptionSet;
	requestFunction: RequestFunction;
}


//Framework variables
let headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

let testCases: TestCase[] = [];
let currentTest:number = 0;

//Framework functions
function nextTest(){
	//Do the next test.
	
	//If this there are no more tests, end.
	if (currentTest >= testCases.length){
		return;
	}
	
	//Get the next test case
	let testData = testCases[currentTest++];
	
	//Execute it
	request(testData.options, testData.requestFunction);
}

function success(testName: string){
	//Call this function inside your requestFunction when the test passes.
	
	console.log("Test " + testName + " passed");
	nextTest();
}

function failure(testName: string, message: string){
	//Call this function inside your requestFunction when the test fails.
	
	console.log("Test " + testName + " failed: " + message);
	nextTest();
}

//Test cases
let createCase0: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/createUser/',
		method: 'POST',
		headers: headers,
		form: {'UserName': 'xxx', 'Password': 'yyy',Picture:null,Birthday:"02/07/1995",Gender: "M",GenderInto:"M",loc:null}
	},
	
	requestFunction: function(error, response, body){
		if (!error){
      body = JSON.parse( body );
			console.log(body);
			
			if ((body.UserID != null && body.UserID > 0)){
				success("test0");
			}
			else{
				failure("test0", "")
			}
		}
		else{
			failure("test0", "error number " + error);
		}
	}
};
//test create account twice in a row
testCases.push(createCase0);

let createCase1: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/createUser/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'xxx', 'Password': 'yyy',Picture:null,Birthday:"02/07/1995",Gender: "M",GenderInto:"M",loc:null}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.Error != null && body.Error === -1)){
        success("test0");
      }
      else{
        failure("test1", "Allowed creating two users")
      }
    }
    else{
      failure("test1", "error number " + error);
    }
  }
};
testCases.push(createCase1);
//Test login with given userName and password
let createLogin1: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/login/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'xxx', 'Password': 'yyy'}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.UserID != null && body.UserID > 0)){
        success("test0");
      }
      else{
        failure("test1", "Failed with logining in with create User")
      }
    }
    else{
      failure("test1", "error number " + error);
    }
  }
};
testCases.push(createLogin1);

//Test login with alreay in database userName and password
let createLogin2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/login/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'temp0', 'Password': 'abcd1234'}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.UserID != null && body.UserID > 0)){
        success("test0");
      }
      else{
        failure("test1", "Failed with logining in with database User")
      }
    }
    else{
      failure("test1", "error number " + error);
    }
  }
};
testCases.push(createLogin2);
//TODO change test chance success to what is printed out if login failed also change all my test cases below to work
//Test login with bad password
let createLogin3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/login/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'temp0', 'Password': '1234abcd'}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.Error != null && body.Error === -1)){
        success("test0");
      }
      else{
        failure("test1", "Failed with logining in with database User")
      }
    }
    else{
      failure("test1", "error number " + error);
    }
  }
};
testCases.push(createLogin3);

//Test login with bad username
let createLogin4: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/login/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'null0', 'Password': 'abcd1234'}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.Error != null && body.Error > 0)){
        success("test0");
      }
      else{
        failure("test1", "Error did not occur with logining in with bad user name ")
      }
    }
    else{
      failure("test1", "error number " + error);
    }
  }
};
testCases.push(createLogin4);

//Test editPassword for user in database
let editPassWord1: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/editPassword/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'temp0', 'oldPassword': 'abcd1234',newPassword: '1234abcd'}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.UserID != null && body.UserID > 0)){
        success("test0");
      }
      else{
        failure("test1", "Login")
      }
    }
    else{
      failure("test1", "error number " + error);
    }
  }
};
testCases.push(editPassWord1);
//TODO test login after this to make sure changes work
let addUserPrefsTest0: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/createUser/',
		method: 'POST',
		headers: headers,
		form: {UserID: 1, Name: "test pref name"}
	},
	
	requestFunction: function(error, response, body){
		
		//Fail if error
		if (error){
			failure("addUserPrefsTest0", "error number " + error);
			return;
		}
		
		//Success if we received 0 from server, error if otherwise.
		if (body == 0){
			success("addUserPrefsTest0");
		}
		else{
			failure("addUserPrefsTest0", "body = " + body);
		}
	}
}
testCases.push(addUserPrefsTest0);
//File entry point
nextTest();
