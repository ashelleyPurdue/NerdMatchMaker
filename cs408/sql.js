var mysql = require("mysql");
var con = mysql.createConnection({
  //TODO put in a properties file
  host: "localhost",
  user: "root",
  password: "cz002"
});
con.connect(function(err){
  if(err){
    console.log("Error Connection to mysql database");
    return;
  }
  console.log('Connection established');
})
/*this function will create an account in sql and return 0 if the account was created successfully, else it will return -1 if username exist or -2 if sql error happens
json will be {UserName: "Not Null",Password "Not Null(I will salt this)",Picture: "Null",Birthday : "00/00/0000",Gender: "M","F,"MF",GenderInto: "M","F","MF",Location: "Not Null",InARelationship:"false"}
*/
function createAccount(json){
  //TODO salt passwords
  con.query('Insert Into User Set ?',json,function(err,res){
    if(err){
      var userName = {UserName : json.UserName};
      Console.Log(err);
      con.querry('Select * from User where ?',userName,function(err,res){
        //err happen twice must be sql error happening
        if(err){
          Console.Log(err);
          return -2;
        }
        //no username the same must be someother error
        else if(rows.length == 0){
          return -2;
        }
        //userName already exists
        else if(rows.length > 0){
          return -1;
        }
      });
    }
  });
  return login({UserName:json.UserName,Password:json.Password});
}
/*this function with allow user to edit passwords return 0 if works, returs -1 if old password is wrong or -2 sql error
give {UserName: name,oldPassword:"password",newPassword:"password"}
*/

function editPassword(json){
  //TODO salt password to check
  var check = {UserName:json.UserName,Password:json.oldPassword}
  var x = login(check);
  if(x < 0){
    return x;
  }
  con.query('Update User Set password = ? where UserID = ?',[json.newPassword,x],function(err,res){
    if(err){
      return -2;
    }
  });
  return 0;
}
//Give it {UserName: Not Null,Password: Not Null}
//returns ID or -1 if invalid password or username or -2 if sql error
function login(json){
  //TODO deal with salting
  con.query('Select * from User where ?',json,function(err,res){
    if(err){
      return -2;
    } 
    else if(res.length == 0){
      return -1;
    }
    else{
      return res[0].UserID;
    }
  });
}
//Give it {UserID:num,Name: "Pref_Name"}
//Adds user Preference to UserID 
//if preference does not exist it will add it to the list
//getPreferences will return list of preferences.
function addUserPref(json){
  //get id of pref
  var id = getPrefID(Name);
  //if error in id
  if(id == -1){
    id = addPref({Name:json.Name,Description:null});
  }
  else if(id == -2){
    return -2;
  }
  //TODO deal with adding id
  con.query('Insert Into User_Interests Set ?',{UserID:json.UserID,InterestID:id},function(err,res){
    if(err){
      return -1;
    }
  });
  return 0;
}
//Add a preference with {Name:"Not Null",Description:"Null"}
//returns id if no error or -1 if error
function addPref(json){
  con.query('Insert into Interests Set ?',json,function(err,res){
    if(err){
      return -2;
    } 
  });
  return getPrefID;
}
//takes Name of pref and returns Id of pref, if -1 does not exist, if -2 sql error 
function getPrefID(Name){
  con.query('Select * from Interests where ?',{Name:Name},function(err,res){
    if(err){
      return -2;
    }
    if(ret.length == 0){
      return -1;
    }
    return ret[0].InterestID;
});
}
//Will return a list of preferences {Name:"String",Description:"Null"}
//if error returns [{Name:"Error"}]
function getPrefs(){
  con.query('Select * from Interests',null,function(err,res){
    if(err){
      return [{Name:"Error",Description:err}]
    }
    return res;
  }); 
}
//TODO add disconect
