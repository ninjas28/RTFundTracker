// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var finance = require('yahoo-finance');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var asyncLib = require('async');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session({secret: 'rtfundsecret'}));
app.use(flash());

//authentication scheme
passport.use(new LocalStrategy(
  function(username, password, done) {
    passport.User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/d3test", function(request, response) {
  response.sendFile(__dirname + '/views/d3_test.html');
})

app.get("/purchases", function (request, response) {
  response.sendFile(__dirname + '/views/purchases.html');
});

app.get("/login", function (request, response) {
  response.sendFile(__dirname + '/views/login.html');
});
app.get('/test/url', function (request, response){
  request.originalUrl
  response.json({query:request.query, request: request.originalUrl});
})
app.get("/live/multiple", function (request, response) {
  console.log(request.query.stocks);
  asyncLib.map(request.query.stocks, getStock, function(err, results){
    if (err){
      response.json(err);
    }else{
    response.json(results);
    }
  });
  function getStock(stock, callback){
    return finance.snapshot({
      fields: ['s', 'n', 'd1', 'l1', 'y', 'r'] ,
      symbol: stock.toUpperCase()
    }, function (err, snapshot) {
      if (err) { callback(err);}
      console.log(snapshot);
      callback(null, snapshot);
    });
  }
});

app.get("/live/:quote", function (request, response) {
  var SYMBOL = request.params['quote'].toUpperCase();
  
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
