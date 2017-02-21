import sqlFile = require("./temp.js");
var con = sqlFile.createCon();
var i = 0;
var userID = 0;
var allTests = []; //This array stores all test case functions.  We will iterate through them and execute them.
//All tests return true on passing, and false on fail
var error;
var success;
var tempID;
var ret;

var finishedTestAll:bool = false;

var testAll = function(){
    //Runs all test cases.  Prints a message each time one of them fails.
    if (i != 0) {
        //Test to see if is Success or not
        if (allTests[i - 1].check() == true) {
			//TODO: Do something
        }

    }
    if (i >= allTests.length) {
        console.log("we are done");
		
		//Force an exception to happen if we're running this again.
		if (finishedTestAll){
			let crashMeBaby = null;
			crashMeBaby.bogusMethod();
		}
		finishedTestAll = true;
		
        return;
    }
    allTests[i++].fun();
    //so next time this called it will go the next function  :
}

function alwaysPasses() {
    //This test always passes.
    return true;
}

var createAccount_basic = function() {
    var user = ({ UserName: "User" + userID++, Password: "abcd1234", Picture: null, Birthday: "02/" + userID + "/1995", Gender: "M", GenderInto: "M", loc: null, InARelationship: false });
    var callback = { error: createTestError, success: genericSuccessTest, main: testAll };
    sqlFile.createAccount(user, callback, null);
};

var login = function() {
    if (userID <= 0) {
        return;
    }
    var user = ({ UserName: "User" + (--userID), Password: "abcd1234" });
    var callback = { error: genericErrorTest, success: loginTest, main: testAll, Empty: loginEmptySet };
    sqlFile.login(user, null, callback);
}
//checks login with a failed password
var loginFailPassword = function(){
  if (userID <= 0) {
        return;
    }
    var user = ({ UserName: "User" + (--userID), Password: "wrong" });
    var callback = { error: genericErrorTest, success: loginTest, main: testAll, Empty: loginEmptySet };
    sqlFile.login(user, null, callback);

}
//checks login with a failed user name
var loginFailUserName = function(){
    var user = ({ UserName: "Not a User", Password: "abcd1234" });
    var callback = { error: genericErrorTest, success: loginTest, main: testAll, Empty: loginEmptySet };
    sqlFile.login(user, null, callback);
}

//Checks login and if login is success it will call change password, which deals with changing the password of the user
var editPassword = function(){
  if(userID < 0){
    return;
  }
  var json = {UserName:"User"+userID++,Password:"abcd1234",newPassword:"1234abcd"};
  var callback = {main:testAll,error:genericErrorTest,Empty:loginEmptySet,success:loginForEdPassSuc};
  sqlFile.login(json,null,callback);
  
}
//return true or false if it successful or not
//only works if no error is assumed to happen
var isSuccess = function(){
  if(success){
    console.log("test case"+(i-1)+" success");
    success = false;
    return true;
  }
  else{
	console.log("test case "+(i-1)+" failed");
    console.error(error);
    return false;
  }
}
//this function will tell if logining was a failure like we expect to be.
var loginFailure = function(){
  if(success){
    console.log("login when it shouldn't have");
    success = false;
    return false;
  }
  else{
    if(error === "User name or password is incorrect"){
      console.log("Test "+ (i-1)+ " is a success");
      return true;
    }
    else{
      console.log(error);
      return false;
    }
  }
}
var isRepeatUserName = function(){
  if(success){
    console.log("Create dup user names");
  }
  else{
    if(error === "UserName already exist"){
      console.log("Test "+ (i-1)+ " is a success");
      return true;
    }
    else{
      console.log(error);
    }
  }
}
var loginForEdPassSuc = function(rows,json,res,callback){
  var call = {error:genericErrorTest,main:testAll,success:genericSuccessTest};
  json.UserID = rows[0].UserID;
  sqlFile.editPassword(json,null,call); 
}
//Function is called in case of an error in creating account to see if error is called or not
var createTestError = function(err,json,res,callback){
  success = false;
  var userName = {UserName : json.UserName};
  con.query('Select * from User where ?',userName,function(err2,rows){
    //err happen twice must be sql error happening
    if(err2){
      //TODO deal with error in what ever way we will deal with it
      //console.err(err2);
      error = err2;
      //return2
    } else if (rows.length == 0) {
            //must be error in first statement
            //console.err(err);
            error = err;
            //return err
        } else {
            error = "UserName already exist";
        }
        //go to the next method
        callback.main();
    });
};
//Called if a success in creating an account
var genericSuccessTest = function(rows, json, res, callback) {
    success = true;
    //TODO how do i want to call the function to let it know it successed and go to the next function
    //or call back to restart process
    callback.main();
};
//called in login was done successfully
var loginTest = function(rows, json, res, callback) {
    success = true;
    ret = rows[0].UserID;
    //TODO how do i want to call the function to let it know it successed and go to the next function
    //or call back to restart process
    callback.main();
};
//called if error in login happens
var genericErrorTest = function(err, json, res, callback, con) {
    success = false;
    error = err;
    callback.main();
};
//called if a empty set is returned in login test
var loginEmptySet = function(res,callback) {
    success = false;
    error = "User name or password is incorrect";
    callback.main();
};
var getPrefsError = function(err, json, res, callback, con) {
  success = false;
  error = err;
}

