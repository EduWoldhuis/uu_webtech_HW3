var http = require('http');
var fs = require('fs');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/database.db');



http.createServer(function (request, response) {
  request.on('error', function(err) {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', function(err){
    console.error(err);
  });
  if (request.method === "POST" && request.url === '/register'){
    request.pipe(response)
  }
  else if (request.method === "GET" && request.url === "/index") {
    fs.readFile("test.html", function(err, data){
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      return response.end();
    });
  }
  else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end("Not found");
  }
  //response.writeHead(200, {'Content-Type': 'text/html'});
  //response.end('Hello World!');
}).listen(8080, '127.0.0.1'); 
