/*
for finals:
- add weather api(current by city id - churchill canada) from https://openweathermap.org/current
       > check day||night
       > sunny, cloudy, snow, rain change accordingly
- have the bear jump(animated with spacebar)
- ice plate shape and opacity
- water rise as the day goes on and the other way if night
- time element */

var sea, backgroundImage, sun, moon, day, bear, n, ground;
var icePlate = [];
var sun_orbit_stops_xpos = [];
var sun_orbit_stops_ypos = [];
var moon_orbit_stops_xpos = [];
var moon_orbit_stops_ypos = [];
var x_gridpoint_12scale = [];
var y_gridpoint_12scale = [];
var bearposition_x = []; //top ->bottom left->right / bearposition of leftbottom corner
var bearposition_y = []; // 0top 1bottom
var s24;
var vertical_midpoint;
var mid_start_x;
var move = false;
var seaRise;
var plate_boundary;
var step = 0;
var bear_length;
var x_trans, y_trans;
var position = 1;
var weatherData,current_weather;  //weather vars

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
	var bear_init_x = width/2;
	var bear_init_y = height/2;

	//set initial setup
	sea = new Sea();
	background_image = new Background_image(current_weather);
	//parameters == starting location
	sun = new Sun(); //creates sun that rotates with 6 stops.
	moon = new Moon(); //opposite side of sun
	ground = new Ground();

	//build a bear
	bear = new Polarbear(bear_init_x,bear_init_y);
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
	bear.draw(bearposition_x[0], bearposition_y[0]);

	// bear.translate(x_gridpoint_12scale[3],y_gridpoint_12scale[7]);

	// quad(width / 6, height / 2 + height / 12, width * 5 / 6, height / 2 + height / 12, width, height - height / 12, 0, height - height / 12);
	// stroke(0);
	// line(x_gridpoint_12scale[1], y_gridpoint_12scale[9], x_gridpoint_12scale[11], y_gridpoint_12scale[9]);
}


function draw() {
 ground.display();
 sea.display();
 background_image.display(day);
	//
 sun.display(sun_orbit_stops_xpos[0], sun_orbit_stops_ypos[0]);
 moon.display(moon_orbit_stops_xpos[0], moon_orbit_stops_ypos[0]);
 bear.draw(bearposition_x[bearx], bearposition_y[beary]);
}

function keyPressed() {
			if(keyCode == LEFT_ARROW){
				bearx-=1;
				beary-=1;
				direction="l";
			}
			if(keyCode == RIGHT_ARROW){
					bearx += 1;
					beary += 1;
					direction="r";
			}
			if(keyCode == UP_ARROW){
				bearx-=4;
				beary-=4;
				direction="u";
			}
			if(keyCode == DOWN_ARROW){
				bearx+=4;
				beary+=4;
				direction="d";
			}
}

function Ground() {
	this.display = function() {
		fill(255);
		noStroke();
		rect(0, height / 2, width, height);
	}
}

function Sea() {
	this.r = 0;
	this.g = 105;
	this.b = 145;
	this.color = color(this.r, this.g, this.b);
	this.checkColor = function() {
		var rgbs = this.r + this.g + this.b;
		return rgbs;
	}
	// 	this.generateWaves = function(){
	// 		var waves = [];
	// 		for (var i = 1; i < random(5, 20);i++) {

	// 		}
	// 	}
	this.display = function() {
		fill(this.color);
		noStroke();
		rect(0, height / 4, width, height / 4);
	}
	this.move = function(day, rand) {
		var increase, decrease;
		if (day) {
			rect(0, y_gridpoint_12scale[5], width, rand);
		}
		if (!day) {

		}
	}
}

function Background_image(weather) {
	this.weather = weather;
	this.daycolor = color(168, 203, 255);
	this.nightcolor = color(0, 0, 0);
	this.end = function() {
		fill(0);
		rect(0, 0, width, height);
		fill(255);
		textSize(40);
		textAlign(CENTER);
		text("The LAST POLAR BEAR Died", width / 2, height / 2);
	}
	this.display = function(day) {
		//  -TODO- Rain snow sunny cloudy /day &night
		if (day) {
			fill(this.daycolor);
			noStroke();
			rect(0, 0, width, height / 4);

		} else {
			fill(this.nightcolor);
			noStroke();
			rect(0, 0, width, height / 4);
		}
		fill(255);
		triangle(x_gridpoint_12scale[2], y_gridpoint_12scale[1], x_gridpoint_12scale[8], y_gridpoint_12scale[3], x_gridpoint_12scale[1], y_gridpoint_12scale[3]);
	}
}

