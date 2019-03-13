
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
        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measure_head = queryResponse.fields.measure_like[0].label_short;
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "activity_container";


        Highcharts.setOptions({
            colors: ['#F62366', '#9DFF02', '#0CCDD6', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
        });
                options = {
                            font_style: {
                              type: "string",
                              label: "Font Style",
                              values: [
                                {"Looker": "helvetica"},
                                {"Impact": "impact"},
                                {"Times New Roman": "times"}
                              ],
                              display: "select",
                              default: "looker",
                              section: "Style",
                              display_size: "half",
                              order: 2
                            },

                            textSize: {
                              label: 'Text Size',
                              min: 2,
                              max: 50,
                              step: .5,
                              default: 15,
                              section: 'Style',
                              type: 'number',
                              display: 'range'
                            },
                            textColor: {
                              label: 'Text Color',
                              default: '#6a26a0',
                              section: 'Style',
                              type: 'string',
                              display: 'color',
                              display_size: "half",
                              order:1 
                            },
                            textLabel: {
                              type: 'string',
                              label: 'Label',
                              placeholder: 'Add a label or description',
                              section: 'Style'
                            }
                }
             // Create an option for the first 4 rows in the query
             var first4rows = data.slice(0,4);
             for(let i=0;i<4;i++){

                    var field = first4rows[i][queryResponse.fields.dimensions[0].name];
                    console.log(field,i)
                    id = "color_" + i
                    options[id] =
                    {
                        label: field.value,
                        default: Highcharts.getOptions().colors[i],
                        section: "Style",
                        type: "string",
                        display: "color",
                        display_size: "half"
                    }   
                    }
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
                    fontSize: config.textSize,
                    color: config.color_0
                }
            },
            subtitle: {
                text: config.textLabel,
                style: {
                fontSize: '10px',
                color: config.textColor
                }
            },
            credits: {
                    enabled: false
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
                        y: (this.chart.plotHeight / 2) + 25
                    };
                }
            },

            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Dim1
                    outerRadius: '100%',
                    innerRadius: '85%',
                    backgroundColor: Highcharts.Color(config.color_0)
                        .setOpacity(0.1)
                        .get(),
                    borderWidth: 0
                }, { // Track for Dim2
                    outerRadius: '84%',
                    innerRadius: '70%',
                    backgroundColor: Highcharts.Color(config.color_1)
                        .setOpacity(0.1)
                        .get(),
                    borderWidth: 0
                }, { // Track for Dim3
                    outerRadius: '69%',
                    innerRadius: '55%',
                    backgroundColor: Highcharts.Color(config.color_2)
                        .setOpacity(0.1)
                        .get(),
                    borderWidth: 0
                }, { // Track for Dim4
                    outerRadius: '54%',
                    innerRadius: '40%',
                    backgroundColor: Highcharts.Color(config.color_3)
                        .setOpacity(0.1)
                        .get(),
                    borderWidth: 0
                }]
            },

            yAxis: [{
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: [],
                stops: [
                        [0.1, '#b0498d'],
                        [0.5, '#EFD7E7']
                      ]
            },
            {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: [],
                stops: [
                        [0.1, '#24CBE5'],
                        [0.5, '#DDDF00']
                      ]
            },
            {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: [],
                stops: [
                        [0.1, '#64E572'],
                        [0.5, '#FF9655']
                      ]
            },
            {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: [],
                stops: [
                        [0.1, '#b0498d'],
                        [0.5, '#FFF263']
                      ]
            }],

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
                    color: config.color_0,
                    radius: '100%',
                    innerRadius: '85%',
                    y: firstMeas
                }]
            }, {
                name: secondCell,
                data: [{
                    color: config.color_1,
                    radius: '84%',
                    innerRadius: '70%',
                    y: secondMeas
                }]
            }, {
                name: thirdCell,
                data: [{
                    color: config.color_2,
                    radius: '69%',
                    innerRadius: '55%',
                    y: thirdMeas
                }]
            }, {
                name: fourthCell,
                data: [{
                    color: config.color_3,
                    radius: '54%',
                    innerRadius: '40%',
                    y: fourthMeas
                }]
            }]
        });
        this.trigger('registerOptions', options) // register options with parent page to update visConfig
        doneRendering()
    }
});
