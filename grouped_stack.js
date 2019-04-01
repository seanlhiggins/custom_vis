/*
Looker Vis Components:
*/
looker.plugins.visualizations.add({
    create: function(element, config){
        element.innerHTML = "<div id='grouped_stack'></div>";
    },
    updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        var html = `<style>
            #grouped_stack {
            margin: 0 auto;
            min-width: 310px;
            height: 400px;
            font-family: 'Open Sans', Helvetica, Arial, sans-serif; 
        }
        </style>`;
        // Get the number of measures the user has selected
        var numMeasures = queryResponse.fields.measure_like.length;
        var numDimensions = data.length

        var firstnrows = data.slice(0,numDimensions);
       // A bunch of arrays to store the measure value for passing into the series later
        var firstMeasArray = [];
        // for(let i=0;i<numDimensions;i++){
        //     firstMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name].value * 10) / 10)
        // }
        // var w = window;

            
        var somelist = []
        firstnrows.forEach(function(row){
            somelist.push(row[queryResponse.fields.measure_like[0].name].value);

        });
        // console.log(somelist);

        // for(let i=3;i<numMeasures;i++){
        //     w["arr_"+i] = [];
        //     firstnrows.forEach(function(measurevalue){
        //     w["arr_"+i].push(Math.round(measurevalue[queryResponse.fields.measure_like[i].name].value * 10)/10)
        //     // console.log(w["arr_"+i]);

        // });
    // }
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
        container.id = "grouped_stack";


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

            
             // Create an option for the first n rows in the query
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
            var yAxisCustom = customYAxis(config.measureaxis_0);
            console.log(yAxisCustom);

Highcharts.chart('grouped_stack', {
        chart: {
            type: 'bar',
            inverted: true
        },

        xAxis: {
            categories: dimensionvalues
        },

        plotOptions: {
            column: {
                stacking: 'normal' //add in config option for percent stacking
            }
        },

        series: [
        // first stack
            {
                data: [29.9, 71.5, 106.4, 129.2, 144.0],
                stack: 0,
                name: measurenames[0],
                tooltip: {
                    pointFormatter: function() {
                        return this.series.name ;
                    }
                }
            }, {
                data: [30, 176.0, 135.6, 148.5, 216.4],
                stack: 0,
                name: measurenames[0],
                tooltip: {
                    pointFormatter: function() {
                        return this.series.name ;
                    }
                }
            // second stack
            }, {
                data: [106.4, 129.2, 144.0, 29.9, 71.5],
                stack: 1,
                colorIndex: 0,
                name: measurenames[0],
                linkedTo: 'Cars'
            }, {
                data: [148.5, 216.4, 30, 176.0, 135.6],
                stack: 1,
                colorIndex: 1,
                name: measurenames[0],
                linkedTo: 'Trucks'
            }
        ]
    });


        this.trigger('registerOptions', options) // register options with parent page to update visConfig

        doneRendering()
    }
});