/* Tests for addUserPref */
var addUserPrefTest0 = function(){
	//Basic test with obvious functionality
	let callback = { error: genericErrorTest, success: genericSuccessTest, main: testAll };
	sqlFile.addUserPref({UserID: 1, Name: "Test"}, callback, null);
}

var addUserPrefTest1 = function(){
	//Invalid UserID.
	let callback = { error: genericErrorTest, success: genericSuccessTest, main: testAll };
	sqlFile.addUserPref({UserID: -1, Name: "Test"}, callback, null);
}

var addUserPrefTest2 = function(){
	//Null pref name
	let callback = { error: genericErrorTest, success: genericSuccessTest, main: testAll };
	sqlFile.addUserPref({UserID: 1, Name: null}, callback, null);
}

var addUserPrefTest3 = function(){
	//Deplicate pref name.
	//Should be successful
	let callback = { error: genericErrorTest, success: genericSuccessTest, main: addUserPrefTest3_afterFirst };
	sqlFile.addUserPref({UserID: 1, Name: "Test"}, callback, null);
}

function addUserPrefTest3_afterFirst(){
	let callback = { error: genericErrorTest, success: genericSuccessTest, main: testAll };
	sqlFile.addUserPref({UserID: 1, Name: "Test"}, callback, null);
}

function notSuccess(){
	//Success should be set to false.
	if(success){
	console.log("Test " + (i-1) + " failed");
    console.log("Error should not have passed");
  }
  else{
    console.log("test case "+(i-1)+" passed");
  }
  return !success;
}

/* End of tests for addUserPref */

/* Tests for getUserPref */
var getUserPrefTest0 = function(){
	//Normal userID
	let callback = {error: genericErrorTest, success: genericSuccessTest, main: testAll};
	sqlFile.getUserPref({UserID: 1}, callback, null);
};

var getUserPrefTest1 = function(){
	//Invalid userID
	let callback = {error: genericErrorTest, success: genericSuccessTest, main: testAll};
	sqlFile.getUserPref({UserID: -1}, callback, null);
};

var getUserPrefTest2 = function(){
	//Null userID
	let callback = {error: genericErrorTest, success: genericSuccessTest, main: testAll};
	sqlFile.getUserPref({UserID: null}, callback, null);
};

var getUserPrefTest3 = function(){
	//Empty json object
	let callback = {error: genericErrorTest, success: genericSuccessTest, main: testAll};
	sqlFile.getUserPref({}, callback, null);
};

var getUserPrefTest4 = function(){
	//Null json object
	let callback = {error: genericErrorTest, success: genericSuccessTest, main: testAll};
	sqlFile.getUserPref(null, callback, null);
};

