var port=8888;
var http = require("http");
var url = require("url");

function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
	
    route(pathname);	
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888/');
    response.writeHead(200, {"Content-Type": "text/plain",});
	
	var data = '';
    request.on('data', function(chunk) {
        data += chunk.toString();
    });
    request.on('end', function() {
        console.log(data);        
        response.end();
    });
		 
    response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(port);
  console.log("Server has started.");
}

exports.start = start;