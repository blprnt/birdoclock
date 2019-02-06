

function setup() {
  createCanvas(500, 500);
  loadJSON("https://www.loc.gov/photos/?q=frog&fo=json", dataLoaded);
}

function dataLoaded(data) {
  console.log(data);
  background(255,0,0)
  
  var urls = data.results[3].image_url;
  var url = "https:" + urls[urls.length - 1];
  
  var img = loadImage(url);
  image(img, 0, 0);
  
  console.log(url);
}

function draw() {
  
}