var getUserPrefTest5 = function(){
	//UserID is wrong type
	let callback = {error: genericErrorTest, success: genericSuccessTest, main: testAll};
	sqlFile.getUserPref({UserID: "I'm not an integer."}, callback, null);
};

/* End of tests for getUserPref */

var getPrefsSuccess = function(rows, json, res, callback) {
  success = true;
  ret = rows;
  callback.main();
}
//TODO finish
var successGetPrefs = function(){
  // TODO go through rows and find out if we get the right things that we expect
  //console.log(ret);
  if(ret.length > 0 && ret[0].Name != null && ret[0].Name === "Test"){
    console.log("Test case "+(i-1)+" passed"); 
  }
  else{
    console.log("Test case " + (i-1) + " failed"); 
  }
  return true;
}
var successGetPrefsEmpty = function(){

  if(ret.length === 0){
    console.log("Test case "+(i-1)+"success");
    return true;
  }
  else{
    console.log("Test case failed");
    return false;
  }
};
//Start getPrefsSuccess
var getPrefTest = function(){
  let callback = {error: genericErrorTest, success: getPrefsSuccess , main: testAll};
  sqlFile.getPrefs(null,callback,null);
}
//tests going through creating basic users
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
//tests logining with said basic users
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
//tests dup user names
allTests.push({fun:createAccount_basic,check:isRepeatUserName});
allTests.push({fun:createAccount_basic,check:isRepeatUserName});
allTests.push({fun:createAccount_basic,check:isRepeatUserName});
allTests.push({fun:createAccount_basic,check:isRepeatUserName});
allTests.push({fun:createAccount_basic,check:isRepeatUserName});
//tests if user name can login or not
allTests.push({fun:loginFailPassword,check:loginFailure});
allTests.push({fun:loginFailPassword,check:loginFailure});
allTests.push({fun:loginFailPassword,check:loginFailure});
allTests.push({fun:loginFailPassword,check:loginFailure});
allTests.push({fun:loginFailPassword,check:loginFailure});
//tests if login is a failure or not with a bad username
allTests.push({fun:loginFailUserName,check:loginFailure});
//tests if password can be edited or not
allTests.push({fun:editPassword,check:isSuccess});
allTests.push({fun:editPassword,check:isSuccess});
allTests.push({fun:editPassword,check:isSuccess});
allTests.push({fun:editPassword,check:isSuccess});
allTests.push({fun:editPassword,check:isSuccess});
//tests if passowrd is edited or not as basic login should now fail
allTests.push({fun:login,check:loginFailure});
allTests.push({fun:login,check:loginFailure});
allTests.push({fun:login,check:loginFailure});
allTests.push({fun:login,check:loginFailure});
allTests.push({fun:login,check:loginFailure});
//tests to make sure editPassword fails as username is now different
allTests.push({fun:editPassword,check:loginFailure});
allTests.push({fun:editPassword,check:loginFailure});
allTests.push({fun:editPassword,check:loginFailure});
allTests.push({fun:editPassword,check:loginFailure});
allTests.push({fun:editPassword,check:loginFailure});

//getAllUserPref to check if empty
allTests.push({fun: getPrefTest, check: successGetPrefsEmpty});

//addUserPref
allTests.push({fun: addUserPrefTest0, check: isSuccess});
allTests.push({fun: addUserPrefTest1, check: notSuccess});
allTests.push({fun: addUserPrefTest2, check: notSuccess});
allTests.push({fun: addUserPrefTest3, check: notSuccess});

//getUserPref
allTests.push({fun: getUserPrefTest0, check: isSuccess});
allTests.push({fun: getUserPrefTest1, check: notSuccess});
allTests.push({fun: getUserPrefTest2, check: notSuccess});
allTests.push({fun: getUserPrefTest3, check: notSuccess});
allTests.push({fun: getUserPrefTest4, check: notSuccess});
allTests.push({fun: getUserPrefTest5, check: notSuccess});

//getAllUserPref
allTests.push({fun: getPrefTest, check: successGetPrefs});

//File entry point.
testAll();
