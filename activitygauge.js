
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
        var firstCell = LookerCharts.Utils.htmlForCell(data[0][queryResponse.fields.dimensions[0].name]);
        var secondCell = LookerCharts.Utils.htmlForCell(data[1][queryResponse.fields.dimensions[0].name]);
        var thirdCell = LookerCharts.Utils.htmlForCell(data[2][queryResponse.fields.dimensions[0].name]);
        var fourthCell = LookerCharts.Utils.htmlForCell(data[3][queryResponse.fields.dimensions[0].name]);
        var firstMeas = parseFloat(LookerCharts.Utils.textForCell(data[0][queryResponse.fields.measure_like[0].name]));
        var secondMeas = parseFloat(LookerCharts.Utils.textForCell(data[1][queryResponse.fields.measure_like[0].name]));
        var thirdMeas = parseFloat(LookerCharts.Utils.textForCell(data[2][queryResponse.fields.measure_like[0].name]));
        var fourthMeas = parseFloat(LookerCharts.Utils.textForCell(data[3][queryResponse.fields.measure_like[0].name]));
        // var firstColour = config.firstColor;
        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measure_head = queryResponse.fields.measure_like[0].label_short;
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "activity_container";


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
                    fontSize: '15px',
                    color: Highcharts.Color(Highcharts.getOptions().colors[0])
                }
            },
            subtitle: {
                text: measure_head,
                style: {
                fontSize: '10px',
                color: Highcharts.Color(Highcharts.getOptions().colors[1])
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
                background: [{ // Track for Dim1
                    outerRadius: '100%',
                    innerRadius: '85%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
                        .setOpacity(0.1)
                        .get(),
                    borderWidth: 0
                }, { // Track for Dim2
                    outerRadius: '84%',
                    innerRadius: '70%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                        .setOpacity(0.1)
                        .get(),
                    borderWidth: 0
                }, { // Track for Dim3
                    outerRadius: '69%',
                    innerRadius: '55%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2])
                        .setOpacity(0.1)
                        .get(),
                    borderWidth: 0
                }, { // Track for Dim4
                    outerRadius: '54%',
                    innerRadius: '40%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[3])
                        .setOpacity(0.1)
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
                    radius: '84%',
                    innerRadius: '70%',
                    y: firstMeas
                }]
            }, {
                name: secondCell,
                data: [{
                    color: '#9DFF02',
                    radius: '84%',
                    innerRadius: '70%',
                    y: secondMeas
                }]
            }, {
                name: thirdCell,
                data: [{
                    color: '#0CCDD6',
                    radius: '69%',
                    innerRadius: '55%',
                    y: thirdMeas
                }]
            }, {
                name: fourthCell,
                data: [{
                    color: '#DDDF00',
                    radius: '54%',
                    innerRadius: '40%',
                    y: fourthMeas
                }]
            }]
        });
        options = {}
             // Create an option for each measure in the query


                for (row of data; i=0; i<3; i++){
                    var field = row[queryResponse.fields.dimensions[0].name];
                    id = "color_" + field.value
                    options[id] =
                    {
                        label: field.value + " Color",
                        default: Highcharts.Color(Highcharts.getOptions().colors[i]),
                        section: "Style",
                        type: "string",
                        display: "color"
                    }
                }
        this.trigger('registerOptions', options) // register options with parent page to update visConfig

        doneRendering()
    }
});
