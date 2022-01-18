// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
const request = require("request");
var fs = require("fs");
const fetch = require("node-fetch2");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("views"));

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

let countryCodes = [
  { code: "US", weight: "1" },
  { code: "CA", weight: "1" },
  { code: "IN", weight: "1" },
  { code: "AU", weight: "1" },
  { code: "BR", weight: "1" },
  { code: "GB", weight: "1" },
  { code: "TW", weight: "1" },
  { code: "MX", weight: "1" }
];

let countryIndex = 0;

let rack = [];
let extinct = [];
let imageSet = {};
let imageQ = [];
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
      let sn = rack[i][j].speciesCode;
      if (!imageSet[sn] && imageQ.indexOf(sn) == -1) {
        imageQ.push(sn);
      }
      obsMap[rack[i][j].comName + rack[i][j].locId] = true;
    }
  }
}


function loadRack() {
  try {
    let rawdata = fs.readFileSync("data/lastRack.json");
    rack = JSON.parse(rawdata);
    loadExtinct();
    console.log("LOADED RACK");
    build = false;
  } catch (e) {
    console.log(e);
    buildRack();
    console.log("BUILDING NEW RACK");
  }
}

function loadExtinct() {
  
  try {
    let rawdata = fs.readFileSync("data/extinctRack.json");
    extinct = JSON.parse(rawdata);
    rack[0] = extinct[0];
    buildMap();
    console.log("LOADED EXTINCT RACK");
    build = false;
  } catch (e) {
    
  }
}

function loadBirdImages() {
  try {
    let rawdata = fs.readFileSync("data/birdImages.json");
    imageSet = JSON.parse(rawdata);
    console.log(imageSet);
  } catch (e) {
    console.log(e);  }
}

function trimBirds() {
  for (let i = 0; i < rack.length; i++) {
    //cull
    let newb = [];
    for (let j = 0; j < rack[i].length; j++) {
      if (rack[i][j]) {
        if (imageQ.indexOf(rack[i][j].speciesCode != -1 || imageSet[rack[i][j].speciesCode])) {
          newb.push(rack[i][j]);
        }
      }
    }
    rack[i] = newb.slice(0, 10);
  }
}

function saveBirds() {
  let data = JSON.stringify(rack);
  fs.writeFileSync("data/lastRack.json", data);
  console.log("Saved birds.");
}

function saveBirdImages() {
  let data = JSON.stringify(imageSet);
  fs.writeFileSync("data/birdImages.json", data);
  console.log("Saved bird images.");
}


function getRecentBirds() {
  //let reg = "IN";
  let reg = countryCodes[countryIndex].code;
  countryIndex++;
  if (countryIndex == countryCodes.length) countryIndex = 0;
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
      "&includeProvisional=" + 
      true + 
      "&mess=" +
      Math.random(),
    headers: {
      "X-eBirdApiToken": process.env.EBIRDKEY,
    },
  };

  request(options, function (error, response, body) {
    if (error) console.log(error);
    const birds = JSON.parse(body);
    fileBirds(birds);
  });
}

