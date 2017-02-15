//TODO change functions to deal with res.
var con;
var createCon = function () {
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
var createAccount = function (json, res) {
    //return con;
    //TODO salt passwords
    con.query('Insert Into User Set ?', json, function (err, rows) {
        if (err) {
            var userName = { UserName: json.UserName };
            con.query('Select * from User where ?', userName, function (err, rows) {
                //err happen twice must be sql error happening
                if (err) {
                    if (res == null) {
                        console.error(err);
                        con.end(function (err) {
                            //if error don't kill
                        });
                        return;
                    }
                    else {
                        //TODO put send to res
                        return -2;
                    }
                }
                else if (rows.length == 0) {
                    if (res == null) {
                        console.error(err);
                        con.end(function (err) {
                            //if error don't kill
                        });
                        return;
                    }
                    else {
                        //TODO
                        return -2;
                    }
                }
                else if (rows.length > 0) {
                    if (res == null) {
                        console.log("UserName already exist");
                        con.end(function (err) {
                            //if error don't kill
                        });
                        return;
                    }
                    else {
                        //TODO
                        return -1;
                    }
                }
                if (res == null) {
                    con.end(function (err) {
                        //if error don't kill
                    });
                    return;
                }
            });
        }
        if (res == null) {
            con.end(function (err) {
                //if error don't kill
            });
            return;
        }
    });
    return 0;
};
/*this function with allow user to edit passwords return 0 if works, returs -1 if old password is wrong or -2 sql error
give {UserName: name,oldPassword:"password",newPassword:"password"}
*/
//never close for test as we will call login right after to make sure change happens
var editPassword = function (json, res) {
    //TODO salt password to check
    var check = { UserName: json.UserName, Password: json.oldPassword };
    var x = login(check, con, res, false);
    if (x < 0) {
        if (res == null) {
            return;
        }
        else {
            //TODO 
            return x;
        }
    }
    con.query('Update User Set password = ? where UserID = ?', [json.newPassword, x], function (err, row) {
        if (err) {
            if (res == null) {
                console.log(err);
                return;
            }
            else {
                //TODO
                return -2;
            }
        }
        if (res == null) {
            return;
        }
        else {
        }
    });
    return 0;
};
//Give it {UserName: Not Null,Password: Not Null}
//returns ID or -1 if invalid password or username or -2 if sql error
var login = function (json, res, close) {
    //TODO deal with salting
    //console.log(json);
    con.query('Select * from User where ?', json, function (err, rows) {
        if (err) {
            if (res == null) {
                if (close) {
                    con.end(function (err) {
                        //if error don't kill
                    });
                }
                console.error(err);
                return;
            }
            else {
                //TODO
                return -2;
            }
        }
        else if (rows.length == 0) {
            if (res == null) {
                console.log("User name or password is incorrect");
                if (close) {
                    con.end(function (err) {
                        //if error don't kill
                    });
                }
                return;
            }
            else {
                //TODO 
                return -1;
            }
        }
        else {
            if (res == null) {
                console.log("userID = " + rows[0].UserID);
                if (close) {
                    con.end(function (err) {
                        //if error don't kill
                    });
                }
                return;
            }
            else {
                return rows[0].UserID;
            }
        }
    });
    return 0;
};
//Give it {UserID:num,Name: "Pref_Name"}
//Adds user Preference to UserID 
//if preference does not exist it will add it to the list
//getPreferences will return list of preferences.
var addUserPref = function (json) {
    //get id of pref
    var id = getPrefID(Name);
    //if error in id
    if (id == -1) {
        id = addPref({ Name: json.Name, Description: null });
    }
    else if (id == -2) {
        return -2;
    }
    //TODO deal with adding id
    con.query('Insert Into User_Interests Set ?', { UserID: json.UserID, InterestID: id }, function (err, res) {
        if (err) {
            return -1;
        }
    });
    return 0;
};
//Add a preference with {Name:"Not Null",Description:"Null"}
//returns id if no error or -1 if error
var addPref = function (json) {
    con.query('Insert into Interests Set ?', json, function (err, res) {
        if (err) {
            return -2;
        }
    });
    return getPrefID;
};
//takes Name of pref and returns Id of pref, if -1 does not exist, if -2 sql error 
var getPrefID = function (Name) {
    con.query('Select * from Interests where ?', { Name: Name }, function (err, res) {
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
var getPrefs = function () {
    con.query('Select * from Interests', null, function (err, res) {
        if (err) {
            return [{ Name: "Error", Description: err }];
        }
        return res;
    });
};
exports.createAccount = createAccount;
exports.createCon = createCon;
exports.login = login;
exports.editPassword = editPassword;
exports.con = con;
