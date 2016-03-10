function Initialize()
{	
	var request = new XMLHttpRequest();
	var body = 'some request';
	request.open('POST', 'http://localhost:8888/', true);	
	//request.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8888/');
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
		
	document.body.innerHTML = "<strong>Initialize</strong>: success.";
}