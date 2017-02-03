// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
});

jQuery('#search').on('input propertychange paste', function(event) {
  var URL = "live/" + $("#search").val();
  var request = new XMLHttpRequest();
  request.open("GET", URL, false);
  request.send(null);
  var jsonResponse = request.responseText;
  console.log(jsonResponse);
  console.log(event);
});