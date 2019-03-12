
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
            max-width: 300px;
            min-width: 280px;
        }
        </style>`;
        var i=0;
        
        var firstCell = LookerCharts.Utils.htmlForCell(data[0][queryResponse.fields.dimensions[0].name]);
        var secondCell = LookerCharts.Utils.htmlForCell(data[1][queryResponse.fields.dimensions[0].name]);
        var thirdCell = LookerCharts.Utils.htmlForCell(data[2][queryResponse.fields.dimensions[0].name]);
        var firstMeas = parseFloat(LookerCharts.Utils.textForCell(data[0][queryResponse.fields.measure_like[0].name]));
        var secondMeas = parseFloat(LookerCharts.Utils.textForCell(data[1][queryResponse.fields.measure_like[0].name]));
        var thirdMeas = parseFloat(LookerCharts.Utils.textForCell(data[2][queryResponse.fields.measure_like[0].name]));
        var firstColour = config.firstColor;
        var dimension_head = LookerCharts.Utils.htmlForCell(data[0][queryResponse.fields.dimensions.name];
        
        console.log(LookerCharts.Utils.textForCell(data[2][queryResponse.fields.measures[0].name]), thirdMeas);
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "activity_container";

        options = {}
             // Create an option for each measure in your query
             queryResponse.fields.measure_like.forEach(function(field) {
               id = "color_" + field.name
               options[id] =
               {
            label: field.label_short + " Color",
            default: "#8B7DA8",
            section: "Style",
            type: "string",
            display: "color"
               }
             })
        this.trigger('registerOptions', options) // register options with parent page to update visConfig

   

Highcharts.setOptions({
    colors: ['#F62366', '#9DFF02', '#0CCDD6', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
});
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
                y: (this.chart.plotHeight / 2) - 15
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
