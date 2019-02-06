

function setup() {
  createCanvas(500, 500);
  loadJSON("https://www.loc.gov/photos/?q=frog&fo=json", dataLoaded);
}

function dataLoaded(data) {
  console.log(data);
  background(255,0,0)
}

function draw() {
  noStroke();
  fill(255,10);
  rect(0,0,width,height);
  stroke(0);
  line(width/2, height/2, mouseX, mouseY);
}
