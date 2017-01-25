// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var finance = require('yahoo-finance');
var _ = require('lodash');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/live/:quote", function (request, response) {
  var SYMBOL = request.params['quote'];
  
  finance.snapshot({
    fields: ['s', 'n', 'd1', 'l1', 'y', 'r'] ,
    symbol: SYMBOL
  }, function (err, snapshot) {
    if (err) { throw err; }
    response.send(JSON.stringify(snapshot, null, 2));
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
