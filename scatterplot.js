/**
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

looker.plugins.visualizations.add({
    options: {
        legendenabled: {
            label: 'Legend',
            type: 'boolean',
            display: 'select',
            section: "2. Legend/Title",
            default: false,
            order: 2
        },
        hideSubtitle: {
            label: 'Hide Subtitle',
            type: 'boolean',
            display: 'select',
            section: "2. Legend/Title",
            default: false,
            order: 1
        },
        hideTitle: {
            label: 'Hide Title',
            type: 'boolean',
            display: 'select',
            section: "2. Legend/Title",
            default: false,
            order: 1
        },
        colorrange: {
            section: "1. Style",
            type: "array",
            label: "Color Range",
            display: "colors",
            default: ['#3EB0D5', '#B1399E', '#C2DD67', '#592EC2', '#4276BE', '#72D16D', '#FFD95F', '#B32F37', '#9174F0', '#E57947', '#75E2E2', '#FBB555']
        },
        pointfill: {
            label: 'Point Fill',
            type: 'boolean',
            display: 'select',
            section: "1. Style",
            default: true,
            order: 2
        },
        valueGradient: {
            label: 'Value Gradients',
            type: 'boolean',
            display: 'select',
            section: "1. Style",
            default: true,
            order: 2
        },
        gradientDirection: {
            type: "string",
            section: "1. Style",
            display: 'select',
            label: "Gradient Direction",
            values: [{
                    "Horizontal": "horizontal"
                },
                {
                    "Vertical": "vertical"
                },
            ]
        },
        pointsize: { 
            label: 'Point Size',
            min: 2,
            max: 6,
            step: .2,
            default: 3,
            section: '1. Style',
            type: 'number',
            display: 'range',
            order: 1
        },
        unpinaxis: {
            label: 'Unpin Axes from 0',
            default: true,
            type: 'boolean',
            section: "3. Axes",
            order: 3
        },
        legendalignment: {
            type: "string",
            section: "2. Legend/Title",
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
            section: "1. Style",
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
        options = {
            legendenabled: {
                label: 'Legend',
                type: 'boolean',
                display: 'select',
                section: "2. Legend/Title",
                default: false,
                order: 2
            },
            hideSubtitle: {
                label: 'Hide Subtitle',
                type: 'boolean',
                display: 'select',
                section: "2. Legend/Title",
                default: false,
                order: 1
            },
            hideTitle: {
                label: 'Hide Title',
                type: 'boolean',
                display: 'select',
                section: "2. Legend/Title",
                default: false,
                order: 1
            },
            colorrange: {
                section: "1. Style",
                type: "array",
                label: "Color Range",
                display: "colors",
                default: ['#3EB0D5', '#B1399E', '#C2DD67', '#592EC2', '#4276BE', '#72D16D', '#FFD95F', '#B32F37', '#9174F0', '#E57947', '#75E2E2', '#FBB555']
            },
            pointfill: {
                label: 'Point Fill',
                type: 'boolean',
                display: 'select',
                section: "1. Style",
                default: true,
                order: 2
            },
            valueGradient: {
                label: 'Value Gradients',
                type: 'boolean',
                display: 'select',
                section: "1. Style",
                default: true,
                order: 2
            },
            gradientDirection: {
                type: "string",
                section: "1. Style",
                display: 'select',
                label: "Gradient Direction",
                values: [{
                        "Horizontal": "horizontal"
                    },
                    {
                        "Vertical": "vertical"
                    },
                ]
            },
            pointsize: { 
                label: 'Point Size',
                min: 2,
                max: 6,
                step: .2,
                default: 3,
                section: '1. Style',
                type: 'number',
                display: 'range',
                order: 1
            },
            unpinaxis: {
                label: 'Unpin Axes from 0',
                default: true,
                type: 'boolean',
                section: "3. Axes",
                order: 3
            },
            legendalignment: {
                type: "string",
                section: "2. Legend/Title",
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
                section: "1. Style",
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
        }


        // Throw some errors and exit if the shape of the data isn't what this chart needs
        if (queryResponse.fields.dimension_like.length !== 1) {
            this.addError({
                title: "Wrong Dimensions",
                message: "This chart requires exactly 1 dimensions and 2 measures."
            });
            return;
        } else if (queryResponse.fields.measure_like.length != 2) {
            this.addError({
                title: "Wrong Measures",
                message: "This chart requires exactly 2 measures and 1 dimension."
            });
            return;
        }

        Highcharts.setOptions({
            colors: config.colorrange
        });
        // set the dimensions and margins of the graph
        var dimensions = queryResponse.fields.dimension_like
        var measures = queryResponse.fields.measure_like
        var seriesaxesvalues = []
        data.forEach(function(d) {
            seriesaxesvalues.push(d[dimensions[0].name].value)
        })

        // some placeholder for stylings that will be adjusted by users
        var xAxispin = null
        if(!config.unpinaxis){
            xAxispin = 0
        }
        var titleText = `${measures[1].label_short} vs ${measures[0].label_short}`
        if(config.hideTitle){
            titleText = ''
        }
        var subtitleText = `${data.length} rows`
        if(config.hideSubtitle){
            subtitleText = ''
        }

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
            // create an array of the x and y point values and also simultaneously get the html of each cell
            // so that the tooltips render properly based on the measure selected in Looker
            temparray.forEach(function(d) {
                let tempdata = []
                tempdata.push(d[measures[0].name].value)
                tempdata.push(d[measures[1].name].value)
                tempdataarray.push(tempdata)
                tempobject.tooltip = {pointFormat: `${measures[0].label_short}: <b>${LookerCharts.Utils.textForCell(d[measures[0].name])}</b>,
                    ${measures[1].label_short}:<b>${LookerCharts.Utils.textForCell(d[measures[1].name])}</b>`}
            })
            // need to get the max of the 2d array to apply conditional formatting per series
            var maxRow = tempdataarray.map(function(row){ return Math.max.apply(Math, row); });
            var max = Math.max.apply(null, maxRow)/2;
            tempobject.name = uniqueseriesnames[i]
            tempobject.data = tempdataarray
            
            // Highcharts has a linearGradient that can be set with stop points. 

            var singlestop = [[0,config.colorrange[0]],[1,config.colorrange[1]]]
            
            // lineargradient = x,x2,y,y2
            var linearGradientDirection = [max, 0, 0, 0]
            if(config.gradientDirection=='vertical'){
                linearGradientDirection = [0, 0, 0, max]
            }
            tempobject.color = {
                linearGradient: linearGradientDirection,
                stops: singlestop
              }

            if(!config.valueGradient){
                tempobject.color = Highcharts.getOptions().colors[i]
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
            },
            title: {
                text: titleText
            },
            subtitle: {
                text: subtitleText
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
                    text: config.xaxislabel
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                min: xAxispin
            },
            yAxis: {
                title: {
                    text: config.yaxislabel
                },
                min: xAxispin
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
                        pointFormat: `${measures[0].label_short}:<span style="color:{point.color}"> <b>{point.x}</b></span>, ${measures[1].label_short}: <b>{point.y}</b>`,
                        crosshairs: true,
                        
                    }
                }
            },

            series: dataseriesarrays,
            credits: { enabled: false}
        });
        
        options['xaxislabel'] =
        {
            type: "string",
            label: "X Axis Label",  
            section: "3. Axes",       
            placeholder: `${measures[0].label_short}`,
            default: `${measures[0].label_short}`
        }
        options['yaxislabel'] = 
        {
            type: "string",
            label: "Y Axis Label",         
            section: "3. Axes",
            placeholder: `${measures[1].label_short}`,
            default: `${measures[1].label_short}`
        }

        this.trigger('registerOptions', options)
        done()
    }
});
