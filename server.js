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
let obsMap = {};

function buildRack() {
  for(let i = 0; i < 61; i++) {
    rack[i] = [];
  }
}

function buildMap() {
  for (let i = 0; i < rack.length; i++) {
    for (let j = 0; j < rack[i].length; i++) {
      obsMap[rack[i][j].subId] = true;
    }
  }
}

function loadRack() {
  
  try {
    let rawdata = fs.readFileSync('data/lastRack.json');
    rack = JSON.parse(rawdata);
    buildMap();
    console.log("LOADED RACK");
  } catch(e) {
    buildRack();
    console.log("BUILDING NEW RACK");
  }
}

function trimBirds() {
  for(let i = 0; i < 61; i++) {
    rack[i] = rack[i].slice(0,100);
  }
}

function saveBirds() {
  let data = JSON.stringify(rack);
  fs.writeFileSync('data/lastRack.json', data);
}



function getRecentBirds() {
  
  let reg = "US";
  //https://api.ebird.org/v2/data/obs/{{regionCode}}/recent
  let back = 1;
  var options = {
    method: "GET",
    url:
      "https://api.ebird.org/v2/data/obs/" +
      reg + 
      "/recent" +
      "?back=" +
      back +
      "&max=100",
    headers: {
      "X-eBirdApiToken": process.env.EBIRDKEY
    }
  };
  
  console.log(options.url);
  
  request(options, function(error, response, body) {
    if (error) console.log(err);
    const birds = JSON.parse(body);
    fileBirds(birds);
  })
  
}

function fileBirds(birds) {
  let fc = 0;
  for(let i = 0; i < birds.length; i++) {
    let b = birds[i];
    
    //console.log(b.howMany);
    if (b.howMany <= 60 && !obsMap[b.subId]) {
      rack[b.howMany].unshift(b);
      obsMap[b.subId] = true;
      fc++;
    }
  }
  console.log("FILED " + fc + "BIRDS.")
  trimBirds();
  saveBirds();
  
  let s = "";
  let ec = 0;
  for (let i = 0; i < rack.length; i++) {
    s = s + rack[i].length + "|";
    ec += (100 - rack[i].length);
  }
  console.log(s);
  console.log("EMPTY:" + ec);
}

function getBirdOclock(h, m, s) {
 let hb = rack[h][Math.floor(Math.random() * rack[h].length)]; 
 let mb = rack[m][Math.floor(Math.random() * rack[m].length)]; 
 let sb = rack[s][Math.floor(Math.random() * rack[s].length)]; 
  
 if (hb) console.log(hb.howMany + " " + hb.comName);
  if (mb) console.log(mb.howMany + " " + mb.comName);
  if (sb) console.log(sb.howMany + " " + sb.comName);
}

function getNow() {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  getBirdOclock(h, m, s);
}

//buildRack();
loadRack();
getRecentBirds('US');

getBirdOclock(11,16,48);

//setInterval(getNow, 1000);
setInterval(getRecentBirds, 60000);



