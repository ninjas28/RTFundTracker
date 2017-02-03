//requires jquery

$.get({
  url: '',
  data: ['aapl', 'goog'],
  success: function(rdata){
    console.log(rdata);
  }
});