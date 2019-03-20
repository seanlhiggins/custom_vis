
/*
Looker Vis Components:
*/
looker.plugins.visualizations.add({
    create: function(element, config){
        element.innerHTML = "<div id='combo_container'></div>";
    },
    updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        var html = `<style>
            #combo_container {
            margin: 0 auto;
            min-width: 310px;
            height: 350px;
            font-family: 'Open Sans', Helvetica, Arial, sans-serif; 
        }
        </style>`;
        // Get the number of measures the user has selected
        var numMeasures = queryResponse.fields.measure_like.length;
        var numDimensions = data.length

        var firstnrows = data.slice(0,numDimensions);
       // A bunch of arrays to store the measure value for passing into the series later
        var firstMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            firstMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name].value * 10) / 10)
        }
        var w = window;

            
        var somelist = []
        firstnrows.forEach(function(row){
            somelist.push(row[queryResponse.fields.measure_like[0].name].value);

        });
        // console.log(somelist);

        for(let i=3;i<numMeasures;i++){
            w["arr_"+i] = [];
            firstnrows.forEach(function(measurevalue){
            w["arr_"+i].push(Math.round(measurevalue[queryResponse.fields.measure_like[i].name].value * 10)/10)
            console.log(w["arr_"+i]);

        });
    }
        // console.log(w["arr_1"]);

        var secondMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            secondMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[1].name].value * 10) / 10)
        }
        var thirdMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            thirdMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[2].name].value * 10) / 10)
        }
        var fourthMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            fourthMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[3].name].value * 10) / 10)
        }
       // A names of all the cells from the dimensions for the xaxis as well as labels of the measures for the pies
       var dimensionvalues = []
       data.forEach(function(value){
        dimensionvalues.push(LookerCharts.Utils.htmlForCell(value[queryResponse.fields.dimensions[0].name]));
       });

        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measurenames = []
       queryResponse.fields.measure_like.forEach(function(value){
        measurenames.push(value.label_short);
       });


       // just a function to get the sum of each arrays so user doesn't have to do Looker totals which add SQL overhead

        function getSum(total, num) {
          return total + Math.round(num);
        }

        // console.log(queryResponse,data);
       
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "combo_container";


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
                              default: 15,
                              section: 'Style',
                              type: 'number',
                              display: 'range'
                            },

                            pieSize: {
                              label: 'Pie Size',
                              min: 50,
                              max: 100,
                              step: 1,
                              default: 100,
                              section: 'Pie Style',
                              type: 'number',
                              display: 'range'
                            },
                            pieLegend: {
                                label: 'Pie Legend on/off',
                                type: 'boolean',
                                display: 'select',
                                section: "Style",
                                default: true
                            },
                            textLabel: {
                              type: 'string',
                              label: 'Subtitle',
                              placeholder: 'Add a label or description',
                              section: 'Style'
                            },
                            legendtoggle: {
                                label: 'Legend on/off',
                                type: 'boolean',
                                display: 'select',
                                section: "Style",
                                default: true
                            }
                }

            
             // Create an option for the first 4 rows in the query
             for(let i=0;i<=3;i++){

                    var field = queryResponse.fields.measure_like[i].label_short;
                    id = "color_" + i
                    options[id] =
                    {
                        label: field,
                        default: Highcharts.getOptions().colors[i],
                        section: "Pie Style",
                        type: "string",
                        display: "color",
                        display_size: "half",
                        order: 1
                    }
                    measChartTypeId = "charttype_" + i
                      options[measChartTypeId] =
                    {
                              type: "string",
                              label: field + " Style",
                              values: [
                                {"Column": "column"},
                                {"Line": "spline"}
                              ],
                              display: "select",
                              default: "column",
                              section: "Style",
                              display_size:"half",
                              order: 2
                            }
                    measAxisId = "measureaxis_" + i                    
                    options[measAxisId] =
                    {
                              type: "boolean",
                              label: field + " Axis",
                              display: "select",
                              default: "column",
                              section: "Style",
                              order: 3
                            }
                    }

                    function customYAxis (x) {
                    var AxisOn = x,
                        yAxisCustomised;
                
                        if(AxisOn=false) {
                            yAxisCustomised = {
                                    title: {
                                        text: measurenames[0]
                                    }
                                }
                        } else {
                             yAxisCustomised = [{
                                    title: {
                                        text: measurenames[0]
                                    }
                             },{
                                 title: {
                                        text: 'Values'
                                    },
                                 opposite:true
                             }]
                        }
                        return yAxisCustomised;
            }
            var yAxisCustom = customYAxis(config.measureaxis_0)

