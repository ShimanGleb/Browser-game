var hero;
var enemy;
var enemies;
var wasBattle=false;
var willLeave=false;
var actionRoom;
var defeated=false;

function Initialize(username)
{	
	var request = new XMLHttpRequest();
	var body = 'ConfirmConnection';	
	request.open('HEAD', 'http://localhost:8888/client.html?request=ConfirmConnection', false);
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
	if (request.statusText=="OK")
	{
		document.body.innerHTML="<input type=\"button\" value=\"Maps\" onClick=\"RequestMaps('"+username+"')\"/>";
		document.body.innerHTML+="<br><input type=\"button\" value=\"Select guardian\" onClick=\"RequestHeroes('"+username+"')\"/>";
		document.body.innerHTML+="<br><input type=\"button\" value=\"Top\" onClick=\"RequestTop('"+username+"')\"/>";
	}
	else
	{
		document.body.innerHTML="Error during server connection.";
	}	
}

function RequestHeroes(username)
{
	var request = new XMLHttpRequest();
	var body = 'RequestHeroes='+username;
	//request.open('POST', 'http://localhost:8888', false);	
	request.open('GET', 'http://localhost:8888/client.html?request=RequestHeroes&username='+username, false);
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);
	console.log(request.response);
	var res=request.response.split('\n');
	document.body.innerHTML='';
	for (var i=0; i<res.length; i++)
	{
		document.body.innerHTML+=res[i].split('=')[0] + '<br>Lv:'+ res[i].split('=')[1] + '<br>Exp:' + res[i].split('=')[2]+'<br>';
		document.body.innerHTML+="<input type=\"button\" value=\"Select\" onClick=\"ChangeCharacter('"+username+"','"+res[i].split('=')[0]+"')\"/><br><br>";
	}
	document.body.innerHTML+="<br><input type=\"button\" value=\"Back\" onClick=\"Initialize('"+username+"')\"/>";	
}

function ChangeCharacter(username,hero)
{
	var request = new XMLHttpRequest();
	var body = 'ChangeCharacter='+username+'='+hero;	
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
}

