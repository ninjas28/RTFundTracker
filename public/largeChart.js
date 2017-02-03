(function ($) {
  $.each(['show', 'hide', 'toggle'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      el.apply(this, arguments);
      return el;
    };
  });
})(jQuery);    

var drawChart = function (google,stock,behind, selectorID, selectorOther) {
  var d = 86400000;
  var n = new Date().valueOf();
  var past;
  var detail = false;
      switch(behind){
        case '1d':
          detail = true;
          past =(1);
          break;
        case '5d':
          detail = true;
          past = (5);
          break;
        case '1m':
          detail = true;
          past = (31);
          break;
        case '6m':
          past = n - (d * 31 * 6);
          break;
        case 'ytd':
          console.log('year to the date (YTD) not yet supported')
          break;
        case '1y':
          past = n - (d * 365);
          break;
        case '5y':
          past = n - (d * 365 * 5);
          break;
        case '10y':
          past = n - (d * 365 * 10);
          break;
        case '3m':
        default:
          past = n - (d * 31 * 3);
          break;
        }

      var data = new google.visualization.DataTable();
      data.addColumn('datetime');
      data.addColumn('number', 'High');
      data.addColumn('number', 'Low');
      data.addColumn('number', 'MKT Close');
  if (!detail){
      $.get( `/stocks/past/${stock.toUpperCase()}/${past}/today`, function( json ) {
      var dataArray = [];
      for (var datem of json){
          dataArray.push([new Date(datem.date),datem.high, datem.low, datem.close ])
      }
      
      
      data.addRows(dataArray);

      var options = {
        legend: 'none',
        chart: {
          legend: 'none',
          title: stock,
          subtitle: `${(behind)? behind : '3m'} (USD)`
        },series: {
          0: {
            color:'green'
          },
          1: {
            color:'red'
          },
          2: {
            color:'grey'
          }
        }
      };
        var formatter = new google.visualization.NumberFormat({prefix: '$', fractionDigits: 2});
      formatter.format(data, 1);
      formatter.format(data, 2);
      formatter.format(data, 3);
      var chart = new google.charts.Line(document.getElementById(selectorID));
        var w = $(`#${selectorID}`).css('width');
          w = Number(w.substr(0,w.length - 2))
          $(`#${selectorID}`).css('min-height', String(w/2) + "px" )
          chart.draw(data, options);
        
        $(`#${selectorID}`).on('show', function(){
          var p = $(`#${selectorID}`).parent()
          $(`#${selectorID}`).css('width', p.css('width'));
          var w = Number(p.css('width').substr(0,p.css('width').length - 2))
          $(`#${selectorID}`).css('min-height', String(w/2) + "px" )
          chart.draw(data, options);
        })
        
        $(window).resize(function() {
          var w = $(`#${selectorID}`).css('width');
          w = Number(w.substr(0,w.length - 2))
          $(`#${selectorID}`).css('min-height', String(w/2) + "px" )
          chart.draw(data, options);
        })
      })
  }
  else{
    $.get( `/stocks/detail/${stock.toUpperCase()}/${past}`, function( json ) {
      var dataArray = [];
      for (var datem of json){
          dataArray.push([new Date(Number(datem.timestamp + "000")),Number(datem.high), Number(datem.low), Number(datem.close) ])
      }
      
      
      data.addRows(dataArray);

      var options = {
        legend: 'none',
        chart: {
          legend: 'none',
          title: stock,
          subtitle: `${(behind)? behind : '3m'} (USD)`
        },series: {
          0: {
            color:'green'
          },
          1: {
            color:'red'
          },
          2: {
            color:'grey'
          }
        },
        vAxis: {
        format: 'currency'},
      };
      if (behind = '1d'){
        var formatter = new google.visualization.NumberFormat({prefix: '$', fractionDigits: 2});
      } else {
        var formatter = new google.visualization.NumberFormat({prefix: '$', fractionDigits: 2});
      }
      formatter.format(data, 1);
      formatter.format(data, 2);
      formatter.format(data, 3);
      
      
      var chart = new google.charts.Line(document.getElementById(selectorID));
        var w = $(`#${selectorID}`).css('width');
          w = Number(w.substr(0,w.length - 2))
          $(`#${selectorID}`).css('min-height', String(w/2) + "px" )
          chart.draw(data, options);
      
      $(selectorOther).on('click', function(){
          console.log('showing');
          var p = $(`#${selectorID}`).parent()
          $(`#${selectorID}`).css('width', p.css('width'));
          var w = Number(p.css('width').substr(0,p.css('width').length - 2))
          $(`#${selectorID}`).css('min-height', String(w/2) + "px" )
          chart.draw(data, options);
        })
      
        $(window).resize(function() {
          var w = $(`#${selectorID}`).css('width');
          w = Number(w.substr(0,w.length - 2))
          $(`#${selectorID}`).css('min-height', String(w/2) + "px" )
          chart.draw(data, options);
        })
      })
  }
}