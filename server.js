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

let countryCodes = [{ code: "US", weight: "1" }];

let rack = [];
let obsMap = {};
let build = true;

function buildRack() {
  for (let i = 0; i < 61; i++) {
    rack[i] = [];
  }
}

function buildMap() {
  for (let i = 0; i < rack.length; i++) {
    for (let j = 0; j < rack[i].length; j++) {
      obsMap[rack[i][j].comName + rack[i][j].locId] = true;
    }
  }
}

function loadRack() {
  try {
    let rawdata = fs.readFileSync("data/lastRack.json");
    rack = JSON.parse(rawdata);
    buildMap();
    console.log("LOADED RACK");
    build = false;
  } catch (e) {
    console.log(e);
    buildRack();
    console.log("BUILDING NEW RACK");
  }
}

function trimBirds() {
  for (let i = 0; i < 61; i++) {
    rack[i] = rack[i].slice(0, 100);
  }
}

function saveBirds() {
  let data = JSON.stringify(rack);
  fs.writeFileSync("data/lastRack.json", data);
  console.log("Saved birds.");
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
      "&mess=" +
      Math.random(),
    headers: {
      "X-eBirdApiToken": process.env.EBIRDKEY
    }
  };

  console.log(options.url);

  request(options, function(error, response, body) {
    if (error) console.log(error);
    const birds = JSON.parse(body);
    fileBirds(birds);
  });
}

function fileBirds(birds) {
  build = false;
  let fc = 0;
  for (let i = 0; i < birds.length; i++) {
    let b = birds[i];

    //console.log(b.howMany);
    if (b.howMany <= 60 && !obsMap[b.comName + b.locId]) {
      rack[b.howMany].unshift(b);
      obsMap[b.comName + b.locId] = true;
      fc++;
    }
  }
  console.log("FILED " + fc + "BIRDS.");
  trimBirds();
  saveBirds();

  let s = "";
  let ec = 0;
  for (let i = 0; i < rack.length; i++) {
    s = s + rack[i].length + "|";
    ec += 100 - rack[i].length;
  }
  console.log(s);
  console.log("EMPTY:" + ec);
}

function getBirdNum(n) {
    let nb = rack[n][Math.floor(Math.random() * rack[n].length)];
    return(nb);
}

function getBirdOclock(h, m, s) {
  let hb = rack[h][Math.floor(Math.random() * rack[h].length)];
  let mb = rack[m][Math.floor(Math.random() * rack[m].length)];
  let sb = rack[s][Math.floor(Math.random() * rack[s].length)];

  if (hb) console.log(hb.howMany + " " + hb.comName);
  if (mb) console.log(mb.howMany + " " + mb.comName);
  if (sb) console.log(sb.howMany + " " + sb.comName);
  
  let outs = [hb, mb, sb];
  
  return(outs);
}

function getNow() {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  return getBirdOclock(h, m, s);
}

//API Stuff
app.get("/birdNum", (req, res) => {
  var num = req.query.num;
  res.send(getBirdNum(num));
});

buildRack();
//loadRack();
getRecentBirds("US");

getNow();

//setInterval(getNow, 1000);
setInterval(getRecentBirds, 60000);
