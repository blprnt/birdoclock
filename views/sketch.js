/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse */

function setup() {
  createCanvas(500, 1000);
  background(255,255,255);
}


function draw() {
  if (mouseIsPressed) {
    fill(3,4,5);
  } else {
    fill(101, 010, 100);
  }
  ellipse(100, 200, 40, 40);
}
function draw(){
background(200);
sphere(50);
}