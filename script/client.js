function Initialize()
{	
	var request = new XMLHttpRequest();
	var body = 'initialize:1:1';
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
	console.log(request.response);	
	document.body.innerHTML = "<strong>Initialize</strong>: success.";
}