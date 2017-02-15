//TODO change functions to deal with res.
var con;
//IS the test called a sucess or not
var success;
//will set the error to this and it can read it on the test side
var error;
var createCon = function () {
    count = 0;
    var mysql = require("mysql");
    var config = require("../config");
    con = mysql.createConnection(config.sql);
    con.connect(function (err) {
        if (err) {
            console.log("Error Connection to mysql database");
            return -1;
        }
        //console.log('Connection established');
    });
    return con;
};
/*this function will create an account in sql and return 0 if the account was created successfully, else it will return -1 if username exist or -2 if sql error happens
json will be {UserName: "Not Null",Password "Not Null(I will salt this)",Picture: "Null",Birthday : "00/00/0000",Gender: "M","F,"MF",GenderInto: "M","F","MF",Location: "Not Null",InARelationship:"false"}
*/
//inside callback will deal with two functions on error and on success
var createAccount = function (json, callback, res) {
    //TODO salt passwords
    con.query('Insert Into User Set ?', json, function (err, rows) {
        if (err) {
            callback.error(err, json, res, callback, con);
        }
        else {
            callback.success(rows, json, res, callback);
        }
    });
};
//this function will deal with call back for if not error
var createAccountCallback = function (con, rows, json, res, callback) {
    //have it login so that way it can get the userID and test to make sure everything works right
    //TODO fix login
    var callback = { success: loginTest, Empty: loginEmptySet, error: genSQLError };
    login(json, res, callback);
};
var createAccountError = function (err, json, res, callback) {
    var userName = { UserName: json.UserName };
    con.query('Select * from User where ?', userName, function (err2, rows) {
        if (err2) {
            console.log(err2);
            res.send({ Error: -2 });
        }
        else if (rows.length == 0) {
            console.log(err);
            res.send({ Error: -2 });
        }
        else {
            res.send({ Error: -1, err: "User Name already taken" });
        }
    });
};
/*this function with allow user to edit passwords return 0 if works, returs -1 if old password is wrong or -2 sql error
give {UserName: name,oldPassword:"password",newPassword:"password"}
*/
/*need to call login first to check that password is correct if not user can just change password*/
var editPassword = function (json, res, callback) {
    con.query('Update User Set password = ? where UserID = ?', [json.newPassword, json.UserId], function (err, row) {
        if (err) {
            callback.error(err, json, res, callback, con);
        }
        else {
            callback.success(row, json, res, callback);
        }
    });
    return 0;
};
var genSuccess = function (rows, json, res, callback) {
    res.send(0);
};
var loginForEdPassSuc = function (rows, json, res, callback) {
    var call = { error: genSQLError, success: genSuccess };
    sqlFile.editPassword(json, null, call);
};
//Give it {UserName: Not Null,Password: Not Null}
//returns ID or -1 if invalid password or username or -2 if sql error
var login = function (json, res, callback) {
    var q = con.query('Select * from User where UserName = ? AND Password = ?', [json.UserName, json.Password], function (err, rows) {
        //console.log(q);
        if (err) {
            callback.error(err, json, res, callback, con);
        }
        else if (rows.length == 0) {
            callback.Empty(res, callback);
        }
        else {
            callback.success(rows, json, res, callback);
        }
    });
    return 0;
};
var loginTest = function (rows, json, res, callback) {
    res.send({ UserID: rows[0].UserID });
};
var loginEmptySet = function (res, callback) {
    res.send({ Error: -1 });
};
var genSQLError = function (err, json, callback, con) {
    res.send({ Error: -2 });
};
/* Beginning of addUserPref saga */
//Give it {UserID:num,Name: "Pref_Name"}
//Adds user Preference to UserID 
//if preference does not exist it will add it to the list
//getPreferences will return list of preferences.
//callback is an object that is used to communicate with the testing framework.
var addUserPref = function (json, res, callback) {
    getPrefID(json.Name, function (id) {
        //If we didn't find that ID, create it and use that as ID.
        if (id == -1) {
            addPref({ Name: json.Name, Description: null }, function (id) {
                addUserPref_weHaveID(id, res, callback);
            });
        }
        else if (id == -2) {
            callback.error(null, null, res, callback, null);
            return;
        }
        //We did find the ID, so use it.
        addUserPref_weHaveID(id, res, callback);
    });
};
function addUserPref_weHaveID(id, res, callback) {
    //TODO: Deal with adding ID
    con.query('Insert Into User_Interests Set ?', { UserID: userID_prefName_pair.UserID, InterestID: id }, function (err) {
        //If there's an error, return -1
        if (err) {
            callback.error(null, null, res, callback, null);
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
var addPref = function (name_and_desc, returnFunc) {
    con.query('Insert into Interests Set ?', name_and_desc, function (err, rows) {
        //Check for errors
        if (err) {
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
var getPrefID = function (Name, returnFunc) {
    //Query for the id
    con.query('Select * from Interests where ?', { Name: Name }, function (err, rows) {
        //Check for errors
        if (err) {
            returnFunc(-2);
            return;
        }
        if (rows.length == 0) {
            returnFunc(-1);
            return;
        }
        //"Return" the interest ID to the callback.
        returnFunc(rows[0].InterestID);
        return;
    });
};
/* End of addUserPref saga */
//Will return a list of preferences {Name:"String",Description:"Null"}
//if error returns [{Name:"Error"}]
var getPrefs = function (json, callback, res) {
    con.query('Select * from Interests', null, function (err, res) {
        if (err) {
            callback.error(err, json, res, callback, con);
        }
        else {
            callback.success(rows, json, res, callback);
        }
    });
};
var getPrefsSuccess = function (rows, json, res, callback) {
    res.send(rows);
};
exports.createAccount = createAccount;
exports.createCon = createCon;
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
