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
function addUserPrefs_requestFunction(testName: string, error, response, body){
		
		//Fail if error
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

//File entry point
nextTest();
