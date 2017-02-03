var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var asyncLib = require('async');
var finance = require('yahoo-finance');
var intraday = require('intraday');
var gf = require('google-finance');
var rssparser = require('rss-parser');


//Current stock price for multiple stocks
router.get("/live/multiple", function (request, response) {
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
      fields: ['s', 'n', 'd1', 'l1'] ,
      symbol: stock.toUpperCase()
    }, function (err, snapshot) {
      if (err) { callback(err);}
      console.log(snapshot);
      callback(null, snapshot);
    });
  }
});

//Current stock price for one stock
router.get("/live/:symbol", function (request, response) {
  var SYMBOL = request.params['symbol'].toUpperCase();
  
  finance.snapshot({
    fields: ['s', 'n', 'l1', 'c1', 'x'] ,
    symbol: SYMBOL
  }, function (err, snapshot) {
    if (err) { throw err; }
    response.send(JSON.stringify(snapshot, null, 2));
  });
});

//All historical data from a date up to today
router.get("/past/:symbol/:start/today", function ( request, response){
  var start = new Date(Number(request.params['start'])).toString();
  var end = new Date().toString();
  
  finance.historical({
  symbol: request.params['symbol'].toUpperCase(),
  from: start,
  to: end
}, function (err, quotes) {
    if (err){
      return response.send(err);
    }
    response.json(quotes);
  })
})

router.get("/detail/:symbol/today", function( req, res){
  intraday(req.params['symbol'], function (err, data) {

    res.json(data);
  });
})

router.get("/detail/:symbol/:days", function( req, res){
  intraday(req.params['symbol'], req.params['days'], function (err, data) {

    res.json(data);
  });
})

router.get('/news/:symbol',function(req, res){
    gf.companyNews({
      symbol: req.params.symbol
    }, function (err, news) {
        res.json(news);
    });
});

router.get('/alt/news/:symbol',function(req, res){
    rssparser.parseURL(`https://news.google.com/news/section?gl=us&q=${req.params.symbol}&output=rss`, function(err, parsed) {
      if (err){console.log(err)}
      res.json(parsed);
    })
});

//All historical data from a date up to another date
router.get("/past/:symbol/:start/:end", function ( request, response){ 
  var start = new Date(Number(request.params['start'])).toString();
  var end = new Date(Number(request.params['end'])).toString();
  console.log(start, end);

  finance.historical({
  symbol: request.params['symbol'].toUpperCase(),
  from: start,
  to: end
}, function (err, quotes) {
    if (err){
      return response.send(err);
    }
    response.json(quotes);
  })
})

//For full data pages on stocks
router.get("/page/:symbol", ensureLoggedIn, function(request, response){
  var symbol = request.params.symbol;
  
  finance.snapshot({
    fields: ['n', 'x'] ,
    symbol: symbol
  }, function (err, snapshot) {
    if (err) { throw err; }
    console.log(snapshot.name);
    var exchange;
    if (snapshot.stockExchange === 'NMS'){
      exchange = 'NASDAQ';
    }else if (snapshot.stockExchange === 'NYQ'){
      exchange = 'NYSE';
    }else {
      exchange = snapshot.stockExchange
    }
    
    response.render('stock', {symbol: String(symbol).toUpperCase(), user: request.user, stitle: snapshot.name, exchange: exchange})
  });
  
})


module.exports = router