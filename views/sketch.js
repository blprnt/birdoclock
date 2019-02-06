
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
  var imageURL = data.results[0].image_url;
  console.log(imageURL);
}