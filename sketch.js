/*
for finals:
- add weather api(current by city id - churchill canada) from https://openweathermap.org/current
       > check day||night
       > sunny, cloudy, snow, rain change accordingly
- have the bear jump(animated with spacebar)
- ice plate shape and opacity
- water rise as the day goes on and the other way if night
- time element */
var hole = [];
var sea, backgroundImage, sun, moon, day, bear, n, ground,hole;
var sun_orbit_stops_xpos = [];
var sun_orbit_stops_ypos = [];
var moon_orbit_stops_xpos = [];
var moon_orbit_stops_ypos = [];
var x_gridpoint_12scale = [];
var y_gridpoint_12scale = [];
var bearposition_x = []; //top ->bottom left->right / bearposition of leftbottom corner
var bearposition_y = []; // 0top 1bottom
var s24;
var top_boundary;
var mid_start_x;
var move = false;
var sea_level=0;
var plate_boundary;
var x_trans, y_trans;
var position = 1;
var weatherData,current_weather;  //weather vars
var bear_pos_x,bear_pos_y;
var timer;
var sea_level_increment,sea_level_decrement;
var day_count=0;
var live;
var current_sec = 0;
var fish;
var eatig;

function preload(){
	// weather id = https://openweathermap.org/weather-conditions
	var url = 'http://api.openweathermap.org/data/2.5/weather?q=Churchill&APPID=65f68b9f954837334ed821398fef3b96';
	weatherData = loadJSON(url);
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	//set variables
	x_s24 = width / 24;
	y_s24 = height / 24;
	x_gridpoint_12scale = [0, width / 12, width * 2 / 12, width * 3 / 12, width * 4 / 12, width * 5 / 12, width * 6 / 12, width * 7 / 12, width * 8 / 12, width * 9 / 12, width * 10 / 12, width * 11 / 12, width];
	y_gridpoint_12scale = [0, height / 12, height * 2 / 12, height * 3 / 12, height * 4 / 12, height * 5 / 12, height * 6 / 12, height * 7 / 12, height * 8 / 12, height * 9 / 12, height * 10 / 12, height * 11 / 12, height];
	sun_orbit_stops_xpos = [0, x_gridpoint_12scale[5] - x_s24, x_gridpoint_12scale[9] - x_s24, width, x_gridpoint_12scale[5] - x_s24, x_gridpoint_12scale[9] - x_s24];
	sun_orbit_stops_ypos = [height * 3 / 8, height / 8, height / 8, height * 3 / 8, -400, -400];
	moon_orbit_stops_xpos = [width, x_gridpoint_12scale[5] - x_s24, x_gridpoint_12scale[9] - x_s24, 0, x_gridpoint_12scale[5] - x_s24, x_gridpoint_12scale[9] - x_s24];
	moon_orbit_stops_ypos = [height * 3 / 8, -400, -400, height * 3 / 8, height / 8, height / 8];
	current_weather = weatherData.weather[0].main;
	bear_pos_x = width/2;
	bear_pos_y = height/4*3	;

	//set initial setup
	sea = new Sea();
	background_image = new Background_image(current_weather);

	//parameters == starting location
	sun = new Sun(); //creates sun that rotates with 6 stops.
	moon = new Moon(); //opposite side of sun
	ground = new Ground();
	n=random(1,4);
	// for(var i =0;i<=n;i++){
	// 	hole[i] = new Hole();
	// }
	hole = new Hole();
	fish = new Fish();
	//build a bear
	bear = new Polarbear(bear_pos_x,bear_pos_y);
	//display initial
	day = true;
	ground.display();
	sea.display();
	background_image.display(day);

	fill(0);
	textAlign(CENTER);
  textSize(30);
	text("Use Left and Right arrow to move the bear!",width/2,y_gridpoint_12scale[8]);

	sun.display(sun_orbit_stops_xpos[0], sun_orbit_stops_ypos[0]);
	moon.display(moon_orbit_stops_xpos[0], moon_orbit_stops_ypos[0]);
	bear.draw(bear_pos_x,bear_pos_y);
	setTimer(); //sets a minute timer that toggles day/night
}


