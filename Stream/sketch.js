
// data
var scriptie = "willem.json";
var values; // JSON

// colors
var colors = [];
var highlightDevision;

// Grid variables
var gridDimensions;
var moduleSize;
var gridSize;
var modules;
var moduleCutOff = 1;

// Sentence class
var sentences = [];

// Animation variables
var heightmap;
var read = 0;
var resized = false;

function preload() {
  values = loadJSON("scriptieJSON/" + scriptie);
}

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);

  loadColors(); // load personal colors
  calcGrid(); // create a grid from input data

  // create objects & get their neighbour
  for(var i=0; i<modules; i++) {
    var line = values[i][0];
    var levdist = values[i][1];
    sentences[i] = new Sentence(i, line, levdist);
  }
  for(var i=0; i<modules; i++) sentences[i].getNeighbour();

  strokeCap(SQUARE);
  // strokeWeight(floor(moduleSize.y) - 2);
}

function draw() {
  // Background stuff
  background(255);
  noStroke();

  // heightmap creation
  if(frameCount % 20 == 0 || frameCount == 1) {
    read = (read+=1) % sentences.length;
    generateHeightmap();
  }


  if(resized) {
    calcGrid(); // create a grid from input data
    for(var i=0; i<modules; i++) sentences[i].setLocation();
    for(var i=0; i<modules; i++) sentences[i].getNeighbour();
    resized = false;
  }
  if(!resized) {
    for(var i=0; i<modules; i++) sentences[i].update();
    for(var i=0; i<modules; i++) sentences[i].updateVisual();
    for(var i=0; i<modules; i++) sentences[i].display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resized = true;
}

/*

  CUSTOM FUNCTIONS

*/

function loadColors() {
  colors[0] = color('#8EFB18');
  colors[1] = color('#1152F2');
  colors[2] = color('#D0EEF6');
  highlightDevision = 0.65;
}

// function loadColors() { // Wilmer
//   colors[0] = color('#60EEC8');
//   colors[1] = color('#00D431');
//   colors[2] = color('#FF9c00');
//   highlightDevision = 0.90;
// }

function calcGrid() {
  var screenRatio = width/height;
  gridDimensions = createVector(floor(sqrt(values.length * screenRatio)), floor(sqrt(values.length / screenRatio)));
  moduleSize = createVector(width / (gridDimensions.x-moduleCutOff), height / gridDimensions.y);
  gridSize = createVector((gridDimensions.x) * (moduleSize.x), (gridDimensions.y) * (moduleSize.y));
  modules = gridDimensions.x * gridDimensions.y;
}

function generateHeightmap() {
  var hmp = createImage(gridDimensions.x, gridDimensions.y);
  hmp.loadPixels();
  for(var i=0; i<modules; i++) {
    // Every channel is stored individually (R G B A)
    for(var c=0; c<4; c++) hmp.pixels[floor(i*4)+c] = map(sentences[i].levdist[read], 0, 100, 0, 255);
  }
  hmp.updatePixels();
  heightmap = hmp;
}

function Sentence(index, line, levdist) {
  this.id = index;
  this.line = line;
  this.levdist = levdist;
  this.neighbour;
  this.currentSentence = 0;
  this.currentLevdist = 0;
  this.levDistColor;
  this.setLocation();
}
Sentence.prototype.setLocation = function() {
  this.pos = createVector(this.id % gridDimensions.x, floor(this.id / gridDimensions.x));
  this.loc = createVector(this.pos.x*moduleSize.x, this.pos.y*moduleSize.y, 0);
  this.loc.x += (width - (gridDimensions.x * moduleSize.x)) + (moduleSize.x * moduleCutOff);
  this.loc.y += (height - (gridDimensions.y * moduleSize.y));
}
Sentence.prototype.getNeighbour = function() {
  if(floor(this.id % gridDimensions.x) != gridDimensions.x-1) this.neighbour = sentences[this.id+1];
}
Sentence.prototype.update = function() {
  this.currentSentence = read;
  this.currentLevdist = heightmap.pixels[this.id*4];
}
Sentence.prototype.updateVisual = function() {
  this.loc.z = lerp(this.loc.z, this.currentLevdist, 0.1);
  this.getColor();
}
Sentence.prototype.getColor = function() {
  if(this.loc.z < 100.0 * highlightDevision) {
    this.levDistColor = lerpColor(colors[0], colors[1], map(this.loc.z, 0.0, 100.0 * highlightDevision, 0.0, 1.0));
  } else {
    this.levDistColor = lerpColor(colors[1], colors[2], map(this.loc.z, 100 * highlightDevision, 100.0, 0.0, 1.0));
  }
}
Sentence.prototype.display = function() {
  if(this.neighbour != null) {
    var numSteps = 4;
    var margin = 5;
    noStroke();
    for(var i=0; i<numSteps; i++) {
      fill(lerpColor(this.levDistColor, this.neighbour.levDistColor, (1.0/numSteps)*i));
      rect(lerp(this.loc.x, this.neighbour.loc.x - margin, (1.0/numSteps)*i) + (margin/2), this.loc.y + (margin/2), moduleSize.x/numSteps, moduleSize.y - margin);
    }
    stroke(255);
    for(var i=1; i<numSteps; i++) {
      line(lerp(this.loc.x, this.neighbour.loc.x - margin, (1.0/numSteps)*i) + (margin/2), this.loc.y,
           lerp(this.loc.x, this.neighbour.loc.x - margin, (1.0/numSteps)*i) + (margin/2), this.loc.y + moduleSize.y);
    }
  }
}
