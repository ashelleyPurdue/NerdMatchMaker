var mysql = require("mysql");
var sqlFile = require("../BackEnd/sql.js");
var user;
var con = sqlFile.createCon();
//create count amount of generic users
function CreateUsers(count){
  if(typeof con == 'number' ){
    console.error("Error with connection");
    return;
  }
  //console.log(con);
    user = ({UserName: "User"+count,Password:"abcd1234",Picture:null,Birthday:"02/"+count+"/1995",Gender:"M",GenderInto:"M",Location:null,InARelationship:false}); 
}
function createAccount(user){
  if(typeof con == 'number' ){
    console.error("Error with connection");
    return;
  }
  sqlFile.createAccount(user,con,null);
}
function login (user){
  if(typeof con == 'number' ){
    console.error("Error with connection");
    return;
  }
  sqlFile.login({UserName:user.UserName,Password:user.Password},con,null,true);
}
function changePassword(user,newPassword){
  if(typeof con == 'number' ){
    console.error("Error with connection");
    return;
  }
  sqlFile.editPassword({UserName: user.UserName,oldPassword:user.Password,newPassword:newPassword},con,null);
  user.Password = newPassword;
  login(user);
}
//to test account creation
//give args node class testNumber numberOfAccounts
function main(){
  //console.log(process.argv);
  if(process.argv.length != 4){
    console.error("Error in args");
    con.end();
    return;
  }
  CreateUsers(parseInt(process.argv[3]));
  if(process.argv[2] === 'test1'){
    //console.log("test1");
    createAccount(user);
  }
  else if(process.argv[2] == 'test2'){
    //console.log("test2");  
    login(user);
  }
  else if(process.argv[2] == 'test3'){
    //console.log("test3");
    changePassword(user,"abc");
  }
  //testing logining with invalid password
  else if(process.argv[2] == 'test4'){
    //console.log("test4");
    user.Password = "";
    login(user);
  }
  else if(process.argv[2] == 'test5'){
    //console.log("test5");
    user.Password = "not my password"
    login(user);
  }
  //invaild database entry
  else if(process.argv[2] == 'test6'){
    //console.log("test6");
    user.UserName = null;
    user.Password = null;
    createAccount(user);
  }
  //
  else if(process.argv[2] == 'test7'){
    //console.log("test7");
    user.UserName = null;
    createAccount(user);
  }
  else if(process.argv[2] == 'test8'){
    //console.log("test8");
    user.Password = null;
    createAccount(user);
  }
  //testing changing password with invalid password
  else if(process.argv[2] == 'test9'){
    //console.log("test9");
    user.Password = "";
    changePassword(user,"IDC")
  }
  else if(process.argv[2] == 'test10'){
    //console.log("test10");
    user.Password = "Incorrect";
    changePassword(user,"IDC")
  }
}
main();