function draw() {
 ground.display();
 background_image.display(day);
 if(day){
	 sea.rise();
	//  ground.update_d();
	sea.display();
 }
 else if(!day){
	 sea.freeze();
	//  ground.update_i();
	sea.display();
 }
	//
// 	for(var i =0;i<hole.length;i++){
// 	hole[i].display();
// }
hole.display();
 sun.display(sun_orbit_stops_xpos[0], sun_orbit_stops_ypos[0]);
 moon.display(moon_orbit_stops_xpos[0], moon_orbit_stops_ypos[0]);


 fish.display();
 bear.draw(bear_pos_x,bear_pos_y);
 if(keyIsDown(LEFT_ARROW))
 bear_pos_x-=10;
 if(keyIsDown(RIGHT_ARROW))
 bear_pos_x+=10;
 if(keyIsDown(UP_ARROW))
 bear_pos_y-=10;
 if(keyIsDown(DOWN_ARROW))
 bear_pos_y+=10;
 bear.checkBound();



 //display day count
 textSize(32);
 fill(255);
 text("Day "+day_count,100,100);
 top_boundary=sea.level+height/4;

 eating = checkEating(bear_pos_x+40,bear_pos_y+150,fish.x,fish.y);
 console.log(mouseX+" / "+mouseY);
 console.log(bear_pos_x+" / "+bear_pos_y+" / "+fish.x+" / "+fish.y+"  / "+eating);
	if(eating)fish.remove();
 bear.updateHealth(eating);
 bear.showHealth();
 bear.checkDead(top_boundary,hole.x,hole.y,hole.radius,bear.health);
 checkGameEnd();
}
function checkEating(bx,by,fx,fy){
	if(bx>fx-40&&by<fy-40&&bx>fx+40&&by>fy+40){
		return true;
	}
	else{
		return false;
	}
}

function checkGameEnd(){
	if(!live){
		fill(0);
		rect(0,0,width,height);
		hole.display();
		bear.drawDying(bear_pos_x,bear_pos_y);
		textSize(30);
		fill(255);
		text("YOU FEEL ME?", width/2,height/4);
		text("You survived "+day_count+" days",width/2,height/4+100);
	}
}

function setTimer(){
	timer = setInterval(toggleDay,60000);
}
function toggleDay(){
	if(day) {
		fish = new Fish();
		day=false;
		day_count++;
		sun.move();
	}
	else if(!day)
	{
		 fish = new Fish();
		 day = true;
		 moon.move();
	 }
}
function Fish(){
	this.x = random(100,width-100);
	this.y = random(height/2,height-100);
	this.color=color(176,175,175);
	this.width=random(50,100);
	this.height = random(25,50);
	this.display = function(){
		fill(this.color);
		ellipseMode(CENTER);
		ellipse(this.x,this.y,this.width,this.height);
		triangle(this.x+this.width/2-this.x/50,this.y,this.x+this.width/2+this.width/4,this.y+this.height/2,this.x+this.width/2+this.width/4,this.y-this.height/2);
	}
	this.remove = function(){
		this.color = color(0);
		this.display();
	}
}
function Hole(){
	this.deep_color = color(8,10,116);
	this.light_color = color(44,76,144);
	this.radius = random(width/8,width/4);
	this.x = (random(this.radius,width-this.radius));
	this.y = (random(height/2,height-this.radius));
	this.display = function(){

		ellipseMode(CENTER);
		 for (var i = 1; i < this.radius; i++) {
			//this.color=this.deep_color;
			this.color = lerpColor(this.deep_color,this.light_color,i/this.radius);
			fill(this.color);
			noStroke();
			ellipse(this.x,this.y,this.radius,this.radius/4);
		}
	}
}




function Ground() {
	this.starting_y = height/2;
	this.display = function() {
		fill(255);
		//noStroke();
		rect(0, this.starting_y, width, height);
	}
	// this.update_i = function(){
	// 	this.starting_y -= sea_level_increment;
	// }
	// this.update_d = function(){
	//
	// }
}


