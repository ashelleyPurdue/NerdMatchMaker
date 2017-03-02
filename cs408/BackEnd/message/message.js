var http = require("http");
var HashTable = require('hashtable');

var url = require('url');
var fs = require('fs');
var io = require('socket.io');
//needs to contain {socket:,userID:} turn into a hash table with id being the key
var allClients = new HashTable();
var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;

    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            response.end();
            break;
        case '/socket.html':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(3000);
var socket = io.listen(server);

socket.on('connection', function(client) {
   var userID;
   client.on('disconnect', function() {
      console.log('Got disconnect!');
      if(userID != null){
        allClients.remove(userID);
      }
   });
   client.on("hello",function(data){
    console.log(data);
    console.log(data.UserID);
    userID = data.UserID;
    allClients.put(data.UserID,client); 
   });
   client.on("send",function(data){
    if(data.UserID != null){
      var socket2 = allClients.get(data.UserID); 
      console.log(data);
      if(socket2 != null){
        socket2.emit('message',{message:data.Message});
      }
    }
   });
});
