function Initialize(username)
{	
	var request = new XMLHttpRequest();
	var body = 'ConfirmConnection';
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
	console.log(request.response);
	if (request.response=="Confirmed")
	{
		document.body.innerHTML="<input type=\"button\" value=\"Maps\" onClick=\"RequestMaps('"+username+"')\"/>";		
	}
	else
	{
		document.body.innerHTML="Error during server connection.";
	}	
}

function RequestMaps(username)
{	
	var request = new XMLHttpRequest();
	var body = 'GiveMaps:'+username;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
	var maps=request.response.split('=');
	document.body.innerHTML = "";
	for (var i=1; i<maps.length; i++)
	{
		document.body.innerHTML += "<input type=\"button\" value=\""+maps[i]+"\" onClick=\"Sortie('"+username+"','"+maps[i]+"')\" style=\"position:absolute; top:"+(3*i)+"%\"/>";
	}
	
}

function Sortie(username,map)
{
	var request = new XMLHttpRequest();
	var body = 'Sortie:'+username+':'+map;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
	var data=request.response.split('\n');
	var rooms=data[2].split('=')
	document.body.innerHTML="You are in " + rooms[0]+"<br>";
	for (var i=1; i<rooms.length; i++)
	{	
		rooms[i]=rooms[i].replace('\r','');
		rooms[i]=rooms[i].replace('\n','');
		document.body.innerHTML += "<input type=\"button\" value=\"Go to "+rooms[i]+"\" onClick=\"GoToRoom('"+username+"','"+rooms[i]+"','"+map+"')\" style=\"position:absolute; top:"+(3*i)+"%\"/>";
	}	
}

function GoToRoom(username,room,map)
{
	var request = new XMLHttpRequest();
	var body = 'GoToRoom:'+username+':'+map+':'+room;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
	console.log(request.response);
	var data=request.response.split('\n');	
	var rooms=data[2].split('=');
	document.body.innerHTML="You are in " + rooms[0]+"<br>";
	for (var i=1; i<rooms.length; i++)
	{
		rooms[i]=rooms[i].replace('\r','');
		rooms[i]=rooms[i].replace('\n','');
		document.body.innerHTML += "<input type=\"button\" value=\"Go to "+rooms[i]+"\" onClick=\"GoToRoom('"+username+"','"+rooms[i]+"','"+map+"')\" style=\"position:absolute; top:"+(3*i)+"%\"/>";
	}
}