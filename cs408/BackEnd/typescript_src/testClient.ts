//Imports/requires
import request = require('request');
const fs = require('fs');
const bodyParser =  require("body-parser");

//Function types
type RequestFunction = (error, response, body) => void;

//Interfaces (blueprints for objects; like classes but without methods)
interface OptionSet{
	url: string;
	method: string;
	headers: any;
	form?: any;
	query?: any
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
		form: {'UserName': 'xxx', 'Password': 'yyy',Picture:null,Birthday_year:1995,Birthday_month:2,Birthday_day:7,Gender: "M",GenderInto:"M",loc:null}
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
    form: {'UserName': 'xxx', 'Password': 'yyy',Picture:null,Birthday_year:1995,Birthday_month:2,Birthday_day:7,Gender: "M",GenderInto:"M",loc:null}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.Error != null && body.Error === -1)){
        success("test1");
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
        success("test2");
      }
      else{
        failure("test2", "Failed with logining in with create User")
      }
    }
    else{
      failure("test2", "error number " + error);
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
        success("test3");
      }
      else{
        failure("test3", "Failed with logining in with database User")
      }
    }
    else{
      failure("test3", "error number " + error);
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
        success("test4");
      }
      else{
        failure("test4", "Failed with logining in with database User")
      }
    }
    else{
      failure("test4", "error number " + error);
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
      if ((body.Error != null && body.Error === -1)){
        success("test5");
      }
      else{
        failure("test5", "Error did not occur with logining in with bad user name ")
      }
    }
    else{
      failure("test5", "error number " + error);
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
    form: {'UserID': '1', 'oldPassword': 'abcd1234',newPassword: '1234abcd'}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.success != null && body.success === 0)){
        success("test6");
      }
      else{
        failure("test6", "Login")
      }
    }
    else{
      failure("test6", "error number " + error);
    }
  }
};
testCases.push(editPassWord1);
//Test if login with given userName and new password
let createLogin5: TestCase = {
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
      if ((body.UserID != null && body.UserID > 0)){
        success("test7");
      }
      else{
        failure("test7", "Failed with logining in with create User")
      }
    }
    else{
      failure("test7", "error number " + error);
    }
  }
};
testCases.push(createLogin5);

//Test editPassword for user in database
let editPassWord2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/editPassword/',
    method: 'POST',
    headers: headers,
    form: {'UserID': '-1', 'oldPassword': 'abcd1234',newPassword: '1234abcd'}
  },
  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.Error != null && body.Error < 0)){
        success("test8");
      }
      else{
        failure("test8", "no error raised for invalid id");
      }
    }
    else{
      failure("test8", "error number " + error);
    }
  }
};

testCases.push(editPassWord2);

//Test editPassword with bad password
let editPassWord3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/editPassword/',
    method: 'POST',
    headers: headers,
    form: {'UserID': '1', 'oldPassword': 'abcd1234',newPassword: '1234abcd'}
  },
  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
      console.log(body);
      //checks to see if error
      if ((body.Error != null && body.Error < 0)){
        success("test9");
      }
      else{
        failure("test9", "Error changing password with invalid password");
      }
    }
    else{
      failure("test9", "error number " + error);
    }
  }
};
testCases.push(editPassWord3);

//Test login with alreay in database userName and password
let createLogin6: TestCase = {
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
      if ((body.Error != null && body.Error === -1)){
        success("test10");
      }
      else{
        failure("test10", "Edit password did not change password")
      }
    }
    else{
      failure("test10", "error number " + error);
    }
  }
};
testCases.push(createLogin6);
//TODO test login after this to make sure changes work
//addUserPref test cases
function addUserPref_requestFunction(testName: string, error, response, body){
		
		//Fail if error
		console.log("adduserPref request function");
		if (error){
			failure(testName, "error number " + error);
			return;
		}
		
		//Success if we received 0 from server, error if otherwise.
		if (body == 0){
			success(testName);
		}
		else{
			failure(testName, "body = " + body);
		}
}

let addUserPrefsTest0: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {UserID: 1, Name: "test pref name"}
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("adduserPrefsTest0", error, response, body);
	}
};
testCases.push(addUserPrefsTest0);

let addUserPrefs_invalidUserID0: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {UserID: -1, Name: "strange things" }
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidUserID0", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidUserID0);

let addUserPrefs_invalidUserID1: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {UserID: null, Name: "strange things" }
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidUserID1", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidUserID1);

