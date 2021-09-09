// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
const request = require("request");
var fs = require("fs");

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

function buildRack() {
  for(let i = 0; i < 61; i++) {
    rack[i] = [];
  }
}

function load

function trimBirds() {
  for(let i = 0; i < 61; i++) {
    rack[i] = rack[i].slice(0,100);
  }
}

function saveBirds() {
  let data = JSON.stringify(rack);
  fs.writeFileSync('data/lastRack.json', data);
}



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
    //console.log(b.howMany);
    if (b.howMany <= 60) {
      rack[b.howMany].unshift(b);
    }
  }
  trimBirds();
  saveBirds();
}

//buildRack();
loadRack();
getRecentBirds('US');
