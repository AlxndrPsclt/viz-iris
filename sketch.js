let xoff = 0;

let currentRotation=0;

var line1X=300;
var line1Y=-150;
var line1Angle=3*PI/4;

var line2X=300;
var line2Y=-150;
var line2Angle=3*PI/4;

var line3X=300;
var line3Y=-150;
var line3Angle=3*PI/4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX=windowWidth/2;
  centerY=windowHeight/2;
  //createCanvas(1000, 1000);
  frameRate(20);
  background('rgba(0%,0%,0%,1)');
  stroke(255);
  noFill();
}


function drawSquaresLine(xStart, yStart, numberOfSquares, angle) {
  stroke('white')
  x=xStart;
  y=yStart;
  
  s=10;
  directionX=cos(angle)*2*s;
  directionY=sin(angle)*2*s;

  push();
  translate(x, y);

  for (let i = 0, len = numberOfSquares; i < len; i++) {
    translate(directionX, directionY);
    push();
    rotate(angle);
    rect(0, 0, s, s);
    pop();  //The origin is back to (0, 0) and rotation is back to 0.
    x+=directionX*s;
    y+=directionY*s;
  }

  pop();
}

function draw() {
  // Draw the flat line at the beginning
  //if (framecount <= width/3) {
  background('rgba(0%,0%,0%,0.025)');
  translate(centerX,centerY);

  rotate(currentRotation);

  if (frameCount % 100 == 0) {
    console.log("GO");
    console.log(frameCount);
    line1X=int(random()*500) - 250;
    line1Y=int(random()*500) - 250;
    line1Angle=random()*2*PI-PI;
  }

  if (frameCount % 70 == 0) {
    console.log("GO2");
    console.log(frameCount);
    line2X=int(random()*500) - 250;
    line2Y=int(random()*500) - 250;
    line2Angle=random()*2*PI-PI;
  }

  if (frameCount % 80 == 0) {
    console.log("GO3");
    console.log(frameCount);
    line3X=int(random()*500) - 250;
    line3Y=int(random()*500) - 250;
    line3Angle=random()*2*PI-PI;
  }

  if (random()>0.1) {
    drawSquaresLine(line1X, line1Y, 30+int(random(8)), line1Angle);
  }

  if (random()>0.1) {
    drawSquaresLine(line2X, line2Y, 32+int(random(8)), line2Angle);
  }
  if (random()>0.1) {
    drawSquaresLine(line3X, line3Y, 40+int(random(8)), line3Angle);
  }

  currentRotation -= PI/160;
  //drawSquaresLine(20, 100, 10, 30, 20);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