function RequestMaps(username)
{	
	var request = new XMLHttpRequest();
	var body = 'GiveMaps='+username;
	request.open('GET', 'http://localhost:8888/client.html?request=GiveMaps&username='+username, false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send();	
	var maps=request.response.split('=');
	document.body.innerHTML = "";
	for (var i=1; i<maps.length; i++)
	{
		document.body.innerHTML += "<input type=\"button\" value=\""+maps[i]+"\" onClick=\"Sortie('"+username+"','"+maps[i]+"')\" style=\"position:absolute; top:"+(3*i)+"%\"/>";
	}
	
}

function Sortie(username,map)
{
	defeated=false;
	var request = new XMLHttpRequest();
	var body = 'Sortie='+username+'='+map;
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
	console.log(request.response);
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
		willLeave=false;
		if (!defeated)
		{
			LeaveDungeon('Made through', map, username);
		}
		else
		{
			LeaveDungeon('Flee', map, username);
		}
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
	request.open('GET', 'http://localhost:8888/client.html?request=GiveEnemy&enemyname='+enemyName, false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send();	
	var res=JSON.parse(request.response);
	return res;
}

function GiveHero(heroName,heroLv)
{
	var request = new XMLHttpRequest();	
	request.open('GET', 'http://localhost:8888/client.html?request=GiveHero&heroname='+heroName+'&herolv='+heroLv, false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send();	
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
	document.body.innerHTML += "<br><canvas id='enemyPic'></canvas><br>";			
	
	document.body.innerHTML += enemy.name+":<br>hp:"+enemy.currentHp+'/'+enemy.hp+'<br><br><br>';
	for (var i=0; i<hero.skill.length; i++)
	{		
		document.body.innerHTML += "<input type=\"button\" value=\""+hero.skill[i]+"\" onClick=\"TakeAction('"+hero.skill[i]+"')\" style=\"position:absolute; left:"+(6*(i+1))+"%\"/>";
	}
	
	document.body.innerHTML += hero.name+":<br>";
	document.body.innerHTML += "<br><canvas id='heroPic'></canvas><br>";
	document.body.innerHTML += "<br>hp:"+hero.currentHp+'/'+hero.hp+"<br>";
	document.body.innerHTML += "tp:"+hero.currentTp+'/'+hero.tp+'<br><br><br>';
	
	var img = new Image(); 
	var ctx = document.getElementById('enemyPic').getContext('2d');	
	img.onload = function () {
    ctx.drawImage(img,0,0);
		if (img.src!='img/'+hero.name+'.png')
		{
			ctx = document.getElementById('heroPic').getContext('2d');	
			img.src = 'img/'+hero.name+'.png';
		}
    }
	img.src = 'img/'+enemy.name+'.png';
}

function TakeAction(skill)
{
	var request = new XMLHttpRequest();	
	var body = 'TakeAction='+skill+'='+JSON.stringify(hero)+'='+JSON.stringify(enemy);
	request.open('POST', 'http://localhost:8888', false);	
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send(body);	
	var result=request.response.split('=');		
	result[result.length-1]=result[result.length-1].replace('\n','');	
	document.body.innerHTML="";		
	result[1]=result[1].replace('\r','');
	result[1]=result[1].replace('\n','');	
	if (result[1]=="Not enough")
	{
		InitializeBattle(hero,enemy);
		document.body.innerHTML +='<br>Not enough TP!';
		var img = new Image(); 
		var ctx = document.getElementById('enemyPic').getContext('2d');	
		img.onload = function () {
		ctx.drawImage(img,0,0);
		if (img.src!='img/'+hero.name+'.png')
		{
			ctx = document.getElementById('heroPic').getContext('2d');	
			img.src = 'img/'+hero.name+'.png';
		}
    }
	img.src = 'img/'+enemy.name+'.png';
		return;
	}
	hero.currentTp-=result[1];	
	if (result[5]=='dead')
	{
		document.body.innerHTML += "Damaged " + enemy.name + " for " + result[3] + " hp!<br>";
		InitializeOver(true,hero,enemy);
		return;
	}	
	enemy.currentHp-=result[3];
	enemy.currentTp-=result[6]
	hero.currentHp-=result[8];
	if (hero.currentHp<=0)
	{
		if (result[2]=='miss')
		{
		document.body.innerHTML += "Missed with " + skill + " attack!<br>";
		}
		else
		{
		document.body.innerHTML += "Damaged " + enemy.name + " for " + result[3] + " hp!<br>";
		}
		document.body.innerHTML += enemy.name + " attacked with " + result[5] + " for " + result[8] + " hp!<br>";
		InitializeOver(false,hero,enemy);
		return;
	}	
	InitializeBattle(hero, enemy);
	if (result[2]=='miss')
	{
		document.body.innerHTML += "Missed with " + skill + " attack!<br>";
	}
	else
	{
		document.body.innerHTML += "Damaged " + enemy.name + " for " + result[3] + " hp!<br>";
	}
	if (result[7]=='miss')
	{
		document.body.innerHTML += enemy.name + " attacked with " + result[5] + " but missed!<br>";
	}
	else
	{
		document.body.innerHTML += enemy.name + " attacked with " + result[5] + " for " + result[8] + " hp!<br>";
	}
	var img = new Image(); 
	var ctx = document.getElementById('enemyPic').getContext('2d');	
	img.onload = function () {
    ctx.drawImage(img,0,0);
		if (img.src!='img/'+hero.name+'.png')
		{
			ctx = document.getElementById('heroPic').getContext('2d');	
			img.src = 'img/'+hero.name+'.png';
		}
    }
	img.src = 'img/'+enemy.name+'.png';
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
		defeated=true;
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

function RequestTop(username)
{
	var request = new XMLHttpRequest();	
	request.open('GET', 'http://localhost:8888/client.html?request=RequestTop&username='+username, false);		
	request.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	request.send();
	console.log(request.response);
	var players=request.response.split('\n');
	document.body.innerHTML = "<table border='1'><tr><th>Rank</th><th>Name</th><th>Score</th></tr><tr><td>1</td><td>"+players[0].split('=')[0]+"</td><td>"+players[0].split('=')[1]+"</td></tr><tr><td>2</td><td>"+players[0].split('=')[2]+"</td><td>"+players[0].split('=')[3]+"</td></tr><tr><td>3</td><td>"+players[0].split('=')[4]+"</td><td>"+players[0].split('=')[5]+"</td></tr><tr><td>"+players[1].split('=')[1]+"</td><td>"+username+"</td><td>"+players[1].split('=')[0]+"</td></tr>";	
	document.body.innerHTML += "</table>";
	document.body.innerHTML+="<br><input type=\"button\" value=\"Back\" onClick=\"Initialize('"+username+"')\"/>";
}
