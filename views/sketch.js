
function setup() {
  createCanvas(500, 500);
  loadData("https://www.loc.gov/photos/?q=boy&fo=json");
}

function draw() {
  
}

function loadData(url) {
  loadJSON(url, onDataLoaded);
  
}

function onDataLoaded(data) {
  var i = floor(random(data.results.length));
  var imageURLs = data.results[i].image_url;
  var imageURL = imageURLs[imageURLs.length - 1];
  var myImg = createImg(imageURL);
}