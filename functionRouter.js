function route(response, info) {	
	switch (info[0])
	{
		case "ConfirmConnection":
		ConfirmConnection(response);
		break;
		case "GiveMaps":
		GiveMaps(response, info);
		break;
		case "Sortie":
		Sortie(response, info);
		break;
		case "GoToRoom":
		GoToRoom(response, info);
		break;
		case "GiveEnemy":
		GiveEnemy(response, info);
		break;
		case "GiveHero":
		GiveHero(response, info);
		break;
		case "TakeAction":
		TakeAction(response, info)
		break;
		case "LeaveDungeon":
		LeaveDungeon(response, info);
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
			response.write(lines[i].split('=')[1]+'=');
			var heroes=fs.readFileSync('playerChars.txt', 'utf8').split('\n');
			for (var j=0; j<heroes.length; j++)
			{
				
				if (heroes[j].split('=')[0]==info[1])
				{
					
					for (var k=1; k<heroes[j].split('=').length; k+=3)
					{						
						console.log(heroes[j].split('=')[k]);
						if (heroes[j].split('=')[k]==lines[i].split('=')[1]) 
						{
							response.write(heroes[j].split('=')[k+1]+'\n');
							break;
						}
					}
				}
			}
			//response.write(lines[i]+'\n');
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

function TakeAction(response,info)
{
	var fs = require('fs');
	var hero=JSON.parse(info[2]);
	var enemy=JSON.parse(info[3]);
	var data = fs.readFileSync('skills.txt', 'utf8');	
	var lines=data.split('\n');
	response.write('hero=');
	for (var i=0; i<lines.length; i++)
	{		
		var skill=lines[i].split('=');		
		if (skill[0]==info[1])
		{						
			var heroTemp=hero;
			var enemyTemp=enemy;
			for (var j=1; j<skill.length; j+=2)
			{
				skill[j]=skill[j].replace('\r','');
				skill[j]=skill[j].replace('\n','');				
				switch(skill[j])
				{
					case "att Up":					
					heroTemp.att*=skill[j+1];					
					break;
					case "agi Up":
					heroTemp.agi*=skill[j+1];
					break;
					case "agi Dw":
					enemyTemp.agi/=skill[j+1];
					break;
				}
			}
			Fight(response, heroTemp, enemyTemp);
			break;
		}
	}
		
	enemy.currentHp=enemyTemp.currentHp;
	response.write('=enemy=');
	if (enemy.currentHp<=0)
	{
		response.write('dead');
		return;
	}
	var chosenSkill=enemy.skill[Math.round(Math.random() * (enemy.skill.length-1))];
	response.write(chosenSkill+'=');	
	for (var i=0; i<lines.length; i++)
	{
		var skill=lines[i].split('=');		
		if (skill[0]==chosenSkill)
		{						
			var heroTemp=hero;
			var enemyTemp=enemy;
			for (var j=1; j<skill.length; j+=2)
			{
				switch(skill[j])
				{
					case "att Up":
					enemyTemp.att*=skill[j+1];
					break;
					case "agi Up":
					enemyTemp.agi*=skill[j+1];
					break;
					case "agi Dw":
					heroTemp.agi/=skill[j+1];
					break;
				}
			}
			Fight(response, enemyTemp, heroTemp);
		}
	}
	hero.currentHp=heroTemp.currentHp;
	//response.write('\n'+JSON.stringify(hero)+'\n'+JSON.stringify(enemy));
}

function Fight(response, attacker, defender)
{
	var hitted;	
	if (attacker.agi!=defender.agi)
	{
		var evade=Math.random()*(10*(defender.agi/attacker.agi));
		var hit=Math.random() * 100;
		
		if (hit>=evade)
		{
			hitted=true;
		}
		else
		{
			hitted=false;
		}	
	}
	if (attacker.agi==defender.agi)
	{
		if (Math.random()==1)
		{
			hitted=true;
		}
		else
		{
			hitted=false;
		}
	}	
	if (hitted)
	{
		var damage=Math.round(attacker.att)-Math.round(defender.def);
		if (damage<=0) damage=1;
		defender.currentHp-=damage;
		response.write('hit='+damage);
	}
	else
	{
		response.write('miss=0');
	}
}

function LeaveDungeon(response, info)
{
	var fs = require('fs');
	var lines = fs.readFileSync('maps/values.txt', 'utf8');
	var data=lines.split('\n');
	if (info[1]=="Flee") return;
	var earnedScore;
	for (var i=0; i<data.length; i++)
	{
		if (data[i].split('=')[0]==info[2])
		{
			earnedScore=data[i].split('=')[1];
			break;
		}
	}	
	UpdateScores(info[3],earnedScore);
	
	var newChars=fs.readFileSync('CurrentCharacters.txt', 'utf8');
	newChars=newChars.split('\n');
	var chosen;
	for (var i=0; i<newChars.length; i++)
	{
		if (newChars[i].split('=')[0]==info[3]) chosen=newChars[i].split('=')[1];
	}
	lines = fs.readFileSync('playerChars.txt', 'utf8');
	var playerData=lines.split('\n');
	var nD='';
	for (var i=0; i<playerData.length; i++)
	{
		if (playerData[i].split('=')[0]==info[3])
		{
			nD+=info[3]+'=';
			var characters=playerData[i].split('=');
			for (var j=1; j<characters.length; j+=3)
			{
				if (characters[j]==chosen)
				{
					characters[j+2]=Number(characters[j+2])+Number(info[4]);
					while (characters[j+2]>(80+20*Number(characters[j+1])))
					{
						characters[j+2]=Number(characters[j+2])-(80+20*Number(characters[j+1]));
						characters[j+1]=Number(characters[j+1])+1;
					}
				}
				nD+=characters[j]+'='+characters[j+1]+'='+characters[j+2];
				if (j!=characters.length-3) nD+='=';
				else nD+='\n';
			}
			
		}
		else {nD+=playerData[i]; if (i!=playerData.length-1) nD+='\n';}		
		
	}
	console.log(nD);
	fs.writeFile('playerChars.txt',nD);
}

function UpdateScores(username,earnedScore)
{
	var fs = require('fs');
	var lines = fs.readFileSync('ranking.txt', 'utf8');	
	data=lines.split('=');	
	var nData='';
	for (var i=0; i<data.length; i+=2)
	{		
		if (data[i]==username)
		{
			data[i+1]=data[i+1].replace('\r','');
			data[i+1]=data[i+1].replace('\n','');			
			
			data[i+1]=Number(data[i+1])+Number(earnedScore);						
		}
		nData+=data[i]+'='+data[i+1];
		if (i!=data.length-2) nData+='=';
	}	
	fs.writeFile('ranking.txt',nData);
}