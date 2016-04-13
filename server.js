var port=8888;
var http = require("http");
var url = require("url");
var GETRouter = require("./GETRouter");
function start(route) {
  function onRequest(request, response) {    
    
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:2222');
    response.writeHead(200, {"Content-Type": "text/plain",});
	
	var data='';
	switch (request.method)
	{
		case "GET":
		{
			var path = url.parse(request.url).pathname;
			var data=url.parse(request.url).query.split('&');
			var info = new Array();
			for (var i=0; i<data.length; i++)
			{
				info[i]=data[i].split('=')[1];	
			
			}
			GETRouter.route(response,info);
			response.end();
		}
		break;
		case "POST":
		{
		request.on('data', function(chunk) {
			data += chunk.toString();
		
		});
		request.on('end', function() {
			console.log(data);
			var info=data.split('=');
		
			route(response,info);
			response.end();
		});		  
		}
		break;
		case "PUT":
		{
			response.end();	
		}
		break;
		case "DELETE":
		{
			response.end();	
		}
		break;
		case "OPTIONS":
		{
			response.end();		
		}
		break;
		case "HEAD":
		{			
			response.end('Confirmed');
		}
		break;
	}
  }

  http.createServer(onRequest).listen(port);
  console.log("Server has started.");
}

exports.start = start;