let addUserPrefs_invalidUserID2: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {UserID: "username", Name: "strange things" }
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidUserID2", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidUserID2);

let addUserPrefs_invalidUserID3: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {Name: "strange things" }
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidUserID3", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidUserID3);

let addUserPrefs_invalidPrefName0: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {UserID: 1, Name: 0 }
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidPrefName0", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidPrefName0);

let addUserPrefs_invalidPrefName1: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {UserID: 1, Name: null}
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidPrefName1", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidPrefName1);

let addUserPrefs_invalidPrefName2: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {UserID: 1}
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidPrefName2", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidPrefName2);

let addUserPrefs_invalidForm0: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {}
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidForm0", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidForm0);

let addUserPrefs_invalidForm1: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {body: "LITTLE BOBBY TABLES"}
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidForm1", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidForm1);

let addUserPrefs_invalidForm2: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: 1
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidForm2", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidForm2);

let addUserPrefs_invalidForm3: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: "{UserID: 1, Name: \"wtf\"}"
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidForm3", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidForm3);

let addUserPrefs_invalidForm4: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: {}
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidForm0", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidForm4);

let addUserPrefs_invalidForm5: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/addUserPref',
		method: 'POST',
		headers: headers,
		form: null
	},
	
	requestFunction: function(error, response, body){
		addUserPref_requestFunction("addUserPref_invalidForm5", error, response, body);
	}
};
testCases.push(addUserPrefs_invalidForm5);


//test get matches
let getMatches1: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMatches/',
    method: 'GET',
    headers: headers,
    query: {UserID1:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  console.log(body);
	  if(body.length != 6){
       	failure("test11","wrong length of rows in getting matches");
      }
      else if(body[0].UserID == null || body[0].UserID != 2){
		failure("test11","wrong enrty in 1 in getting matches");
      }
      else if(body[body.length-1].UserID == null || body[body.length-1].UserID != 8){
        failure("test11", "wrong enrty in 9 in getting matches; expected 6, but got " + body.length);
      }
      else{
      	//checks to see if error
      	success("test11");
      }
    }
    else{
      failure("test11", "error number " + error);
    }
  }
};


testCases.push(getMatches1);
let getMatches2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMatches/',
    method: 'GET',
    headers: headers,
    form: {UserID1:2}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.length != 2){
        failure("test12","wrong length of rows in getting matches; expected 2, but got " + body.length);
      }
      else if(body[0].UserID == null || body[0].UserID != 1){
		failure("test12","wrong enrty in 1 in getting matches");
      }
      else if(body[body.length-1].UserID == null || body[body.length-1].UserID != 4){
        failure("test12", "wrong enrty in 2 in getting matches");
      }
      else{
      	//checks to see if error
      	success("test12");
      }
    }
    else{
      failure("test12", "error number " + error);
    }
  }
};
testCases.push(getMatches2);

let setBlocks: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/blockUser/',
    method: 'POST',
    headers: headers,
    form: {UserID1:2,UserID2:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test13");
	  }
	  else{
		  failure("test13", "Error in blocking user");
	  }
    }
    else{
      failure("test13", "error number " + error);
    }
  }
};
testCases.push(setBlocks);

let setBlocks2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/blockUser/',
    method: 'POST',
    headers: headers,
    form: {UserID1:8,UserID2:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test14");
	  }
	  else{
		  failure("test14", "Error in blocking user");
	  }
    }
    else{
      failure("test14", "error number " + error);
    }
  }
};
testCases.push(setBlocks2);