function fileBirds(birds) {
  console.log("PROCESSING " + birds.length + " birds");
  build = false;
  let fc = 0;
  for (let i = 0; i < birds.length; i++) {
    let b = birds[i];

    //console.log(b.howMany);
    if (b.howMany <= 60 && !obsMap[b.comName + b.locId] && b.comName.indexOf('x') != 0) { //eliminate hybrids
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
    ec += 10 - rack[i].length;
  }
  console.log(s);
  console.log("EMPTY:" + ec);
}

function getBirdNum(n) {
  
  let nb = rack[n][Math.floor(Math.random() * rack[n].length)];
  if (nb) {
  //console.log("GET BIRD NUM:" + nb.speciesCode + ":" + imageSet[nb.speciesCode])
  if (nb && imageSet[nb.speciesCode]) {
    
    //console.log("APPEND IMAGE")
    let img = imageSet[nb.speciesCode].image;
    let w = 500;
    nb.image = img.replace(
          "http://commons.wikimedia.org/wiki/Special:FilePath/",
          "https://commons.wikimedia.org/w/thumb.php?width=" + w + "&f="
        );
  }
  }
  return nb;
}

function getBirdOclock(h, m, s) {
  let hb = rack[h][Math.floor(Math.random() * rack[h].length)];
  let mb = rack[m][Math.floor(Math.random() * rack[m].length)];
  let sb = rack[s][Math.floor(Math.random() * rack[s].length)];

  if (hb) console.log(hb.howMany + " " + hb.comName);
  if (mb) console.log(mb.howMany + " " + mb.comName);
  if (sb) console.log(sb.howMany + " " + sb.comName);

  let outs = [hb, mb, sb];

  return outs;
}

function getNow() {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  return getBirdOclock(h, m, s);
}

function processImageQ() {
  if (imageQ.length > 0) {
    var b = imageQ.shift();
    getWikiData(b, "en");
  }
}

//WIKIDATA--------------------------------------

const endpointUrl = "https://query.wikidata.org/sparql";
let sparqlQuery = `PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/> 
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX v: <http://www.wikidata.org/prop/statement/>

SELECT ?item ?itemLabel ?image ?ebird WHERE {
  VALUES ?BIRDS { {{birdlist}} }
  ?item wdt:P3444 ?BIRDS.
  
  OPTIONAL {?item wdt:P18 ?image.}
  OPTIONAL {?item wdt:P3444 ?ebird.}
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language {{lang}} .
   }
}`;

function checkStatus(res) {
  console.log(res);
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    //throw MyCustomError(res.statusText);
  }
}

function getWikiData(_bird, lang) {
  
  console.log("GET WIKI DATA FOR : " + _bird);
  let ep = sparqlQuery
    .replace("{{birdlist}}", '"' + _bird + '"')
    .replace("{{lang}}", '"' + lang + '"');

  const fullUrl = endpointUrl + "?query=" + encodeURIComponent(ep) + "&format=json";
  const headers = {
    Accept: "application/sparql-results+json",
    "User-Agent": "BirdClock/0.0 (https://bird-oclock.glitch.me/; blprnt@blprnt.com)"

  };
  
  //console.log(fullUrl);
  
  var options = {
    method: "GET",
    url: fullUrl,
    headers: headers
  };
  
  //console.log(options.url);

  request(options, function(error, reponse, body) {
    //console.log(body);
    try {
    var j = JSON.parse(body);
    var b = j.results.bindings[0]["ebird"].value;
    var img = j.results.bindings[0]["image"].value;
      
      console.log(b + ":" + img);
      imageSet[b] = {"image":img};
      saveBirdImages();
    } catch(e) {
      console.log("FAILED ON" + b);
      //console.log(j.results.bindings[0]);
    }
    
  });
  /*

  //Get common names(translated) and images from wikidata
  const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
  queryDispatcher
    .query(
      sparqlQuery
        .replace("{{birdlist}}", _bird)
        .replace("{{lang}}", '"' + lang + '"')
    )
    .then(wikis => {
      console.log(wikis);
      let blist = wikis.results.bindings;
      blist.forEach(b => {
        //let bird = birdMap[b.ebird.value];
        let bname = b.itemLabel.value;
        let bimg;
        if (b.image) bimg = b.image.value;
        console.log("WIKI BIRD:" + bname + ":" + bimg );
      });
    });
    */
}


//----------------------------------------------

//API Stuff
app.get("/birdNum", (req, res) => {
  var num = req.query.num;
  res.send(getBirdNum(num));
});

//buildRack();
loadBirdImages();
loadRack();
getRecentBirds();

getNow();

//setInterval(getNow, 1000);
setInterval(getRecentBirds, 60000);
setInterval(processImageQ, 1000);

imageQ.push("fieldf");
