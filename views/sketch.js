var currentURL = "https://www.loc.gov/photos/?dates=1990/1999&fo=json";
var currentYear = 1900;

function setup() {
  createCanvas(500, 500);
  setTimeURL(currentYear, currentYear + 1);
  loadData();
  setInterval(tick,1000);
}

function draw() {
  
}

function setTimeURL(start, end) {
  currentURL = "https://www.loc.gov/photos/?dates=" + start + "/" + end + "&fo=json";
}

function tick() {
  loadData();
  currentYear++;
  setTimeURL(currentYear, currentYear + 1);
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