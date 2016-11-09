var rmData = []
var limit = 200
var divId = 0
function genChart( did, title, field ){
    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: did,
            type: 'area',
            marginRight: 10,
            events: {
                load: function() {
                        var series = this.series;
                        setInterval( function(){
                            $.getJSON('http://localhost:8888/info', function (data) {
                                var shift = false 
                                if( series[0].data.length > limit ){
                                    shift = true
                                }
                                series[0].addPoint([data.time,Number(data[field])], true, shift, true)
                            })
                        }, 1000);
                }
            }
        },
        title: {
            text: title
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: title
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
            }
        },
        //图例属性
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
        },
        exporting: {
            enabled: false
        },
        series: [{
            name : title,
            data : []
        }]
    });
}
$(document).ready(function () {
    Highcharts.setOptions({
        global: {
            useUTC: false//是否使用世界标准时间
        }
    });
    compos.forEach(function(compo){
        var id = divId + ""
        divId++
        console.log(id)
        genChart(id,compo[0],compo[1])
    })
});