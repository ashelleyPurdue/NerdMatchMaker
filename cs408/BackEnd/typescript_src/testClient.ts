//Imports/requires
var request = require('request');


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

function success(testID: number){
	//Call this function inside your requestFunction when the test passes.
	
	console.log("Test " + testID + " passed");
	nextTest();
}

function failure(testID: number, message: string){
	//Call this function inside your requestFunction when the test fails.
	
	console.log("Test " + testID + " failed: " + message);
	nextTest();
}

//Test cases
let testCase0: TestCase = {
	options: {
		url: 'http://localhost:3000/BackEnd/createUser/',
		method: 'POST',
		headers: headers,
		form: {'UserName': 'xxx', 'Password': 'yyy',Picture:null,Birthday:"02/07/1995",Gender: "M",GenderInto:"M",loc:null}
	},
	
	requestFunction: function(error, response, body){
		if (!error){
			console.log(body);
			
			if (body[0].UserID != null && body[0].UserID > 0){
				success(0);
			}
			else{
				failure(0, "insert failure reason here")
			}
		}
		else{
			failure(0, "error number " + error);
		}
	}
};
testCases.push(testCase0);

//File entry point
nextTest();

/*
// Configure the request
var options: OptionSet = {
    url: 'http://localhost:3000/BackEnd/createUser/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'xxx', 'Password': 'yyy',Picture:null,Birthday:"02/07/1995",Gender: "M",GenderInto:"M",loc:null}
};

// Start the request
request(options, function (error, response, body){
  if(!error){
      console.log(body);
      if(body[0].UserID != null && body[0].UserID > 0){
        console.log("Success");
      }
      else{
        console.log("failure");
      }
  }
  else{
    console.log(error);
  }
});
*/

