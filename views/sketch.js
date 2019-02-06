
function setup() {
  createCanvas(500, 500);
  loadData("https://www.loc.gov/photos/?q=boy&fo=json");
}

function draw() {
  
}

function loadData(url) {
  loadJSON(url);
  
}