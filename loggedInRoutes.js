var express = require('express');
var router = express.Router();

router.get("/", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.render('index', {user: request.user, data: JSON.stringify(request.user), home: true});
});

router.get("/purchases", function (request, response) {
  response.sendFile(__dirname + '/views/purchases.html');
});

module.exports = router