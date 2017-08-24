/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse */

function setup() {
  createCanvas(1000, 1000);
  background(0,0,255);
}


function draw() {
  if (mouseIsPressed) {
    fill(3,4,5);
  } else {
    fill(101, 010, 100);
  }
  ellipse(mouseX, mouseY, 1, 1);
}