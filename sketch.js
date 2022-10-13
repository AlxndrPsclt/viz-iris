let font,
  InitialFontsize = 100;

let lettersAlpha = 0;


function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf');
}


function setup() {

  BACKGROUND_FADE = '0.1';
  ENERGY = 5;

  CELL_SIZE_X = 50;
  CELL_SIZE_Y = 50;

  frame=0;
  MAX_FRAME=-1     // -1 means unlimited

  // Library setup
  createCanvas( window.screen.width * window.devicePixelRatio, window.screen.height* window.devicePixelRatio);

  textFont(font);
  textSize(InitialFontsize);
  textAlign(CENTER, CENTER);

  implantation_disp_x=randval(1);
  implantation_disp_y=randval(1);
  opera_disp_x=randval(3);
  opera_disp_y=randval(3);
    //fill(65);

  noCursor();
  frameRate(10);
  colorMode(HSB);

  // Global image setup
  WIDTH = window.screen.width * window.devicePixelRatio;
  HEIGHT = window.screen.height * window.devicePixelRatio;
  CENTER_X = WIDTH / 2;
  CENTER_Y = HEIGHT / 2;
  GRID_WIDTH = int(window.screen.width / CELL_SIZE_X);
  GRID_HEIGHT = int(window.screen.height / CELL_SIZE_Y);

  grille = Array.from(Array(GRID_WIDTH+1), () => new Array(GRID_HEIGHT+1));
  window.grille = grille;

  OFFSET_X = (window.screen.width - (GRID_WIDTH * CELL_SIZE_X)) / 2;
  OFFSET_Y = (window.screen.height - (GRID_HEIGHT * CELL_SIZE_Y)) / 2;

  COLOR_PALETTE = [
    "#02315E88",
    "#00457E88",
    "#2F70AF88",
    "#B9848C88",
    "#80649188",
  ];

  COLOR_PALETTE_GREENS = [
    "#5f801377",
    "#a1bf5c77",
    "#0a330077",
    "#3e5e2677",
  ];

  COLOR_PALETTE_BROWNS = [
    "#91510c22",
    "#66390122",
    "#ba931e22",
  ];

  colorMode(HSB, 360, 360, 360, 360);


  // Default config; can be overrided later by a named, or custom config

  //baseColor = `rgba(10,10,10,255)`;
  baseColor = '#0F0F0F';
  background(baseColor);
  refreshColor = `rgba(10,10,10,${BACKGROUND_FADE})`;

  knots={};
  potentialSpawn=[];
  spawn=[];

//  initialSW= p(OFFSET_X, HEIGHT - OFFSET_Y, {x: 0, y: GRID_HEIGHT}, position='SW');
//  initialNW = p(OFFSET_X, OFFSET_Y, {x: 0, y: 0}, position='NW');
//  initialNE = p(WIDTH - OFFSET_X, OFFSET_Y, {x: GRID_WIDTH, y: 0}, position='NE');
//  initialSE = p(WIDTH - OFFSET_X, HEIGHT - OFFSET_Y, {x: GRID_WIDTH, y: GRID_HEIGHT}, position='SE');

  initialNW = p(0, 0);
  initialSW= p(0, GRID_HEIGHT);
  initialNE = p(GRID_WIDTH, 0);
  initialSE = p(GRID_WIDTH, GRID_HEIGHT);

  knots[initialSW.uuid] = initialSW;
  knots[initialNW.uuid] = initialNW;
  knots[initialNE.uuid] = initialNE;
  knots[initialSE.uuid] = initialSE;

  spawn.push(initialSW.uuid);
  spawn.push(initialSE.uuid);
  spawn.push(initialNW.uuid);
  spawn.push(initialNE.uuid);

  strokeColor = `rgba(100,100,230,100)`;
  stroke(strokeColor);

  // DRAW GRID
//  for (let i = 0, len = GRID_WIDTH +1; i < len; i++) {
//    line(i * CELL_SIZE_X + OFFSET_X, 0 + OFFSET_Y, i * CELL_SIZE_X + OFFSET_X, HEIGHT - OFFSET_Y);
//  }
//  for (let j = 0, len = GRID_HEIGHT + 1; j < len; j++) {
//    line(0 + OFFSET_X, j * CELL_SIZE_Y + OFFSET_Y, WIDTH - OFFSET_Y, j * CELL_SIZE_Y + OFFSET_Y);
//  }
}

function p(X,Y,linkUuid=null,uuid=null,age=1) { //POINT
  puuid = uuid? uuid : crypto.randomUUID();
  grille[X][Y] = puuid;
  leafColor = COLOR_PALETTE_GREENS[int(random(COLOR_PALETTE_GREENS.length))];
  branchColor = COLOR_PALETTE_BROWNS[min(COLOR_PALETTE_BROWNS.length -1, int(age/20))];
  leafSize = max(5, max(30-int(age/4), int(random(60 - age/2))));
  return {
    X: X,
    Y: Y,
    energy: int(random(5)),
    xDisplacement: 0,
    yDisplacement: 0,
    leafColor: leafColor,
    branchColor: branchColor,
    leafSize: leafSize,
    age: age,
    x: function() {
      return OFFSET_X + this.X * CELL_SIZE_X + this.xDisplacement;
    },
    y: function() {
      return OFFSET_Y + this.Y * CELL_SIZE_Y + this.yDisplacement;
    },
    update_displacements: function() {
      this.xDisplacement += randval(this.energy);
      this.yDisplacement += randval(this.energy);
    },
    uuid: puuid,
    linkUuid: linkUuid,
  }
}

