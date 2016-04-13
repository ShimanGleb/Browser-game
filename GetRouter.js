function route(response, info) {
	eval(info[0])(response,info);	
}

exports.route = route;

function ConfirmConnection(response,info)
{
	response.write("Confirmed");
}

function RequestHeroes(response, info)
{
	var fs = require('fs');
	var data = fs.readFileSync('playerChars.txt', 'utf8').split('\n');	
	for (var i=0; i<data.length; i++)
	{
		if (data[i].split('=')[0]==info[1])
		{
			var plIn=data[i].split('=');
			for (var j=1; j<plIn.length-2; j+=3)
			{
				response.write(plIn[j]+'='+plIn[j+1]+'='+plIn[j+2]);
				if (j!=plIn.length-3) response.write('\n');
			}
			break;
		}
	}
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

function GiveEnemy(response, info)
{
	var fs = require('fs');		
	var data = fs.readFileSync('enemies.txt', 'utf8');	
	var lines=data.split('\n');
	for (var i=0; i<lines.length; i++)
	{	
		lines[i]=lines[i].replace('\r','');
		lines[i]=lines[i].replace('\n','');
		if (lines[i].split('=')[0]==info[1])
		{
			response.write(lines[i].split('=')[1]);
			return;
		}
	}
}

function GiveHero(response, info)
{
	var fs = require('fs');		
	var data = fs.readFileSync('heroes.txt', 'utf8');	
	var lines=data.split('\n');
	for (var i=0; i<lines.length; i+=2)
	{	
		lines[i]=lines[i].replace('\r','');
		lines[i]=lines[i].replace('\n','');
		if (lines[i].split('=')[0]==info[1])
		{
			response.write(lines[i].split('=')[1]+'\n');
			response.write(lines[i+1]);
			return;
		}
	}
}

function RequestTop(response, info)
{
	var fs = require('fs');
	var lines = fs.readFileSync('ranking.txt', 'utf8').split('=');
	userScores=new Array();
	users=new Array();
	for (var i=0; i<lines.length; i+=2)
	{
		users.push(lines[i]);
		userScores.push(lines[i+1]);
	}
	for (var k=0; k<users.length/2+1; k++)
	for (var i=0; i<userScores.length-1; i++)
	{		
		if (Number(userScores[i])<Number(userScores[i+1]))
		{
			var x=userScores[i];
			userScores[i]=userScores[i+1];
			userScores[i+1]=x;
			
			x=users[i];
			users[i]=users[i+1];
			users[i+1]=x;
		}
	}
	response.write(users[0]+'='+userScores[0]+'='+users[1]+'='+userScores[1]+'='+users[2]+'='+userScores[2]+'\n');
	response.write(userScores[users.indexOf(info[1])]+'='+(users.indexOf(info[1])+1));	
}
