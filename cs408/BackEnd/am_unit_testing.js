const sqlFile = require("./temp.js");
sqlFile.con = sqlFile.createCon();
var i = 0;
var userID = 0;
var allTests = []; //This array stores all test case functions.  We will iterate through them and execute them.
//All tests return true on passing, and false on fail
var error;
var success;
var testAll = function(){
    //Runs all test cases.  Prints a message each time one of them fails.
  if(i != 0){
    //Test to see if is Success or not
    if(allTests[i-1].check() == true){
    
    }

  }
  if(i >= allTests.length){
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


//allTests.push(alwaysPasses);
var createAccount_basic = function() {
  var user = ({UserName: "User"+userID++,Password:"abcd1234",Picture:null,Birthday:"02/"+userID+"/1995",Gender:"M",GenderInto:"M",Location:null,InARelationship:false});
  var callback = {error:createTestError,success:genericSuccessTest,main:testAll};
  sqlFile.createAccount(user,callback,null);
};

var login = function() {
  if(userID <= 0){
    return;
  }
  var user = ({UserName:"User"+(--userID),Password:"abcd1234"});
  var callback = {error:genericErrorTest,success:loginTest,main:testAll,Empty:loginEmptySet};
  sqlFile.login(user,null,callback);
}
var editPassword = function(){
  if(userID < 0){
    return;
  }
  var json = {UserName:"User"+userID++,oldPassword:"abcd1234",newPassword:"1234abcd"};
  var callback = {error:genericErrorTest,main:testAll,success:genericErrorTest};

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
    }
    else if(rows.length == 0){
      //must be error in first statement
      //console.err(err);
      error = err;
      //return err
    }
    else{
      error = "UserName already exist";
    }
    //go to the next method
    callback.main();
  });
};
//Called if a success in creating an account
var genericSuccessTest = function(rows,json,res,callback){
  success = true;
   //TODO how do i want to call the function to let it know it successed and go to the next function
  //or call back to restart process
  callback.main();
};
//called in login was done successfully
var loginTest = function(rows,json,res,callback){
  success = true;
  ret = rows[0].UserID;
  //TODO how do i want to call the function to let it know it successed and go to the next function
  //or call back to restart process
  callback.main();
};
//called if error in login happens
var genericErrorTest = function(err,json,res,callback,con){
  success = false;
  error = err;
  callback.main();
};
//called if a empty set is returned in login test
var loginEmptySet = function(res){
  success = false;
  error = "User name or password is incorrect";
  callback.main();
};

allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});
allTests.push({fun:login,check:isSuccess});

//File entry point.
testAll();
