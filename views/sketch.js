

function setup() {
  createCanvas(500, 500);
}


function draw() {
  noStroke();
  fill(255,10);
  rect(0,0,width,height);
  stroke(0);
  line(width/2, height/2, mouseX, mouseY);
}
