//Force this file to be a module
export interface UselessInterface {
}

//TODO change functions to deal with res.
export var con;
//IS the test called a sucess or not
export var success;
//will set the error to this and it can read it on the test side
export var error;

export function createCon() {
    //count = 0;
    var mysql = require("mysql");
    var config = require("../config");
    con = mysql.createConnection(config.sql);
    con.connect(function(err) {
        if (err) {
            console.log("Error Connection to mysql database");
            return -1;
        }
        //console.log('Connection established');
    })
    return con;
};

/*this function will create an account in sql and return 0 if the account was created successfully, else it will return -1 if username exist or -2 if sql error happens
json will be {UserName: "Not Null",Password "Not Null(I will salt this)",Picture: "Null",Birthday : "00/00/0000",Gender: "M","F,"MF",GenderInto: "M","F","MF",Location: "Not Null",InARelationship:"false"}
*/
//inside callback will deal with two functions on error and on success
export function createAccount(json, callback, res) {
    //TODO salt passwords
    con.query('Insert Into User Set ?', json, function(err, rows) {
        if (err) {
            callback.error(err, json, res, callback);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
}

//this function will deal with call back for if not error
export function createAccountCallback(rows, json, res, uselessParameter) {
    //have it login so that way it can get the userID and test to make sure everything works right
    //TODO fix login
    var callback = {success:loginTest,Empty:loginEmptySet,error:genSQLError};
    login(json, res,callback);
}

export function createAccountError(err, json, res, callback) {
    var userName = { UserName: json.UserName };
    con.query('Select * from User where ?', userName, function(err2, rows) {
        if (err2){
          console.log(err2);  
          res.send({ Error: -2 });
        } 
        else if(rows.length == 0){
          console.log(err);
          res.send({ Error: -2 });
        }else {
            res.send({ Error: -1,err:"User Name already taken" });
        }
    });
}

/*this function with allow user to edit passwords return 0 if works, returs -1 if old password is wrong or -2 sql error
give {UserName: name,oldPassword:"password",newPassword:"password"}
*/
/*need to call login first to check that password is correct if not user can just change password*/
export function editPassword(json,res,callback){
  con.query('Update User Set password = ? where UserID = ?',[json.newPassword,json.UserID],function(err,row){
    if(err){
      callback.error(err,json,res,callback,con);  
    }
    else{
      callback.success(row,json,res,callback);
    }
  });
  return 0;
}

export function genSuccess(rows,json,res,callback){
  console.log("genSuccess");
  res.send({success:0});
}

export var loginForEdPassSuc = function(rows,json,res,callback){
  //console.log("printing login json"+json);
  var call = {error:genSQLError,success:genSuccess};
  editPassword(json,res,call);
};

//Give it {UserName: Not Null,Password: Not Null}
//returns ID or -1 if invalid password or username or -2 if sql error
export var login = function(json, res, callback) {
    var q = con.query('Select * from User where UserName = ? AND Password = ?', [json.UserName,json.Password], function(err, rows) {
        //console.log(q);
        if (err) {
            callback.error(err, json, res, callback, con);
        } else if (rows.length == 0) {
            callback.Empty(res,callback);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
    return 0;
};

export var loginWithID = function(json, res, callback) {
    var q = con.query('Select * from User where UserID = ? AND Password = ?', [json.UserID,json.oldPassword], function(err, rows) {
        //console.log(q);
        if (err) {
            callback.error(err, json, res, callback, con);
        } else if (rows.length == 0) {
            callback.Empty(res,callback);
        } else {
          callback.success(rows, json, res, callback);
        }
    });
    return 0;
};

export var loginTest = function(rows, json, res, callback) {
    var lbj = {UserID: rows[0].UserID };
    console.log(rows);
    res.send(rows[0]);
};

export var loginEmptySet = function(res,callback) {
    res.send({ Error: -1 });
};

export var genSQLError = function(err, json, res, callback, con){
  console.log("genSQLError");
  res.send({Error:-2});
};

/* Beginning of addUserPref saga */

//Give it {UserID:num,Name: "Pref_Name"}
//Adds user Preference to UserID 
//if preference does not exist it will add it to the list
//getPreferences will return list of preferences.
//callback is an object that is used to communicate with the testing framework.
export var addUserPref = function(json, callback, res){
	getPrefID(json.Name, function(id:number){
		
		//If we didn't find that ID, create it and use that as ID.
		if (id == -1){
			addPref({ Name: json.Name }, function(newid:number){
				addUserPref_weHaveID(newid, json, res, callback);
			});
			return;
		}
		//If there was an SQL error, then "return" that there was an SQL error.
		else if (id == -2){
			callback.error(null, null, res, callback);
			return;
		}
		
		//We did find the ID, so use it.
		addUserPref_weHaveID(id, json, res, callback);
	});
};

export var addUserPref_weHaveID = function(id, json, res, callback){
	//TODO: Deal with adding ID
	//Error if id is -1
	if (json.UserID < 1){
		callback.error("userid is " + json.UserID, null, res, callback, null);
		return;
	}
	if (id < 1){
		callback.error("interest id is " + id, null, res, callback, null);
		return;
	}
	console.log(id);
	//Do the insert
	con.query('Insert Into User_Interests Set ?', { UserID: json.UserID, InterestID: id }, function(err){
		
		
		//If there's an error, return -1
		if (err){
			callback.error(err, null, res, callback, null);
			return;
		}
		
		//No errors, so "return" 0.
		callback.success(null, null, res, callback);
		return;
	});
}

//Add a preference with {Name:"Not Null",Description:"Null"}
//returns id if no error or -1 if error
//The "return value" is actualy going to be the first argument of calback.
export var addPref = function(name_and_desc, returnFunc) {
	con.query('Insert into Interests Set ?', name_and_desc, function(err, rows){
		
		//Check for errors
		if (err){
			returnFunc(-2);
			return;
		}
		
		//"Return" the prefID that we just added.
		//It will call callback for us.
		getPrefID(name_and_desc.Name, returnFunc);
		return;
	});
};

//takes Name of pref and returns Id of pref, if -1 does not exist, if -2 sql error
//The "return value" is actually going to be the first argument of callback.
export var getPrefID = function(Name, returnFunc) {
	//Query for the id
	con.query('Select * from Interests where Name = ?', [Name], function(err, rows){
		//Check for errors
		if (err){
			returnFunc(-2);
			return;
		}
		if (rows.length == 0){
			returnFunc(-1);
			return;
		}
		
		//"Return" the interest ID to the callback.
		returnFunc(rows[0].InterestID);
		return;
	});
	
};

/* End of addUserPref saga */

/* Beginning of getUserPref saga */
//Give it {UserID:num} in json
export var getUserPref = function(json, callback, res){
	//Gets a list of all prefs for the given user
	
	//Check if UserID is invalid
	if (json == null)
	{
		console.log("json is null");
		callback.error(-1, json, res, callback, con);
		return;
	}
	
	if (json.UserID == null){
		console.log("UserID is null");
		callback.error(-1, json, res, callback, con);
		return;
	}
	
	if (json.UserID <= 0){
		console.log("UserID " + json.UserID + " <= 0");
		callback.error(-1, json, res, callback, con);
		return;
	}

	if (isNaN(json.UserID)){
		console.log("UserID " + json.UserID + " is not a number.");
		callback.error(-1, json, res, callback, con);
		return;
	}
	
	//Do the query
	con.query('Select * from User_Interests Where UserID = ?', json.UserID, function(err, rows) {
        if (err) {
            callback.error(err, json, res, callback, con);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
};

/* End of getUserPref saga */

//Will return a list of preferences {Name:"String",Description:"Null"}
//if error returns [{Name:"Error"}]
export var getPrefs = function(json, callback, res) {
    con.query('Select * from Interests', null, function(err, rows) {
        if (err) {
            callback.error(err, json, res, callback, con);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
};

export var getPrefsSuccess = function(rows, json, res, callback) {
  res.send(rows);
};

//give it json of {UserID_1:,UserID_2,Message}
//returns {Error:}
export var insertMessage = function(json,callback,res){
	//add check method to check if they are a match or not
	con.query("UPDATE Matches Set IsBlocked=true,BlockingID=? where (UserID1 = ? AND UserID2 = ?) OR (UserID2 = ? AND UserID1 = ?)",
		[json.UserID1,json.UserID1,json.UserID2,json.UserID1,json.UserID2],function(err,rows){
		if(err){
			
		}
		else if(rows.length == 0){
			
		}
		else{
			con.query(`Insert Into Messages (UserID1,UserID2,Message)
				Values(?,?,?)`,[json.UserID1,json.UserID2,json.Message],function(err,rows){
				if (err) {
            		callback.error(err, json, res, callback, con);
        		} else {
            		callback.success(rows, json, res, callback);
        		}
			});
		}
	});

};

//TODO test this function over command line
export var getMessages = function(json,callback,res){
	con.query(`Select * from Message where (UserID1 = ? AND UserID2 = ?) OR (UserID1 = ? AND UserID2 = ? sort by MessageID`,[json.UserID1,json.UserID2,json.UserID2,json.UserID1],function(err,rows){
    	if (err) {
            callback.error(err, json, res, callback, con);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
};

//give it json of {UserID1:,UserID2}
//returns {Error:}
export var blockUser = function(json,callback,res){
    con.query("UPDATE Matches Set IsBlocked=true,BlockingID=? where (UserID1 = ? AND UserID2 = ?) OR (UserID2 = ? AND UserID1 = ?)",
		[json.UserID1,json.UserID1,json.UserID2,json.UserID1,json.UserID2],function(err,rows){
    	if (err) {
            callback.error(err, json, res, callback, con);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
};

//give it json of {UserID}
//returns list of users and userIDs of matches
export var getMatches = function(json,callback,res){
        con.query("Select * from Matches where (UserID1 = ? OR UserID2 = ?) AND IsBlocked = false", 
				  	[json.UserID1],function (err, rows) {
        if (err) {
            callback.error(err, json, res, callback, con);
        }
        else {
            callback.success(rows, json, res, callback);
        }
    });
};

/*
exports.insertMessage = insertMessage;
exports.getMessages = getMessages;
exports.createAccount = createAccount;
//exports.createCon = createCon;
exports.login = login;
exports.editPassword = editPassword;
exports.con = con;
exports.success = success;
exports.error = error;
exports.createAccountCallback = createAccountCallback;
exports.createAccountError = createAccountError;
exports.loginTest = loginTest;
exports.loginEmptySet = loginEmptySet;
exports.genSQLError = genSQLError;
exports.getPrefs = getPrefs;
exports.loginForEdPassSuc = loginForEdPassSuc;
exports.addUserPref = addUserPref;
exports.getUserPref = getUserPref;
exports.getPrefsSuccess = getPrefsSuccess;
exports.loginWithID = loginWithID;
exports.genSuccess = genSuccess;
*/
