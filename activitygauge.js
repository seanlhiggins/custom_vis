// Uncomment to style it like Apple Watch
/*
if (!Highcharts.theme) {
    Highcharts.setOptions({
        chart: {
            backgroundColor: 'black'
        },
        colors: ['#F62366', '#9DFF02', '#0CCDD6'],
        title: {
            style: {
                color: 'silver'
            }
        },
        tooltip: {
            style: {
                color: 'silver'
            }
        }
    });
}
// */

/**
 * In the chart render event, add icons on top of the circular shapes
 */

/*
Looker Vis Components:
*/

looker.plugins.visualizations.add({
    create: function(element, config){
        element.innerHTML = "<div id='activity_container'></div>";
    },
    updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        var html = "";
        var i=0;
        for(var row of data) {

        var dim1 = row[queryResponse.fields.dimensions[0].name];
        var dim2 =row[queryResponse.fields.dimensions[1].name];
        var dim3 =row[queryResponse.fields.dimensions[2].name];
        var meas1 = 50;
        var meas2 = 60;
        var meas3 = 90;
        }
        // while (i < 3) { 
            // for(var row of data) {
            //     var cell = row[queryResponse.fields.dimensions[0].name];
            //     html += LookerCharts.Utils.htmlForCell(cell);
            // }
        // i++;
        // }

        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "activity_container";
        Highcharts.chart('activity_container', {

    chart: {
        type: 'solidgauge',
        height: '110%',
        /* events: {
            render: renderIcons
        } */
    },

    title: {
        text: 'Activity',
        style: {
            fontSize: '24px'
        }
    },

    tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '16px'
        },
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth) {
            return {
                x: (this.chart.chartWidth - labelWidth) / 2,
                y: (this.chart.plotHeight / 2) + 15
            };
        }
    },

    pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '88%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
        }, { // Track for Exercise
            outerRadius: '87%',
            innerRadius: '63%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
        }, { // Track for Stand
            outerRadius: '62%',
            innerRadius: '38%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
        }]
    },

    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    },

    series: [{
        name: dim1,
        data: [{
            color: Highcharts.getOptions().colors[0],
            radius: '112%',
            innerRadius: '88%',
            y: meas1
        }]
    }, {
        name: dim2,
        data: [{
            color: Highcharts.getOptions().colors[1],
            radius: '87%',
            innerRadius: '63%',
            y: meas2
        }]
    }, {
        name: dim3,
        data: [{
            color: Highcharts.getOptions().colors[2],
            radius: '62%',
            innerRadius: '38%',
            y: meas3
        }]
    }]
});
        doneRendering()
    }
});