let setBlocks3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/blockUser/',
    method: 'POST',
    headers: headers,
    form: {UserID1:9,UserID2:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test14");
	  }
	  else{
		  failure("test14", "Error in blocking user");
	  }
    }
    else{
      failure("test14", "error number " + error);
    }
  }
};
testCases.push(setBlocks3);
let getMatches3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMatches/',
    method: 'GET',
    headers: headers,
    form: {UserID1:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.length != 4){
       	failure("test15","wrong length of rows in getting matches; expected 4, but got " + body.length);
      }
      else if(body[0].UserID == null || body[0].UserID != 3){
		failure("test15","wrong enrty in 1 in getting matches");
      }
      else if(body[body.length-1].UserID == null || body[body.length-1].UserID != 7){
        failure("test15", "wrong enrty in 9 in getting matches");
      }
      else{
      	//checks to see if error
      	success("test15");
      }
    }
    else{
      failure("test15", "error number " + error);
    }
  }
};
testCases.push(getMatches3);
let getMatches4: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMatches/',
    method: 'GET',
    headers: headers,
    form: {UserID1:2}
  },

  requestFunction: function(error, response, body){
    if (!error){
	  body = JSON.parse( body );
	  console.log(body);
	  if(body.length != 1){
        failure("test16","wrong length of rows in getting matches");
      }
      else if(body[body.length-1].UserID == null || body[body.length-1].UserID != 4){
        failure("test16", "wrong enrty in 2 in getting matches");
      }
      else{
      	//checks to see if error
      	success("test16");
      }
    }
    else{
      failure("test16", "error number " + error);
    }
  }
};
testCases.push(getMatches4);

let getMessages: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMessages/',
    method: 'GET',
    headers: headers,
    form: {UserID1:2,UserID2:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      console.log(body);
	  body = JSON.parse( body );
	  if(body.length != 3){
        failure("test17","wrong length of rows in getting matches");
      }
      else if(body[0].Message == null || body[0].Message !== "Hello"){
        failure("test17", "wrong enrty in 0 in getting messages");
      }
      else if(body[1].Message == null || body[1].Message !== "World"){
        failure("test17", "wrong enrty in 1 in getting messages");
      }
      else if(body[2].Message == null || body[2].Message !== "GoodBye"){
        failure("test17", "wrong enrty in 2 in getting messages");
      }
      else{
      	//checks to see if error
      	success("test17");
      }
    }
    else{
      failure("test17", "error number " + error);
    }
  }
};
testCases.push(getMessages);
let getMessages2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMessages/',
    method: 'GET',
    headers: headers,
    form: {UserID1:1,UserID2:2}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.length != 3){
        failure("test18","wrong length of rows in getting matches");
      }
      else if(body[0].Message == null || body[0].Message !== "Hello"){
        failure("test18", "wrong enrty in 0 in getting messages");
      }
      else if(body[1].Message == null || body[1].Message !== "World"){
        failure("test18", "wrong enrty in 1 in getting messages");
      }
      else if(body[2].Message == null || body[2].Message !== "GoodBye"){
        failure("test18", "wrong enrty in 2 in getting messages");
      }
      else{
      	//checks to see if error
      	success("test18");
      }
    }
    else{
      failure("test18", "error number " + error);
    }
  }
};
testCases.push(getMessages2);
let getMessages3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMessages/',
    method: 'GET',
    headers: headers,
    form: {UserID1:2,UserID2:3}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.length != 1){
        failure("test19","wrong length of rows in getting matches");
      }
      else if(body[0].Message == null || body[0].Message !== "I will miss you"){
        failure("test18", "wrong enrty in 0 in getting messages");
      }
      else{
      	//checks to see if error
      	success("test19");
      }
    }
    else{
      failure("test19", "error number " + error);
    }
  }
};
testCases.push(getMessages3);

let getMessages4: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getMessages/',
    method: 'GET',
    headers: headers,
    form: {UserID1:4,UserID2:5}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.length != 0){
        failure("test20","wrong length of rows in getting matches");
      }
      else{
      	//checks to see if error
      	success("test20");
      }
    }
    else{
      failure("test20", "error number " + error);
    }
  }
};
testCases.push(getMessages4);


let setAge: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/setAge/',
    method: 'POST',
    headers: headers,
    form: {UserID:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test21");
	  }
	  else{
		  failure("test21", "Error in adding age prefs");
	  }
    }
    else{
      failure("test21", "error number " + error);
    }
  }
};
testCases.push(setAge);

let setAge2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/setAge/',
    method: 'POST',
    headers: headers,
    form: {UserID:2,maxAge:55}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test22");
	  }
	  else{
		  failure("test22", "Error in adding age prefs");
	  }
    }
    else{
      failure("test22", "error number " + error);
    }
  }
};
testCases.push(setAge2);

let setAge3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/setAge/',
    method: 'POST',
    headers: headers,
    form: {UserID:3,minAge:35}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test23");
	  }
	  else{
		  failure("test23", "Error in adding age prefs");
	  }
    }
    else{
      failure("test23", "error number " + error);
    }
  }
};
testCases.push(setAge3);

