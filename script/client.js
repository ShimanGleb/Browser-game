var hero;
var enemy;
var enemies;
var wasBattle=false;
var willLeave=false;
var actionRoom;

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
	var body = 'GiveMaps='+username;
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
	var body = 'Sortie='+username+'='+map;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
	var data=request.response.split('\n');
	var heroName=data[0].split('=')[0];
	var heroLv=data[0].split('=')[1];
	console.log(request.response);
	enemies=data[1].split('=');
	enemies[enemies.length-1]=enemies[enemies.length-1].replace('\r','');
	enemies[enemies.length-1]=enemies[enemies.length-1].replace('\n','');
	heroLv=heroLv.replace('\r','');
	heroLv=heroLv.replace('\n','');
	
	hero=GiveHero(heroName,heroLv);		
	hero.currentHp=hero.hp;
	hero.currentTp=hero.tp;
	console.log(request.response);
	var rooms=data[2].split('=');
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
	var body = 'GoToRoom='+username+'='+map+'='+room;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
	console.log(request.response);	
	var data=request.response.split('\n');
	data[1]=data[1].replace('\r','');
	data[1]=data[1].replace('\n','');
	if (data[1]=='leave')
	{
		willLeave=true;
	}
	var rooms=data[2].split('=');
	actionRoom=rooms[0];
	if (!wasBattle)
	{
		if (data[0].split('=')[0]=='fight')
		{
			actionRoom=username+"','"+rooms[0]+"','"+map;		
			wasBattle=true;
			var enemyName=data[0].split('=')[1];
			enemyName=enemyName.replace('\r','');
			enemyName=enemyName.replace('\n','');
		
			enemy=GiveEnemy(enemyName);
			enemy.currentHp=enemy.hp;
			enemy.currentTp=enemy.tp;
		
			InitializeBattle(hero,enemy);
			return;
		}
		if ((Math.random()*100)<(30+(enemies.length*5)))
		{
			actionRoom=username+"','"+rooms[0]+"','"+map;		
			wasBattle=true;
			var enemyName=enemies[Math.round((Math.random()*(enemies.length-1)))];						
			enemy=GiveEnemy(enemyName);
			enemy.currentHp=enemy.hp;
			enemy.currentTp=enemy.tp;
		
			InitializeBattle(hero,enemy);
			return;
		}
	}
	wasBattle=false;
	if (willLeave)
	{
		LeaveDungeon('Made through', map, username);
		return;
	}
	document.body.innerHTML="You are in " + rooms[0]+"<br>";
	for (var i=1; i<rooms.length; i++)
	{
		rooms[i]=rooms[i].replace('\r','');
		rooms[i]=rooms[i].replace('\n','');
		
		document.body.innerHTML += "<input type=\"button\" value=\"Go to "+rooms[i]+"\" onClick=\"GoToRoom('"+username+"','"+rooms[i]+"','"+map+"')\" style=\"position:absolute; top:"+(3*i)+"%\"/>";
	}
}

function GiveEnemy(enemyName)
{
	var request = new XMLHttpRequest();	
	var body = 'GiveEnemy='+enemyName;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
	var res=JSON.parse(request.response);
	return res;
}

function GiveHero(heroName,heroLv)
{
	var request = new XMLHttpRequest();	
	var body = 'GiveHero='+heroName+'='+heroLv;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
	var res=JSON.parse(request.response.split('\n')[0]);
	var statUp=JSON.parse(request.response.split('\n')[1]);
	res.hp+=statUp.hp*heroLv;
	res.tp+=statUp.tp*heroLv;
	res.att+=statUp.att*heroLv;
	res.def+=statUp.def*heroLv;
	res.agi+=statUp.agi*heroLv;	
	return res;
}

function InitializeBattle(hero, enemy)
{
	document.body.innerHTML = "Eerie "+enemy.name+" in front of you!<br>";		
	document.body.innerHTML += enemy.name+":<br>hp:"+enemy.currentHp+'/'+enemy.hp+'<br><br><br>';
	for (var i=0; i<hero.skill.length; i++)
	{		
		document.body.innerHTML += "<input type=\"button\" value=\""+hero.skill[i]+"\" onClick=\"TakeAction('"+hero.skill[i]+"')\" style=\"position:absolute; left:"+(6*(i+1))+"%\"/>";
	}
	document.body.innerHTML += hero.name+":<br><br>hp:"+hero.currentHp+'/'+hero.hp+"<br>";
	document.body.innerHTML += "tp:"+hero.currentTp+'/'+hero.tp+'<br><br><br>';
	
}

function TakeAction(skill)
{
	var request = new XMLHttpRequest();	
	var body = 'TakeAction='+skill+'='+JSON.stringify(hero)+'='+JSON.stringify(enemy);
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
	console.log(request.response);		
	var result=request.response.split('=');		
	result[result.length-1]=result[result.length-1].replace('\n','');	
	document.body.innerHTML="";
	if (result[4]=='dead')
	{
		document.body.innerHTML += "Damaged " + enemy.name + " for " + result[2] + " hp!<br>";
		InitializeOver(true,hero,enemy);
		return;
	}	
	enemy.currentHp-=result[2];
	hero.currentHp-=result[6];
	if (hero.currentHp<=0)
	{
		if (result[1]=='miss')
		{
		document.body.innerHTML += "Missed with " + skill + " attack!<br>";
		}
		else
		{
		document.body.innerHTML += "Damaged " + enemy.name + " for " + result[2] + " hp!<br>";
		}
		document.body.innerHTML += enemy.name + " attacked with " + result[4] + " for " + result[6] + " hp!<br>";
		InitializeOver(false,hero,enemy);
		return;
	}	
	InitializeBattle(hero, enemy);
	if (result[1]=='miss')
	{
		document.body.innerHTML += "Missed with " + skill + " attack!<br>";
	}
	else
	{
		document.body.innerHTML += "Damaged " + enemy.name + " for " + result[2] + " hp!<br>";
	}
	if (result[5]=='miss')
	{
		document.body.innerHTML += enemy.name + " attacked with " + result[4] + " but missed!<br>";
	}
	else
	{
		document.body.innerHTML += enemy.name + " attacked with " + result[4] + " for " + result[6] + " hp!<br>";
	}
}

function InitializeOver(win, hero, enemy)
{
	if (win)
	{
		document.body.innerHTML += "You won!";		
		hero.exp+=enemy.exp;
	}
	else
	{
		document.body.innerHTML += "You lose!";
	}
	document.body.innerHTML += "<br><input type=\"button\" value=\"Continue\" onClick=\"GoToRoom('"+actionRoom+"')\"/>";
}

function LeaveDungeon(leave, map, username)
{	
	var request = new XMLHttpRequest();		
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	if (leave=="Made through")
	{
		document.body.innerHTML = "You did it!";
	}
	if (leave=="Flee")
	{
		document.body.innerHTML = "You fled from this place.";
	}
	var body = 'LeaveDungeon='+leave+'='+map+'='+username+'='+hero.exp;
	request.send(body);
	document.body.innerHTML += "<br><input type=\"button\" value=\"Continue\" onClick=\"Initialize('"+username+"')\"/>";
}