function Sea() {
	var original_level = height/4;
	this.r = 0;
	this.g = 105;
	this.b = 145;
	this.color = color(this.r, this.g, this.b);
	this.level = original_level;
	this.checkColor = function() {
		var rgbs = this.r + this.g + this.b;
		return rgbs;
	}
	this.rise = function(){
		sea_level_increment=random(0.01,0.1);
		this.level +=sea_level_increment ;
	}
	this.freeze = function(){
		sea_level_decrement = random(0.01,0.08);
		this.level-=sea_level_decrement;
	}
	this.display = function() {
		fill(this.color);
		noStroke();
		rect(0, height / 4, width, this.level);
	}
}

function Background_image(weather) {
	this.weather = weather;
	this.daycolor = color(168, 203, 255);
	this.nightcolor = color(0, 0, 0);

	this.display = function(day) {
		//  -TODO- Rain snow sunny cloudy /day &night
		if (day) {
			switch(this.weather){
				case "Rain":
					fill(109);
					break;
				case "Snow":
					fill(239,250,255);
					break;
				case "Sunny":
					fill(248,255,132);
					break;
				case "Clouds":
					fill(98,120,141);
					break;
				default:
					fill(248,0,132);
					break;

			}
			noStroke();
			rect(0, 0, width, height / 4);

		} else {
				switch(this.weather){
					case "Rain":
						fill(255);
						break;
					case "Snow":
						fill(200);
						break;
					case "Sunny":
						fill(150);
						break;
					case "Clouds":
						fill(50);
						break;
					default:
						fill(0);
						break;
				}
			noStroke();
			rect(0, 0, width, height / 4);
		}
		fill(255);
		triangle(x_gridpoint_12scale[2], y_gridpoint_12scale[1], x_gridpoint_12scale[8], y_gridpoint_12scale[3], x_gridpoint_12scale[1], y_gridpoint_12scale[3]);
	}
}


function Sun() {
	this.color = color(255, 255, 0,80);
	this.display = function(xpos, ypos) {
		noStroke();
		ellipseMode(CENTER);
		for(var i=0;i<50;i++){
			fill(255,255,50,80-i);
			ellipse(xpos, ypos, width / 15+i, width / 15+i);
		}

	}
	this.move = function() {

		}
}

function Moon() {
	this.color = color(254, 252, 215);
	this.display = function(xpos, ypos) {
		noStroke();
		ellipseMode(CENTER);
		for(var i=0;i<50;i++){
			fill(254,252,215,80-i);
			ellipse(xpos, ypos, width / 15+i, width / 15+i);
		}
		}
	this.move = function(step) {
		switch (step) {
			case 0:
				this.display(moon_orbit_stops_xpos[0], moon_orbit_stops_ypos[0]);
				break;
			case 1:
				this.display(moon_orbit_stops_xpos[1], moon_orbit_stops_ypos[1]);
				break;
			case 2:
				this.display(moon_orbit_stops_xpos[2], moon_orbit_stops_ypos[2]);
				break;
			case 3:
				this.display(moon_orbit_stops_xpos[3], moon_orbit_stops_ypos[3]);
				break;
			case 4:
				this.display(moon_orbit_stops_xpos[4], moon_orbit_stops_ypos[4]);
				break;
			case 5:
				this.display(moon_orbit_stops_xpos[5], moon_orbit_stops_ypos[5]);
				break;
		}
	}
}

