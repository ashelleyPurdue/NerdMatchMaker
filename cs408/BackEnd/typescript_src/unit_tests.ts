type TestCaseFunction = () => boolean;

var allTests:TestCaseFunction[] = [];	//This array stores all test case functions.  We will iterate through them and execute them.
										//All tests return true on passing, and false on failing.
										
function testAll(): void
{
	//Runs all test cases.  Prints a message each time one of them fails.
	for (let i:number = 0; i < allTests.length; i++)
	{
		//Run this test
		let success: boolean = allTests[i]();
		
		//If it failed, log that.
		if (success)
		{
			console.log("TEST PASSED: " + i);
		}
		else
		{
			console.log("*TEST FAILED: " + i);
		}
	}
}

function alwaysPasses(): boolean
{
	//This test always passes.
	return true;
}
allTests.push(alwaysPasses);

function createAccount_basic(): boolean
{
	//Attempts to create an account that does not already exist
	
	let sql = require("./sql.js");
	
	//Create the account
	let jsonRequest: any = 
	{
		UserName: "UniqueName",
		Password: "Password(with salt)",
		Picture: "Null",
		Birthday : "00/00/0000",
		Gender: "M",
		GenderInto: "F",
		Location: "Here",
		InARelationship: "false"
	};
	
	let result: number = sql.createAccount(jsonRequest, "null", "null");		//TODO: Persuade Alex Meyer to make sql not care about the connection.
	
	//Assert that the account does not exist.
	
	return false;
}
allTests.push(createAccount_basic);


//File entry point.
testAll();
