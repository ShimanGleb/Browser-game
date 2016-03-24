function route(response, info) {	
	switch (info[0])
	{
		case "ConfirmConnection":
		ConfirmConnection(response);
		break;
		case "GiveMaps":
		GiveMaps(response, info)
		break;
		case "Sortie":
		Sortie(response, info)
		break;
		case "GoToRoom":
		GoToRoom(response, info)
		break;
	}	
	
}

exports.route = route;

function ConfirmConnection(response)
{
	response.write("Confirmed");
}

function GiveMaps(response, info){
	var fs = require('fs');
	var data = fs.readFileSync('maps.txt', 'utf8');	
	var lines=data.split('\n');
	for (var i=0; i<lines.length; i++)
	{
		if (lines[i].split('=')[0]==info[1])
		{			
			response.write(lines[i]);
			return;
		}
	}
}

function Sortie(response, info)
{
	var fs = require('fs');
	var data = fs.readFileSync('currentCharacters.txt', 'utf8');	
	var lines=data.split('\n');
	for (var i=0; i<lines.length; i++)
	{
		if (lines[i].split('=')[0]==info[1])
		{			
			response.write(lines[i]+'\n');
			break;
		}
	}
	
	data = fs.readFileSync('maps/'+info[2]+'.txt', 'utf8');	
	var lines=data.split('\n');
	response.write(lines[0]+'\n');
	response.write(lines[3]+'\n');
}

function GoToRoom(response,info)
{
	var fs = require('fs');		
	var data = fs.readFileSync('maps/'+info[2]+'.txt', 'utf8');	
	var lines=data.split('\n');
	var fight=false;	
	lines[1]=lines[1].replace('\r','');
	lines[1]=lines[1].replace('\n','');
	if (info[3].split('=')[0]==lines[1])
	{
		for (var i=0; i<lines[2].split('=').length; i+=2)
		{
			if (lines[2].split('=')[i]==lines[1])
			{
				response.write("fight="+lines[2].split('=')[i+1]+'\n');
				response.write("leave"+'\n');
				fight=true;
				break;
			}
		}		
	}
	for (var i=3; i<lines.length; i++)
	{
		if (lines[i].split('=')[0]==info[3])
		{
			if (!fight)
			{
				response.write("free"+'\n');
				response.write("continue"+'\n');
			}
			response.write(lines[i]);
			return;
		}
	}	
}