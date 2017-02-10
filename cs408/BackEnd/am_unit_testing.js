const sqlFile = require("./temp.js");
sqlFile.con = sqlFile.createCon();
var i = 0;
var userID = 0;
var allTests = []; //This array stores all test case functions.  We will iterate through them and execute them.
//All tests return true on passing, and false on fail
var testAll = function(){
    //Runs all test cases.  Prints a message each time one of them fails.
  if(i != 0){
    //TODO test if last case successed or not and see what must be done
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
  user = ({UserName: "User"+userID++,Password:"abcd1234",Picture:null,Birthday:"02/"+userID+"/1995",Gender:"M",GenderInto:"M",Location:null,InARelationship:false});
  var callback = {error:createTestError,success:createAccountTest,main:testAll};
  sqlFile.createAccount(user,callback,null);
};
var login = function() {
  console.log
}
//return true or false if it successful or not
//only works if no error is assumed to happen
var isSuccess = function(){
  if(sqlFile.success){
    console.log("test case"+i+" success");
    sqlFile.success = false;
    return true;
  }
  else{
    console.error(sqlFile.error);
    return false;
  }
}
var createTestError = function(err,json,res,callback,con){
  sucess = false;
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
var createAccountTest = function(rows,json,res,callback){
  sucess = true;
   //TODO how do i want to call the function to let it know it successed and go to the next function
  //or call back to restart process
  callback.main();
};
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
allTests.push({fun:createAccount_basic,check:isSuccess});
//File entry point.
testAll();