function Sun() {
	this.color = color(253, 184, 19);
	this.display = function(xpos, ypos) {
		fill(this.color);
		noStroke();
		ellipseMode(CENTER);
		ellipse(xpos, ypos, width / 12, width / 12);
	}
	this.move = function(step) {
		switch (step) {
			case 0:
				this.display(sun_orbit_stops_xpos[0], sun_orbit_stops_ypos[0]);
				break;
			case 1:
				this.display(sun_orbit_stops_xpos[1], sun_orbit_stops_ypos[1]);
				break;
			case 2:
				this.display(sun_orbit_stops_xpos[2], sun_orbit_stops_ypos[2]);
				break;
			case 3:
				this.display(sun_orbit_stops_xpos[3], sun_orbit_stops_ypos[3]);
				break;
			case 4:
				this.display(sun_orbit_stops_xpos[4], sun_orbit_stops_ypos[4]);
				break;
			case 5:
				this.display(sun_orbit_stops_xpos[5], sun_orbit_stops_ypos[5]);
				break;
		}
	}
}

function Moon() {
	this.color = color(254, 252, 215);
	this.display = function(xpos, ypos) {
		fill(this.color);
		noStroke();
		ellipseMode(CENTER);
		ellipse(xpos, ypos, width / 12, width / 12);
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

function Iceplate(start_x, start_y, str) {
	this.color = color(255);
	this.r = 255;
	this.g = 255;
	this.b = 255;
	this.x_pt1 = start_x;
	this.y_pt1 = start_y;
	this.x_pt2 = start_x + width / 6;
	this.y_pt2 = start_y;
	if (str == "top") {
		this.x_pt3 = map(this.x_pt2, plate_boundary[0], plate_boundary[2], plate_boundary[4], plate_boundary[6]);
		this.x_pt4 = map(this.x_pt1, plate_boundary[0], plate_boundary[2], plate_boundary[4], plate_boundary[6]);
	} else if (str == "bottom") {
		this.x_pt3 = map(this.x_pt2, plate_boundary[4], plate_boundary[6], plate_boundary[8], plate_boundary[10]);
		this.x_pt4 = map(this.x_pt1, plate_boundary[4], plate_boundary[6], plate_boundary[8], plate_boundary[10]);
	}
	this.y_pt3 = start_y + height / 6;
	this.y_pt4 = this.y_pt3;

	this.display = function() {
		stroke(200);
		fill(this.color);
		quad(this.x_pt1, this.y_pt1, this.x_pt2, this.y_pt2, this.x_pt3, this.y_pt3, this.x_pt4, this.y_pt4);
	}

	this.height = function() {
		var hgt = this.y_pt3 - this.y_pt2;
		return hgt;
	}
	this.length = function() {
		var length = this.x_pt2 - this.x_pt1;
		return length;
	}
	this.melt = function() {
		// -TODO- fill with decreasing opacity
		this.r = 0;
		this.g = 105;
		this.b = 148;
		this.color = color(this.r, this.g, this.b);
		this.display();
	}
	this.checkColor = function() {
		var rgbs = this.r + this.g + this.b;
		return rgbs;
	}
}

function Polarbear() {

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

	this.jump = function(x,y,direction,target){
		switch (direction) {
			case "l":

				break;
			// case "r":
			// 		this.lift = createVector(x_s24,y_gridpoint_12scale[1]);
			// 	break;
			// case "u":
			// 		this.lift = createVector(x_s24,y_gridpoint_12scale[1]);
			// 	break;
			// case "l":
			// 		this.lift = createVector(-x_s24,y_gridpoint_12scale[1]);
			// 	break;
			// case "l":
			// 		this.lift = createVector(-x_s24,y_gridpoint_12scale[1]);
			// 	break;
			//
			// //notice default goes last = less process
			default:

		}


		this.velocity += this.lift;
	}
}
