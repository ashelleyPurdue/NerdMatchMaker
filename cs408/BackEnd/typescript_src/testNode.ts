var request = require('request');

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

// Configure the request
var options = {
    url: 'http://localhost:3000/BackEnd/createUser/',
    method: 'POST',
    headers: headers,
    form: {'UserName': 'xxx', 'Password': 'yyy',Picture:null,Birthday:"02/07/1995",Gender: "M",GenderInto:"M",loc:null}
};

// Start the request
request(options, function (error, response, body){
  if(!error){
      console.log(body);
      if(body.UserID != null && body.UserID > 0){
        console.log("Success");
      }
      else{
        console.log("failure");
      }
  }
  else{
    console.log(error);
  }
});
