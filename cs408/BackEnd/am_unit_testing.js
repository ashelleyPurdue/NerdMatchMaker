const sqlFile = require("./temp.js");
sqlFile.con = sqlFile.createCon();
var i = 0;
var userID = 0;
var allTests = []; //This array stores all test case functions.  We will iterate through them and execute them.
//All tests return true on passing, and false on fail
var error;
var success;
var tempID;
var ret;
var testAll = function(){
    //Runs all test cases.  Prints a message each time one of them fails.
    if (i != 0) {
        //Test to see if is Success or not
        if (allTests[i - 1].check() == true) {

        }

    }
    if (i >= allTests.length) {
        console.log("we are done");
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
    var user = ({ UserName: "User" + userID++, Password: "abcd1234", Picture: null, Birthday: "02/" + userID + "/1995", Gender: "M", GenderInto: "M", Location: null, InARelationship: false });
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
  if (userID <= 0) {
        return;
    }
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
    console.log("test case"+i+" success");
    success = false;
    return true;
  }
  else{
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
      console.log("Test"+ (i)+ " is a success");
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
      console.log("Test"+ (i)+ " is a success");
      return true;
    }
    else{
      console.log(error);
    }
  }
}
var loginForEdPassSuc = function(rows,json,res,callback){
  var call = {error:genericErrorTest,main:testAll,success:genericSuccessTest};
  sqlFile.editPassword(json,null,call); 
}
//Function is called in case of an error in creating account to see if error is called or not
var createTestError = function(err,json,res,callback,con){
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
var loginEmptySet = function(res) {
    success = false;
    error = "User name or password is incorrect";
    callback.main();
};
var getPrefsError = function(err, json, res, callback, con) {
  success = false;
  error = err;
}

var getPrefsSuccess = function(rows, json, res, callback) {
  success = true;
  ret = rows;
}
var successGetPrefs = function(){
  // TODO go through rows and find out if we get the right things that we expect
  
}
//tests going through creating basic users
allTests.push({fun:createAccount_basic,check:isSuccess});
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

//File entry point.
testAll();
