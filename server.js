// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
const request = require("request");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("views"));

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

let countryCodes = [
  {code:"US",weight:"1"}
]

let rack = [];



function getRecentBirds(reg) {
  
  //https://api.ebird.org/v2/data/obs/{{regionCode}}/recent
  let back = 1;
  var options = {
    method: "GET",
    url:
      "https://api.ebird.org/v2/data/obs/" +
      reg + 
      "/recent" +
      "?back=" +
      back,
    headers: {
      "X-eBirdApiToken": process.env.EBIRDKEY
    }
  };
  
  console.log(options.url);
  
  
  
  request(options, function(error, response, body) {
    const birds = JSON.parse(body);
    fileBirds(birds);
    
  })
  
}

function fileBirds(birds) {
  for(let i = 0; i < birds.length; i++) {
    let b = birds[i];
    
  }
}

getRecentBirds('US');
