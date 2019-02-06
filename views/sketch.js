var currentURL = "https://www.loc.gov/photos/?q=boy&fo=json";

function setup() {
  createCanvas(500, 500);
  loadData();
  setInterval(tick,1000);
}

function draw() {
  
}

function tick() {
  loadData();
}

function loadData() {
  loadJSON(currentURL, onDataLoaded);
  
}

function onDataLoaded(data) {
  addRandomImage(data);
}

function addRandomImage(data) {
  var i = floor(random(data.results.length));
  var imageURLs = data.results[i].image_url;
  var imageURL = imageURLs[imageURLs.length - 1];
  var myImg = createImg(imageURL);
}