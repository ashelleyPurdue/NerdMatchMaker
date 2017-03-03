import sqlFile = require("./sql");
var con = sqlFile.createCon();
var i = 0;
var userID = 0;
var allTests = []; //This array stores all test case functions.  We will iterate through them and execute them.
//All tests return true on passing, and false on fail
var error;
var success;
var tempID;
var ret;

var finishedTestAll:boolean = false;

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
		sqlFile.con.end();
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
    var user = ({ UserName: "User" + userID++, Password: "abcd1234", Picture: null, Birthday_month:2, Birthday_day:userID,Birthday_year:1995, Gender: "M", GenderInto: "M", loc: null, InARelationship: false });
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
//end test case for getting matches
var getMatchesTest = function(){
  let callback = {error: genericErrorTest, success:getMatchesSuccess1  , main: testAll};
  sqlFile.getMatches({UserID1:1},callback,null);
}

var getMatchesTest2 = function(){
  let callback = {error: genericErrorTest, success:getMatchesSuccess2  , main: testAll};
  sqlFile.getMatches({UserID1:2},callback,null);
}
var getMatchesTest3 = function(){
  let callback = {error: genericErrorTest, success:getMatchesSuccess3  , main: testAll};
  sqlFile.getMatches({UserID1:1},callback,null);
}
var getMatchesSuccess1 = function(rows, json, res, callback){
    //console.log("Amount of matches =" + rows);
    if(rows.length != 6){
        success = false;
        error = "wrong length of rows in getting matches"
    }
    else if(rows[0].UserID == null || rows[0].UserID != 2){
        success = false;
        error = "wrong enrty in 1 in getting matches"
    }
    else if(rows[rows.length-1].UserID == null || rows[rows.length-1].UserID != 8){
        success = false;
        error = "wrong enrty in 9 in getting matches"
    }
    else{
        success = true;
    }
    callback.main();
}
var getMatchesSuccess2 = function(rows, json, res, callback){
    //console.log("Amount of matches =" + rows.length);
    if(rows.length != 2){
        success = false;
        error = "wrong length of rows in getting matches"
    }
    else if(rows[0].UserID == null || rows[0].UserID != 1){
        success = false;
        error = "wrong enrty in 1 in getting matches"
    }
    else if(rows[rows.length -1].UserID == null || rows[rows.length -1].UserID != 4){
        success = false;
        error = "wrong enrty in 2 in getting matches"
    }
    else{
        success = true;
    }
    callback.main();
}
var setBlocksTest = function(){
    let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
    sqlFile.blockUser({UserID1:2,UserID2:1},callback,null);    
}
var setBlocksTest2 = function(){
    let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
    sqlFile.blockUser({UserID1:9,UserID2:1},callback,null);    
}
var getMatchesSuccess3 = function(rows, json, res, callback){
    if(rows.length != 5){
        success = false;
        error = "wrong length of rows in getting matches"
    }
    else if(rows[0].UserID == null || rows[0].UserID != 3){
        success = false;
        error = "wrong enrty in 1 in getting matches"
    }
    else if(rows[rows.length-1].UserID == null || rows[rows.length-1].UserID != 8){
        success = false;
        error = "wrong enrty in 9 in getting matches"
    }
    else{
        success = true;
    }
    callback.main();
}
//end test cases for getting matches
var getMessagesTest = function(){
    let callback = {error: genericErrorTest, success: getMessagesSuccess , main: testAll};
    sqlFile.getMessages({UserID1:2,UserID2:1},callback,null);    
}
var getMessagesSuccess = function(rows, json, res, callback){
    if(rows.length != 3){
        success = false;
        error = "wrong length of rows in getting messages"
    }
    else if(rows[0].Message == null || rows[0].Message !== "Hello"){
        success = false; 
        error = "Did not get right message for row 0"
    }
    else if(rows[1].Message == null || rows[1].Message !== "World"){
        success = false; 
        error = "Did not get right message for row 1"
    }
    else if(rows[2].Message == null || rows[2].Message !== "GoodBye"){
        success = false; 
        error = "Did not get right message for row 1"
    }
    else{
        success = true;   
    }
    callback.main();
}
var getMessagesTest2 = function(){
    let callback = {error: genericErrorTest, success: getMessagesSuccess , main: testAll};
    sqlFile.getMessages({UserID1:1,UserID2:2},callback,null);    
}
var getMessagesTest3 = function(){
    let callback = {error: genericErrorTest, success: getMessagesSuccess2 , main: testAll};
    sqlFile.getMessages({UserID1:2,UserID2:3},callback,null);    
}
var getMessagesSuccess2 = function(rows, json, res, callback){
    if(rows.length != 1){
        success = false;
        error = "wrong length of rows in getting messages"
    }
    else if(rows[0].Message == null || rows[0].Message !== "I will miss you"){
        error = "Did not get right message for row 0"
    }
    else{
        success = true;   
    }
    callback.main();
}
//end checking for messages
//check for adding Messages
var addMessageTest = function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll,Empty:emptyAddMessage};
    sqlFile.insertMessage({UserID1:3,UserID2:1,Message:"I will see you soon"},callback,null);	
}
var addMessageTest2 = function(){
	let callback = {error: genericErrorTest, success: successFailureTest , main: testAll,Empty:emptyTest};
    sqlFile.insertMessage({UserID1:9,UserID2:1,Message:"I will see you soon"},callback,null);	
}
var emptyAddMessage = function(res,callback){
	success = false;
	error = "should allowed those two to talk"
	callback.main();
}
var addMessageTest3 = function(){
	let callback = {error: genericErrorTest, success: successFailureTest , main: testAll,Empty:emptyTest};
    sqlFile.insertMessage({UserID1:9,UserID2:8,Message:"I will see you soon"},callback,null);	
}
var successFailureTest = function(rows, json, res, callback){
	success = false;
	error = "Should not allowed to contact someone of that is not matched or blocked";
}
//Called if a success in creating an account
var emptyTest = function (res, callback) {
    success = true;
    callback.main();
};
var getMessagesTest4 = function(){
    let callback = {error: genericErrorTest, success: getMessagesSuccess4 , main: testAll};
    sqlFile.getMessages({UserID1:1,UserID2:3},callback,null);    
}
var getMessagesSuccess4 = function(rows, json, res, callback){
    if(rows.length != 1){
        success = false;
        error = "wrong length of rows in getting messages"
    }
    else if(rows[0].Message == null || rows[0].Message !== "I will see you soon"){
        error = "Did not get right message for row 0"
    }
    else{
        success = true;   
    }
    callback.main();
}
//end test messages
var testAddMinAge = function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.setAge({UserID:1,minAge:18},callback,null);
}
var testAddMaxAge = function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.setAge({UserID:2,maxAge:21},callback,null);
}	
var testAddAge = function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.setAge({UserID:3,maxAge:40,minAge:30},callback,null);
}
var testInARel = function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.changeRelationStatus({UserID:1,InARelationship:true}
,callback,null);
}	
var testInARel2 = function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.changeRelationStatus({UserID:2,InARelationship:false}
,callback,null);
}	
var testInARel3= function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.changeRelationStatus({UserID:3,InARelationship:true}
,callback,null);
};	
var testInARel4= function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.changeRelationStatus({UserID:3,InARelationship:false}, callback ,null);
};	
var addLan= function(){
	let callback = {error: genericErrorTest, success: genericSuccessTest , main: testAll};
	sqlFile.addUserLan({UserID:3,Name:"English"}, callback ,null);
};	
var getLan= function(){
	let callback = {error: genericErrorTest, success: getLanSuccess , main: testAll};
	sqlFile.getUserLan({UserID:3}, callback ,null);
};
var getLanSuccess = function(rows, json, res, callback){
	if(rows.length != 1){
        success = false;
        error = "wrong length of rows in getting Language"
    }
    else if(rows[0].Name == null || rows[0].Name !== "English"){
        error = "Did not get right English for row 0"
		success = false;
    }
    else{
        success = true;   
    }
    callback.main();
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

//check for getmatches works right
allTests.push({fun:getMatchesTest,check:isSuccess});
allTests.push({fun:getMatchesTest2,check:isSuccess});
allTests.push({fun:setBlocksTest,check:isSuccess});
allTests.push({fun:setBlocksTest2,check:isSuccess});
allTests.push({fun:getMatchesTest3,check:isSuccess});
allTests.push({fun:getMessagesTest,check:isSuccess});
allTests.push({fun:getMessagesTest2,check:isSuccess});
allTests.push({fun:getMessagesTest3,check:isSuccess});
allTests.push({fun:addMessageTest,check:isSuccess});
allTests.push({fun:addMessageTest2,check:isSuccess});
allTests.push({fun:addMessageTest3,check:isSuccess});
allTests.push({fun:getMessagesTest4,check:isSuccess});
allTests.push({fun:testAddMinAge,check:isSuccess});
allTests.push({fun:testAddMaxAge,check:isSuccess});
allTests.push({fun:testAddAge,check:isSuccess});
allTests.push({fun:testInARel,check:isSuccess});
allTests.push({fun:testInARel2,check:isSuccess});
allTests.push({fun:testInARel3,check:isSuccess});
allTests.push({fun:testInARel4,check:isSuccess});
allTests.push({fun:addLan,check:isSuccess});
allTests.push({fun:getLan,check:isSuccess});
//check for blocking works correct
//File entry point.
testAll();
