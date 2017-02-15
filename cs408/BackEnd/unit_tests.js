var allTests = []; //This array stores all test case functions.  We will iterate through them and execute them.
//All tests return true on passing, and false on failing.
function testAll() {
    //Runs all test cases.  Prints a message each time one of them fails.
    for (var i = 0; i < allTests.length; i++) {
        //Run this test
        var success_1 = allTests[i]();
        //If it failed, log that.
        if (success_1) {
            console.log("TEST PASSED: " + i);
        }
        else {
            console.log("*TEST FAILED: " + i);
        }
    }
}
function alwaysPasses() {
    //This test always passes.
    return true;
}
allTests.push(alwaysPasses);
function createAccount_basic() {
    //Attempts to create an account that does not already exist
    var sql = require("./sql.js");
    //Create the account
    var jsonRequest = {
        UserName: "UniqueName",
        Password: "Password(with salt)",
        Picture: "Null",
        Birthday: "00/00/0000",
        Gender: "M",
        GenderInto: "F",
        Location: "Here",
        InARelationship: "false"
    };
    var result = sql.createAccount(jsonRequest, "null", "null"); //TODO: Persuade Alex Meyer to make sql not care about the connection.
    //Assert that the account does not exist.
    return false;
}
allTests.push(createAccount_basic);
//File entry point.
testAll();
