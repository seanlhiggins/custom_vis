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
        var html = `<style>
            #activity_container {
            margin: 0 auto;
            max-width: 400px;
            min-width: 380px;
        }
        </style>`;
        var i=0;
        // for(var row of data) {
        // console.log(row);
        // var dim1 = row[0];
        // var dim2 = row[1];
        // var dim3 = row[2];
        // var meas1 = 50;
        // var meas2 = 60;
        // var meas3 = 90;
        // }
        // console.log(data);
        var firstRow = data[0];
        var secondRow = data[1];
        var thirdRow = data[2];
        var dim1 = firstRow[queryResponse.fields.dimensions[0].name];
        var firstCell = LookerCharts.Utils.htmlForCell(dim1);
        var dim2 = secondRow[queryResponse.fields.dimensions[0].name];
        var secondCell = LookerCharts.Utils.htmlForCell(dim2);
        var dim3 = thirdRow[queryResponse.fields.dimensions[0].name];
        var thirdCell = LookerCharts.Utils.htmlForCell(dim3);
        var meas1 = firstRow[queryResponse.fields.measures[0].name];
        var firstMeas = Number(LookerCharts.Utils.textForCell(meas1));
        var meas2 = secondRow[queryResponse.fields.measures[0].name];
        var secondMeas = Number(LookerCharts.Utils.textForCell(meas2));
        var meas3 = thirdRow[queryResponse.fields.measures[0].name];
        var thirdMeas = Number(LookerCharts.Utils.textForCell(meas3));
        var firstColour = config.firstColor;
        var dimension_head = data[0].name;
        
        console.log(data,dimension_head);
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
        text: dimension_head,
        style: {
            fontSize: '10px'
        }
    },

    tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '10px'
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
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[3])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
        }, { // Track for Exercise
            outerRadius: '87%',
            innerRadius: '63%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[4])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
        }, { // Track for Stand
            outerRadius: '62%',
            innerRadius: '38%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[5])
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
        name: firstCell,
        data: [{
            color: '#F62366',
            radius: '112%',
            innerRadius: '88%',
            y: firstMeas
        }]
    }, {
        name: secondCell,
        data: [{
            color: '#9DFF02',
            radius: '87%',
            innerRadius: '63%',
            y: secondMeas
        }]
    }, {
        name: thirdCell,
        data: [{
            color: '#0CCDD6',
            radius: '62%',
            innerRadius: '38%',
            y: thirdMeas
        }]
    }]
});
        doneRendering()
    }
});