function Polarbear() {
	live = true;

	this.draw = function(x, y) { //TODO fix with variables
		ellipseMode(CENTER);
		//ears
		fill(230);
		noStroke();
		ellipse(100 / 2 - 30 / 2 + x, 175 / 3 - 30 / 2 + y, 50 / 2, 50 / 2);
		ellipse(100 / 2 + 30 / 2 + x, 175 / 3 - 30 / 2 + y, 50 / 2, 50 / 2);
		fill(150);
		ellipse(100 / 2 - 30 / 2 + x, 175 / 3 - 30 / 2 + y, 38 / 2, 38 / 2);
		ellipse(100 / 2 + 30 / 2 + x, 175 / 3 - 30 / 2 + y, 38 / 2, 38 / 2);
		//face
		noStroke();
		fill(230);
		ellipse(100 / 2 + x, 175 / 3 + y, 100 / 2, 100 / 2);
		//eyes
		fill(0);
		ellipse(100 / 2 - 10 + x, 175 / 3 - 15 / 2 + y, 10 / 2, 10 / 2);
		ellipse(100 / 2 + 10 + x, 175 / 3 - 15 / 2 + y, 10 / 2, 10 / 2);
		//nose
		fill(0);
		ellipse(100 / 2 + x, 175 / 3 + 15 / 2 + y, 25 / 2, 20 / 2);
		//body
		fill(230);
		ellipse(100 / 2 + x, 175 / 3 + 120 / 2 + y, 180 / 2, 180 / 2);
		//legs
		// fill(200);
		// ellipse(width/2-45,height/3+200,50,50);
		fill(100);
		arc(100 / 2 - 45 / 2 + x, 175 / 2 + 70 + y, 50 / 2, 50 / 2, radians(160), radians(20), CHORD);
		//legs
		fill(100);
		// ellipse(width/2+45,height/3+200,50,50);
		arc(100 / 2 + 45 / 2 + x, 175 / 2 + 70 + y, 25, 25, radians(160), radians(20), CHORD);
	}
	this.drawDying = function(x,y){
		ellipseMode(CENTER);
		//ears
		fill(230);
		noStroke();
		ellipse(100 / 2 - 30 / 2 + x, 175 / 3 - 30 / 2 + y+120, 50 / 2, 50 / 2);
		ellipse(100 / 2 + 30 / 2 + x, 175 / 3 - 30 / 2 + y+120, 50 / 2, 50 / 2);
		fill(150);
		ellipse(100 / 2 - 30 / 2 + x, 175 / 3 - 30 / 2 + y+120, 38 / 2, 38 / 2);
		ellipse(100 / 2 + 30 / 2 + x, 175 / 3 - 30 / 2 + y+120, 38 / 2, 38 / 2);
		//face
		noStroke();
		fill(230);
		ellipse(100 / 2 + x, 175 / 3 + y+120, 100 / 2, 100 / 2);
		//eyes
		fill(0);
		ellipse(100 / 2 - 10 + x, 175 / 3 - 15 / 2 + y+120, 10 / 2, 10 / 2);
		ellipse(100 / 2 + 10 + x, 175 / 3 - 15 / 2 + y+120, 10 / 2, 10 / 2);
		//nose
		fill(0);
		ellipse(100 / 2 + x, 175 / 3 + 15 / 2 + y+120, 25 / 2, 20 / 2);
	}

	this.checkBound = function(){
		if(bear_pos_x<0)
		bear_pos_x+=10;
		if(bear_pos_x>width-50)
		bear_pos_x-=10;
		if(bear_pos_y>height-160)
		bear_pos_y-=10;
		}

	this.checkDead = function(sea_level,hole_x,hole_y,hole_r,health){
			if(bear_pos_y < sea_level-160){
				live = false;
			}
			if(bear_pos_x+220<hole_x+hole_r&&bear_pos_y+160>hole_y-hole_r/4&&bear_pos_y+160 < hole_y+hole_r/4&&bear_pos_x-180>hole_x-hole_r)live=false;
			if(health<1)live=false;
		}

	this.health = 100;
	this.updateHealth = function(eating){
		var prev_sec = current_sec;
		current_sec = second();
		if(prev_sec!=current_sec)this.health-=1;
		if(eating)this.health+=10;

	}
	this.showHealth = function(){
		strokeWeight(10);
		rect(0,0,width,50);
		noStroke();
		fill(255,0,0);
		currentHealth = map(this.health,1,100,0,width);
		rect(0,0,currentHealth,50);
	}
}