function getVoisins(knot) {
  X=knot.X;
  Y=knot.Y;
  NW = {X: X-1, Y: Y-1}
  N  = {X: X, Y: Y-1}
  NE = {X: X+1, Y: Y-1}
  W =  {X: X-1, Y: Y}
  E =  {X: X+1, Y: Y}
  SW = {X: X-1, Y: Y+1}
  S  = {X: X, Y: Y+1}
  SE = {X: X+1, Y: Y+1}
  voisins = [NW, N, NE, W, E, SW, S, SE];
  voisins = voisins.filter(d => (d.X>=0 && d.X<=GRID_WIDTH)).filter(d => (d.Y>=0 && d.Y<=GRID_WIDTH)).filter(d => !(grille[d.X][d.Y]))
  return voisins;
}

function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
}

function isInRange(x, lower, upper) {
  return (x > lower && x < upper);
}

function randval(energy) {
  return int(random(-energy-0.5, energy+0.5));
}
function randint(energy) {
  return int(random(0, energy+1));
}

function v(p1,p2) {
  return {
    x: (p2.x() - p1.x()),
    y: (p2.y() - p1.y()),
  }
}

function draw() {
  if (frame >= 0 && (MAX_FRAME== -1 || frame < MAX_FRAME)) {



    if (frame<3*25) {
      strokeWeight(0);
      fill(baseColor);
    } else {
      textSize(InitialFontsize);
      lettersColor = color(50,220,350,200+20*int(log(frame)));
      fill(lettersColor);

      if (frame % 7 == 0) {
        console.log("Changing disp");
        implantation_disp_x=randval(3);
        implantation_disp_y=randval(3);
        opera_disp_x=randval(3);
        opera_disp_y=randval(3);
      }

      text('IMPLANTATION', 4*WIDTH/10+ implantation_disp_x, 2*HEIGHT/10 +  implantation_disp_y);
      if ( frame> 6.5*25 ) {
        text('by OP3R4', 7*WIDTH/10+ implantation_disp_y, 7.5*HEIGHT/10 - implantation_disp_x);
      }
      if ( frame> 4*25 ) {
        textSize(50);
        text('19/10\n 00H-12H', 2*WIDTH/10+opera_disp_x, 7*HEIGHT/10+opera_disp_y);
      }
      if ( frame> 5*25 ) {
        textSize(40 );
        text('SECRET PLACE', 2*WIDTH/10 - opera_disp_y, 8.4*HEIGHT/10 - opera_disp_x);
      }
    }
      

    frame+=1;

    background(refreshColor);

    Object.keys(knots).forEach( key => {

      knot = knots[key];
      knot.update_displacements();


      if (knot.linkUuid) {
        otherKnot = knots[knot.linkUuid];
        strokeWeight(max(1, 20-int(knot.age/3)));
        stroke(knot.branchColor);
        line(otherKnot.x(), otherKnot.y(), knot.x(), knot.y());
        stroke(knot.leafColor);
        fill(knot.leafColor);
        strokeWeight(knot.leafSize);
        strokeWeight(3);
        direction = v(knot, otherKnot);
        coeff=min(5, Math.log(knot.age));
        triangle(
          knot.x()-direction.y/coeff + randval(2),
          knot.y()+direction.x/coeff + randval(2),
          knot.x()+direction.y/coeff + randval(2),
          knot.y()-direction.x/coeff + randval(2),
          knot.x()+direction.x/coeff + randval(2),
          knot.y()+direction.y/coeff + randval(2))
        //point(knot.x(), knot.y());
      }

      //strokeColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
      //strokeColor = "#202020;
    });

    newSpawn=[];

    spawn.forEach( (knotRef, index) => {
      knot = knots[knotRef];
      voisins = getVoisins(knot);
      if (voisins.length > 0) {
        let randomVoisin = voisins[Math.floor(Math.random() * voisins.length)];
        newKnot = p(randomVoisin.X, randomVoisin.Y, linkUuid = knot.uuid, uuid=null, age=knot.age+1);
        knots[newKnot.uuid] = newKnot;

        if (voisins.length > 1) {
          potentialSpawn.push(knot.uuid);
        }
        newSpawn.push(newKnot.uuid);
      } else {
        if (potentialSpawn.length>0) {
          elementIndex = Math.floor(Math.random() * potentialSpawn.length);
          newSpawnKnot = potentialSpawn.splice(elementIndex,1)[0];
        }
        newSpawn.push(newSpawnKnot);
      }
      //console.log(knot);
    });

    spawn = newSpawn;
  }
}
