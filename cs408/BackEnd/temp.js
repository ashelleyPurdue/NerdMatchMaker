//TODO change functions to deal with res.
var con;
//IS the test called a sucess or not
var success;
//will set the error to this and it can read it on the test side
var error;

var createCon = function() {
    count = 0;
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
var createAccount = function(json, callback, res) {
    //TODO salt passwords
    con.query('Insert Into User Set ?', json, function(err, rows) {
        if (err) {
            callback.error(err, json, res, callback, con);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
};
//this function will deal with call back for if not error
var createAccountCallback = function(con, rows, json, res, callback) {
    //have it login so that way it can get the userID and test to make sure everything works right
    login(json, res);
};
var createAccountError = function(err, json, res, callback) {
    var userName = { UserName: json.UserName };
    con.query('Select * from User where ?', userName, function(err2, rows) {
        if (err2 || row.length == 0) {
            res.send({ Error: -2 });
        } else {
            res.send({ Error: -1 });
        }
    });
}

/*this function with allow user to edit passwords return 0 if works, returs -1 if old password is wrong or -2 sql error
give {UserName: name,oldPassword:"password",newPassword:"password"}
*/
//never close for test as we will call login right after to make sure change happens
var editPassword = function(json, res) {
    //TODO salt password to check
    var check = { UserName: json.UserName, Password: json.oldPassword }
    var x = login(check, con, res, false);
    if (x < 0) {
        if (res == null) {
            return;
        } else {
            //TODO 
            return x;
        }
    }
    con.query('Update User Set password = ? where UserID = ?', [json.newPassword, x], function(err, row) {
        if (err) {
            if (res == null) {
                console.log(err);
                return;
            } else {
                //TODO
                return -2;
            }
        }
        if (res == null) {
            return;
        } else {
            //TODO
        }
    });
    return 0;
};
//Give it {UserName: Not Null,Password: Not Null}
//returns ID or -1 if invalid password or username or -2 if sql error
var login = function(json, res, callback) {
    con.query('Select * from User where ?', json, function(err, rows) {
        if (err) {
            callback.error(err, json, res, callback, con);
        } else if (rows.length == 0) {
            callback.Empty(res);
        } else {
            callback.sucess(rows, json, res, callback);
        }
    });
    return 0;
};
var loginTest = function(rows, json, res, callback) {
    res.send({ UserID: rows[0].UserID });
};
var loginEmptySet = function(res) {
    res.send({ Error: -1 });
};
var loginError = function(err, json, callback, con) {
    res.send({ Error: -2 });
};
//Give it {UserID:num,Name: "Pref_Name"}
//Adds user Preference to UserID 
//if preference does not exist it will add it to the list
//getPreferences will return list of preferences.
var addUserPref = function(json) {
    //get id of pref
    var id = getPrefID(Name);
    //if error in id
    if (id == -1) {
        id = addPref({ Name: json.Name, Description: null });
    } else if (id == -2) {
        return -2;
    }
    //TODO deal with adding id
    con.query('Insert Into User_Interests Set ?', { UserID: json.UserID, InterestID: id }, function(err, res) {
        if (err) {
            return -1;
        }
    });
    return 0;
};
//Add a preference with {Name:"Not Null",Description:"Null"}
//returns id if no error or -1 if error
var addPref = function(json) {
    con.query('Insert into Interests Set ?', json, function(err, res) {
        if (err) {
            return -2;
        }
    });
    return getPrefID;
};
//takes Name of pref and returns Id of pref, if -1 does not exist, if -2 sql error 
var getPrefID = function(Name) {
    con.query('Select * from Interests where ?', { Name: Name }, function(err, res) {
        if (err) {
            return -2;
        }
        if (ret.length == 0) {
            return -1;
        }
        return ret[0].InterestID;
    });
};
//Will return a list of preferences {Name:"String",Description:"Null"}
//if error returns [{Name:"Error"}]
var getPrefs = function(json, callback, res) {
    con.query('Select * from Interests', null, function(err, res) {
        if (err) {
            callback.error(err, json, res, callback, con);
        } else {
            callback.success(rows, json, res, callback);
        }
    });
};

exports.createAccount = createAccount;
exports.createCon = createCon;
exports.login = login;
exports.editPassword = editPassword;
exports.con = con;
exports.success = success;
exports.error = error;