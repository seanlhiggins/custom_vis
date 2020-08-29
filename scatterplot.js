/**
 * Welcome to the Looker Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/
const visObject = {

    create: function(element, config) {
        element.innerHTML = "";
    },

    updateAsync: function(data, element, config, queryResponse, details, doneRendering) {

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


        options = {
            legendenabled: {
                label: 'Legend',
                type: 'boolean',
                display: 'select',
                section: "Style",
                default: true,
                order: 2
            },
            legendalignment: {
                type: "string",
                section: "Style",
                display: 'select',
                label: "Title Alignment",
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
            }
        }
        Highcharts.setOptions({
            colors: ['#3EB0D5', '#B1399E', '#C2DD67', '#592EC2', '#4276BE', '#72D16D', '#FFD95F', '#B32F37', '#9174F0', '#E57947', '#75E2E2', '#FBB555']
        });
        // set the dimensions and margins of the graph
        // console.log(data, queryResponse)
        var dimensions = queryResponse.fields.dimension_like
        var measures = queryResponse.fields.measure_like


        var container = element.appendChild(document.createElement("div"));
        container.id = "container";

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

            tempobject.name = uniqueseriesnames[i]
            tempobject.data = tempdataarray
            tempobject.color = Highcharts.getOptions().colors[i]
            tempobject.marker = {symbol: '🐶'}
            dataseriesarrays.push(tempobject)
            i++
        }


        Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
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
                y: 70,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 1
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
        this.trigger('registerOptions', options)

    }
};

looker.plugins.visualizations.add(visObject);
