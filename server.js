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

function getRecentBirds() {
  var options = {
    method: "GET",
    url:
      "https://api.ebird.org/v2/data/obs/geo/recent?lat=" +
      lat +
      "&lng=" +
      lon +
      "&sort=species&dist=" +
      dist +
      "&len=1-5" +
      "&back=" +
      back +
      "&hotspot=" +
      hotspot,
    headers: {
      "X-eBirdApiToken": process.env.EBIRDKEY
    }
  };
}
