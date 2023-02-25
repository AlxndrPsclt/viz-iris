let xoff = 0;

let currentRotation=0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(24);
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
  background('rgba(0%,0%,0%,0.04)');

  if (random()>0.6) {
    drawSquaresLine(200, 200, 10, currentRotation);
  }

  if (random()>0.6) {
    drawSquaresLine(200, 200, 15, currentRotation+PI/4);
  }

  if (random()>0.6) {
    drawSquaresLine(200, 200, 20, currentRotation+PI/2);
  }

  if (random()>0.6) {
    drawSquaresLine(200, 200, 30, currentRotation+3*PI/4);
  }

  if (random()>0.6) {
    drawSquaresLine(200, 200, 40, currentRotation+4*PI/5);
  }

  currentRotation -= PI/80;
  //drawSquaresLine(20, 100, 10, 30, 20);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
