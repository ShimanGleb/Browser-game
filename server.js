var port=8888;
var http = require("http");
var url = require("url");

function start(route) {
  function onRequest(request, response) {
    /*var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");*/
	
    
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:2222');
    response.writeHead(200, {"Content-Type": "text/plain",});
	
	var data = '';
    request.on('data', function(chunk) {
        data += chunk.toString();
		
    });
    request.on('end', function() {
        console.log(data);
		var info=data.split(':');
		
		route(response,info);
        response.end();
    });		  
    
  }

  http.createServer(onRequest).listen(port);
  console.log("Server has started.");
}

exports.start = start;