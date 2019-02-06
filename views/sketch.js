

function setup() {
  createCanvas(500, 500);
  loadJSON("https://www.loc.gov/photos/?q=frog&fo=json", dataLoaded);
}

function dataLoaded(data) {
  
  var urls = data.results[3].image_url;
  var url = "https:" + urls[urls.length - 1];
  
  var img = createImg(url);
  
  console.log(url);
}

function draw() {
  
}
