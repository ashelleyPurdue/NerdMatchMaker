var http = require("http"); //In typescript, we can use "let" in place of "var".  This will make the variable use block-scoping instead of function scoping.
var message = "Hello world"; //In typescript, we can optionally give variables a type.  This will make the compiler perform typechecking for this variable.
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(message);
}).listen(8081);
// 
