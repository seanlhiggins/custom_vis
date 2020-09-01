/**
 * Welcome to the Looker Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

looker.plugins.visualizations.add({

    options : {
        legendenabled: {
            label: 'Legend',
            type: 'boolean',
            display: 'select',
            section: "Style",
            default: true,
            order: 2
        },
        color_range: {
            section: "Style",
            type: "array",
            label: "Color Range",
            display: "colors"
        },
        pointfill: {
            label: 'Point Fill',
            type: 'boolean',
            display: 'select',
            section: "Style",
            default: true,
            order: 2
        },
        valueGradient: {
            label: 'Value Gradients',
            type: 'boolean',
            display: 'select',
            section: "Style",
            default: false,
            order: 2
        },
        sharedgradient: {
            label: 'Single Gradient',
            type: 'boolean',
            display: 'select',
            section: "Style",
            default: false,
            order: 2
        },
        pointsize: { 
            label: 'Point Size',
            min: 2,
            max: 6,
            step: .2,
            default: 3,
            section: 'Style',
            type: 'number',
            display: 'range',
            order: 1
        },
        legendalignment: {
            type: "string",
            section: "Style",
            display: 'select',
            label: "Legend Alignment",
            values: [{
                    "Left": "left"
                },
                {
                    "Right": "right"
                },
                {
                    "Centre": "center"
                }
            ]
        },
        //'circle', 'square','diamond', 'triangle' and 'triangle-down'
        symbolselect: {
            type: "string",
            section: "Style",
            display: 'select',
            label: "Marker Symbol",
            default: 'circle',
            values: [{
                    "Circle": "circle"
                },
                {
                    "Square": "square"
                },
                {
                    "Diamond": "diamond"
                },
                {
                    "Triangle": "triangle"
                },
                {
                    "Triangle-Down": "triangle-down"
                }
            ]
    }
    },
    create: function(element, config) {
        element.innerHTML = "";
        var container = element.appendChild(document.createElement("div"));
        container.id = "container";
        this._fontsReady = document.fonts.ready
    },

         
    updateAsync: function(data, element, config, queryResponse, details, done) {

        // Clear any errors from previous updates
        this.clearErrors();

        // Throw some errors and exit if the shape of the data isn't what this chart needs
        if (queryResponse.fields.dimension_like.length !== 2) {
            this.addError({
                title: "Wrong Dimensions",
                message: "This chart requires exactly 2 dimensions and 1 measure."
            });
            return;
        } else if (queryResponse.fields.measure_like.length != 1) {
            this.addError({
                title: "Wrong Measures",
                message: "This chart requires exactly 1 measure and 2 dimensions."
            });
            return;
        }


   

        Highcharts.setOptions({
            colors: config.color_range
        });
        // set the dimensions and margins of the graph
        // console.log(data, queryResponse)
        var dimensions = queryResponse.fields.dimension_like
        var measures = queryResponse.fields.measure_like

        console.log(config.color_range)

        var seriesaxesvalues = []
        data.forEach(function(d) {
            seriesaxesvalues.push(d[dimensions[0].name].value)
        })

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        // usage example:
        var uniqueseriesnames = seriesaxesvalues.filter(onlyUnique);

        // for N number of values in the first series, create an array of data objects of N length for the HC series vis object
        // e.g. if the first dimension is 2 values, there'll be 2 arrays of data, 3 values = 3 arrays etc.
        // e.g. [{user.gender: {value: 'Male'}, user.age: {value: 18}, user.lifetime_revenue: {value: 100}},
        //       {user.gender: {value: 'Male'}, user.age: {value: 18}, user.lifetime_revenue: {value: 100}}, ]
        var dataseriesarrays = []
        i = 0
        while (i < uniqueseriesnames.length) {
            let tempobject = {}
            //{
            //     name: uniqueseriesnames[0],
            //     color: 'rgba(119, 152, 191, .5)',
            //     data: [[11,22],[33,44]]
            //         marker: {
            //          symbol: 'triangle'
            //                }
            // }

            let temparray = data.filter(function(users) {
                return users[dimensions[0].name].value == uniqueseriesnames[i]
            })


            let tempdataarray = []
            temparray.forEach(function(d) {
                let tempdata = []
                tempdata.push(d[dimensions[1].name].value)
                tempdata.push(d[measures[0].name].value)
                tempdataarray.push(tempdata)
            })
            // need to get the max of the 2d array to apply conditional formatting per series
            var maxRow = tempdataarray.map(function(row){ return Math.max.apply(Math, row); });
            var max = Math.max.apply(null, maxRow);
            console.log(max)
            tempobject.name = uniqueseriesnames[i]
            tempobject.data = tempdataarray
            
            // Highcharts has a linearGradient that can be set with stop points. 
            // If you want each series to have its own colour gradient, we need
            // to first create a set of ranges for each colour.
            var redstops = [[0.00, '#FFE402'],
            [0.50, '#FE5F02'],
            [1.00, '#CB0033']]
            var bluestops = [[0.00, '#C6FFDD'],
            [0.50, '#FBD786'],
            [1.00, '#F7797D']]
            var greenstops = [[0.00, '#FEFE69'],
            [0.50, '#A9F36A'],
            [1.00, '#57E86B']]
            var brownstops = [[0.00, '#F4E8D2'],
            [0.50, '#9D7168'],
            [1.00, '#392728']]
            var purplestops = [[0.00, '#F4A3EA'],
            [0.50, '#1677C5'],
            [1.00, '#2C1171']]
            var singlestop = [[0,'#b92b27'],[1,'#1565C0']]
            var stopsseries = [redstops,greenstops,bluestops,brownstops,purplestops]

            tempobject.color = {
                linearGradient: [0, 0, 0, 400],
                stops: 
                stopsseries[i]
                
              }
            if(!config.valueGradient){
                tempobject.color = config.color_range[i]
            }
            if(config.sharedgradient){
                tempobject.color.stops = singlestop
            }
            let colourfill = '#FFFFFF'
            if(config.pointfill){
                colourfill = tempobject.color
            }
            tempobject.marker = {symbol: config.symbolselect,
                fillColor: colourfill,
                lineWidth: 2,
                radius: config.pointsize,
                lineColor: null // inherit from series}
                }
            dataseriesarrays.push(tempobject)
            i++
        }


        Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                // events: {
                //     load: function() {
                //       var chart = this,
                //       yAxis = chart.yAxis[0];
                //       xAxis = chart.xAxis[0];
                //       console.log(this)
                //         var colorgradient =  {
                //             linearGradient: [xAxis.min, 0, xAxis.max, 0]
                //           }
  
            
                //       chart.update({
                //         plotOptions: {
                //           series: {
                //             color: colorgradient
                //           }
                //         }
                //       });
                //     }
                //   }
            },
            title: {
                text: `${dimensions[1].label_short} vs ${measures[0].label_short}`
            },
            subtitle: {
                text: `${data.length} rows`
            },
            exporting: {
                enabled: false
            },
            style: {
                fontFamily: 'Helvetica'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: `${dimensions[1].label_short}`
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                min: 0 
            },
            yAxis: {
                title: {
                    text: `${measures[0].label_short}`
                }
            },
            legend: {
                layout: 'vertical',
                enabled: config.legendenabled,
                align: config.legendalignment,
                verticalAlign: 'top',
                x: 100,
                y: 40,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 0
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x}, {point.y} '
                    }
                }
            },
            series: dataseriesarrays
        });
        this._fontsReady.then(done);
    }
});
