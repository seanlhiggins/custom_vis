
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
        var first4rows = data.slice(0,4);
        var firstMeas = Math.round(first4rows[0][queryResponse.fields.measure_like[0].name].value * 10) / 10;
        var secondMeas = Math.round(first4rows[1][queryResponse.fields.measure_like[0].name].value * 10) / 10;
        var thirdMeas = Math.round(first4rows[2][queryResponse.fields.measure_like[0].name].value * 10) / 10;
        var fourthMeas = Math.round(first4rows[3][queryResponse.fields.measure_like[0].name].value * 10) / 10;
        var firstCell = LookerCharts.Utils.htmlForCell(data[0][queryResponse.fields.dimensions[0].name]);
        var secondCell = LookerCharts.Utils.htmlForCell(data[1][queryResponse.fields.dimensions[0].name]);
        var thirdCell = LookerCharts.Utils.htmlForCell(data[2][queryResponse.fields.dimensions[0].name]);
        var fourthCell = LookerCharts.Utils.htmlForCell(data[3][queryResponse.fields.dimensions[0].name]);
        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measure_head = queryResponse.fields.measure_like[0].label_short;
        console.log(firstMeas,secondMeas);
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "activity_container";
        var measure_list = []
        measure_list.push(firstMeas,secondMeas,thirdMeas,fourthMeas);
        var maxofmeasures=Math.max.apply(null, measure_list);
        var minofmeasures=Math.min.apply(null, measure_list);
        console.log(maxofmeasures,measure_list,minofmeasures);
        Highcharts.setOptions({
            colors: ['#F62366', '#9DFF02', '#0CCDD6', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
        });
                options = {
                            font_style: {
                              type: "string",
                              label: "Font Style",
                              values: [
                                {"Looker": "Helvetica"},
                                {"Impact": "Impact"},
                                {"Arial": "Arial"}
                              ],
                              display: "select",
                              default: "Looker",
                              section: "Style",
                              order: 2
                            },

                            textSize: {
                              label: 'Text Size',
                              min: 2,
                              max: 50,
                              step: .5,
                              default: 10,
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
                              order:1 
                            },
                            textLabel: {
                              type: 'string',
                              label: 'Label',
                              default: measure_head,
                              placeholder: measure_head,
                              section: 'Style'
                            },
                            legendtoggle: {
                                label: 'Legend on/off',
                                type: 'boolean',
                                display: 'select',
                                section: "Style",
                                default: false
                            }
                }
             // Create an option for the first 4 rows in the query
             for(let i=0;i<4;i++){

                    var field = first4rows[i][queryResponse.fields.dimensions[0].name];
                    id = "color_" + i
                    options[id] =
                    {
                        label: field.value,
                        default: Highcharts.getOptions().colors[i],
                        section: "Style",
                        type: "string",
                        display: "color",
                        display_size: "half",
                        order: 1
                    }   
                    }
        Highcharts.chart('activity_container', {

            chart: {
                type: 'solidgauge',
                height: '100%',
                style:{
                    font_family: 'Helvetica'
                }
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
                pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
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

            yAxis: {
                min: minofmeasures/100*90,
                max: maxofmeasures/100*110,
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
                    rounded: true,
                    showInLegend: true,

                }
            },
            legend: {
                  // labelFormatter: function() {
                  //   return '<span style="color:#6a26a0">' + this.name + '</span>';
                  // },
                  enabled: config.legendtoggle,
                  symbolWidth: 0
                },

            series: [{
                name: firstCell,
                marker: {enabled:false},
                data: [{
                    color: config.color_0,
                    radius: '100%',
                    innerRadius: '85%',
                    y: firstMeas
                }]
            }, {
                name: secondCell,
                marker: {enabled:false},
                data: [{
                    color: config.color_1,
                    radius: '84%',
                    innerRadius: '70%',
                    y: secondMeas
                }]
            }, {
                name: thirdCell,
                marker: {enabled:false},
                data: [{
                    color: config.color_2,
                    radius: '69%',
                    innerRadius: '55%',
                    y: thirdMeas
                }]
            }, {
                name: fourthCell,
                marker: {enabled:false},
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
