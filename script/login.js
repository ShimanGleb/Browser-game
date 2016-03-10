function login()
{
	var username=document.getElementById("username").value;
	var password=document.getElementById("password").value;
	
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:8888/login/' + username + '/' + password, true);	
	request.send(null);
}