let setAge4: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/setAge/',
    method: 'POST',
    headers: headers,
    form: {UserID:4,minAge:20,maxAge:60}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test24");
	  }
	  else{
		  failure("test24", "Error in adding age prefs");
	  }
    }
    else{
      failure("test24", "error number " + error);
    }
  }
};
testCases.push(setAge4);
let rel: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/inARelationship/',
    method: 'POST',
    headers: headers,
    form: {UserID:1,InARelationship:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test25");
	  }
	  else{
		  failure("test25", "Error in updating relationship status");
	  }
    }
    else{
      failure("test25", "error number " + error);
    }
  }
};
testCases.push(rel);
let rel2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/inARelationship/',
    method: 'POST',
    headers: headers,
    form: {UserID:1,InARelationship:0}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test26");
	  }
	  else{
		  failure("test26", "Error in updating relationship status");
	  }
    }
    else{
      failure("test26", "error number " + error);
    }
  }
};
testCases.push(rel2);
let rel3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/inARelationship/',
    method: 'POST',
    headers: headers,
    form: {UserID:2,InARelationship:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test27");
	  }
	  else{
		  failure("test27", "Error in updating relationship status");
	  }
    }
    else{
      failure("test27", "error number " + error);
    }
  }
};
testCases.push(rel3);
let rel4: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/inARelationship/',
    method: 'POST',
    headers: headers,
    form: {UserID:3,InARelationship:0}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test28");
	  }
	  else{
		  failure("test28", "Error in updating relationship status");
	  }
    }
    else{
      failure("test28", "error number " + error);
    }
  }
};
testCases.push(rel3);
let addLan: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/addUserLanguage/',
    method: 'POST',
    headers: headers,
    form: {UserID:1,Name:"Spanish"}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test29");
	  }
	  else{
		  failure("test29", "Error in updating relationship status");
	  }
    }
    else{
      failure("test29", "error number " + error);
    }
  }
};
testCases.push(addLan);

let addLan2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/addUserLanguage/',
    method: 'POST',
    headers: headers,
    form: {UserID:1,Name:"English"}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test30");
	  }
	  else{
		  failure("test30", "Error in updating relationship status");
	  }
    }
    else{
      failure("test30", "error number " + error);
    }
  }
};
testCases.push(addLan2);

let addLan3: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/addUserLanguage/',
    method: 'POST',
    headers: headers,
    form: {UserID:2,Name:"English"}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.success != null && body.success == 0){
		  success("test31");
	  }
	  else{
		  failure("test31", "Error in updating Language status");
	  }
    }
    else{
      failure("test31", "error number " + error);
    }
  }
};
testCases.push(addLan3);

let getLanguage: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getUserLanguage/',
    method: 'GET',
    headers: headers,
    form: {UserID:1}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.length != 2){
        	failure("test32","wrong length of rows in getting Language");
    	}
    	else if(body[0].Name == null || body[0].Name !== "Spanish"){
       		failure("test32", "Error in getting row 0 for Lan");
  	 	}
		else if(body[0].Name == null || body[1].Name !== "English"){
			failure("test32", "Error in getting row 1 for Lan");
		}
    	else{
        	success("test32");  
    	}
    }
    else{
      failure("test32", "error number " + error);
    }
  }
};
testCases.push(getLanguage);

let getLanguage2: TestCase = {
  options: {
    url: 'http://localhost:3000/BackEnd/getUserLanguage/',
    method: 'GET',
    headers: headers,
    form: {UserID:2}
  },

  requestFunction: function(error, response, body){
    if (!error){
      body = JSON.parse( body );
	  if(body.length != 1){
        failure("test33","wrong length of rows in getting Language");
    	}
		else if(body[0].Name == null || body[0].Name !== "English"){
			failure("test33", "Error in getting row 1 for Lan");
		}
    	else{
        	success("test33");  
    	}
    }
    else{
      failure("test33", "error number " + error);
    }
  }
};
testCases.push(getLanguage2);

let getMatches0: TestCase = {
	
	options: {
		url: 'http://localhost:3000/BackEnd/getMatches/',
		method: 'GET',
		headers: headers,
		form: {UserID:2}
  },

  requestFunction: function(error, response, body){
    if (!error){
		console.log(body);
		success("getMatches0");
    }
    else{
		failure("getMatches0", "error number " + error);
    }
  }
	
};
testCases.push(getMatches0);


//File entry point
nextTest();
