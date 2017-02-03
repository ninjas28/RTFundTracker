// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
$(function(){
var g_symbol = g_symbol;
  //init search box style
$('#searchresults')
      .html('')
      .css({
      position: 'fixed',
      'z-index': '-1',
      'display': 'none',
    })
  
var putSearchResults = function(results) {
  var colorChange;
  var change;
  if(results.change >= 0) {
    colorChange = "#009900"
    change = "+" + results.change;
  } else {
    colorChange = "#cc0000";
    change = results.change;
  }
  
  if(results.name == null) {
    $('#searchresults').html("<h5>Invalid Stock Symbol!</h5>");// changed this to jquery syntax
    return;
  }
  $('#searchresults').css({
    position:'fixed',
    'z-index': '2',
    display: 'flex'
  });// changed this to jquery syntax
  //Search Results template 
  var btnLink;
  
  /* 
  g_symbol is passed by the pug template and is the current symbol for the stock.pug rendered page
  below checks if the current symbol is the same as the searched one and makes the button a dead link if true
  */
  
  if(g_symbol !== undefined){
    if(results.symbol.toUpperCase() === g_symbol.toUpperCase()){
      btnLink = '#';
    }else{
      btnLink = `/stocks/page/${results.symbol}`;
    }
  }else{
    btnLink = `/stocks/page/${results.symbol}`;
  }
  
  var resultTitle = `
<h5 id="resultTitle">
    ${results.symbol}: 
    <span style="color: ${colorChange}">
        ${results.lastTradePriceOnly} (${change})
    </span>
</h5>
<br>
<h6>
    ${results.name}
</h6>
<a href="${btnLink}" 
    class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" 
    style="color:white; background:${colorChange}">
        View More
</a>
`;
  $('#searchresults').html(resultTitle);// changed this to jquery syntax
}

function searchSymbol() {
  var URL = "/stocks/live/" + $("#search").val();
  $.get(URL, function(json){
    json = JSON.parse(json);
    putSearchResults(json);
  })  
}

var timer;
$('#search').on('keyup', function(event) {
  if($("#search").val() == "") {
    /* USE JQUERY!!!!
     document.getElementById("searchresults").setAttribute("style", "position:fixed; z-index: -1; display: none");
     document.getElementById("searchresults").innerHTML = "";*/
    $('#searchresults')
      .html('')
      .css({
      position: 'fixed',
      'z-index': '-1',
      'display': 'none',
    });// changed this to jquery syntax
    return;
  }
  
  if (timer) {
        clearTimeout(timer);
    }
  timer = setTimeout(searchSymbol, 300);
});
$('#search').keydown(function(event){
  console.log(event.key);
 if (event.key === 'Enter'){
   
   var link = $('#searchresults a').attr('href');
   console.log(link)
   if (link){
     location.replace(link);
   }
 }
})

jQuery('#search').on('paste', function(event) {
  var URL = "/stocks/live/" + $("#search").val();
  console.log('hello')
  $.get(URL, function(json){
    json = JSON.parse(json);
    console.log(json);
    putSearchResults(json);
  })
});
  
});