Highcharts.chart('combo_container', {
    title: {
                text: dimension_head,
                style: {
                    fontSize: config.textSize,
                    color: config.color_0
                }
            },subtitle: {
                text: config.textLabel,
                style: {
                fontSize: '10px',
                color: config.textColor
                }
            },
            credits: {
                    enabled: false
                },
    xAxis: {
        categories: [dimensionvalues[0], dimensionvalues[1], dimensionvalues[2], dimensionvalues[3]]
    },
    yAxis: {yAxisCustom

    },
    // labels: {
    //     items: [{
    //         html: dimension_head,
    //         style: {
    //             left: '50px',
    //             top: '18px',
    //             color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
    //         }
    //     }]
    // },
    //
    /* need to put in something to help handle the different data types for the tooltips */
    //
    plotOptions: {
        series: {
            events: {
                legendItemClick:function(){

                     var index = this.index,
                         chart = this.chart,
                         series = chart.series,
                         len = series.length,
                         pieSerie = series[len-1];

                     pieSerie.data[index].setVisible();

                 }
            }
        }
    },
    legend: {
          enabled: config.legendtoggle,
          itemStyle:{"fontSize": "8px", "fontWeight": "normal"}
        },
    series: [{
        type: config.charttype_0,
        name: measurenames[0],
        data: firstMeasArray
    }, {
        type: config.charttype_1,
        name: measurenames[1],
        data: secondMeasArray
    }, {
        type: config.charttype_2,
        name: measurenames[2],
        data: thirdMeasArray
    }, {
        type: config.charttype_3,
        name: measurenames[3],
        data: fourthMeasArray,
        dashStyle: 'shortdot',
        marker: {
            lineWidth: 2,
            lineColor: config.color_3,
            fillColor: 'white'
        }
    }, {
        type: 'pie',
        name: measurenames[0],
        data: [{
            name: dimensionvalues[0],
            y: firstMeasArray[0],
            color: config.color_0 // dim 1's color
        }, {
            name: dimensionvalues[1],
            y: firstMeasArray[1],
            color: config.color_1 // dim 2's color
        }, {
            name: dimensionvalues[2],
            y: firstMeasArray[2],
            color: config.color_2 // dim 3's color
        }, {
            name: dimensionvalues[3],
            y: firstMeasArray[3],
            color: config.color_3 // dim 3's color
        }],
        center: [50, 0],
        size: config.pieSize,
        dataLabels: {
            enabled: false
        }
    }, {
        type: 'pie',
        name: measurenames[1],
        data: [{
            name: dimensionvalues[0],
            y: secondMeasArray[0],
            color: config.color_0 // dim 1's color
        }, {
            name: dimensionvalues[1],
            y: secondMeasArray[1],
            color: config.color_1 // dim 2's color
        }, {
            name: dimensionvalues[2],
            y: secondMeasArray[2],
            color: config.color_2 // dim 3's color
        }, {
            name: dimensionvalues[3],
            y: secondMeasArray[3],
            color: config.color_3 // dim 3's color
        }],
        center: [250, 0],
        size: config.pieSize,
        dataLabels: {
            enabled: false
        }
    }, {
        type: 'pie',
        name: measurenames[2],
        data: [{
            name: dimensionvalues[0],
            y: thirdMeasArray[0],
            color: config.color_0 // dim 1's color
        }, {
            name: dimensionvalues[1],
            y: thirdMeasArray[1],
            color: config.color_1 // dim 2's color
        }, {
            name: dimensionvalues[2],
            y: thirdMeasArray[2],
            color: config.color_2 // dim 3's color
        }, {
            name: dimensionvalues[3],
            y: thirdMeasArray[3],
            color: config.color_3 // dim 3's color
        }],
        center: [450, 0],
        size: config.pieSize,
        dataLabels: {
            enabled: false
        }
    }]
});


        this.trigger('registerOptions', options) // register options with parent page to update visConfig

        doneRendering()
    }
});
