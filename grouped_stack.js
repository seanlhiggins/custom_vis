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

     



           // A names of all the cells from the dimensions for the xaxis as well as labels of the measures for the pies
           var dimensionvalues = []
           data.forEach(function(value){
            dimensionvalues.push(LookerCharts.Utils.textForCell(value[queryResponse.fields.dimensions[0].name]));
           });

           // list all the values from the second dimension chosen by the user
            var seconddimensionvalues = []
           data.forEach(function(value){
            seconddimensionvalues.push(LookerCharts.Utils.textForCell(value[queryResponse.fields.dimensions[1].name]));
           });
           
           // get the first dimension's title
            var dimension_head = queryResponse.fields.dimensions[0].label_short;
            var measurenames = []
           queryResponse.fields.measure_like.forEach(function(value){
            measurenames.push(value.label_short);
           });

            // Pivot title
            var pivot_title = queryResponse.fields.pivots[0].label_short;
            
            // Pivot and measure lengths so we can use it for loops later and not go out of range
            var pivot_length = queryResponse.pivots.length
            var measureLength = queryResponse.fields.measure_like.length
            
            // pivot values
            var pivot_list=[] // need to get from the data for pivots a different way than dimensions/measures
            for(let i=0;i<pivot_length;i++){
                pivot_list.push([queryResponse.pivots[i].key])
            };
            // This is a bit unnecessary but I hadn't time to fix it. 
            // Basically an order_by_field introduces some pipes to the 
            // key of the pivot. There's a way to get the actual
            // value from the queryResponse which I'll have to do later
            var pivot_list_clean=[]
            for(let i=0;i<pivot_length;i++){
                pivot_list_clean.push([queryResponse.pivots[i].key.split("|",1)])
            };

            // Needed to create 2 arrays from each of the pivots
            var firstPivotedMeasArray = [];
            for(let i=0;i<numDimensions;i++){
                firstPivotedMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list[0]].value * 10) / 10)
            }

            var secondPivotedMeasArray = [];
            for(let i=0;i<numDimensions;i++){
                secondPivotedMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list[1]].value * 10) / 10)
            }

           // just a function to get the sum of each arrays so user doesn't have to do Looker totals which add SQL overhead
            function getSum(total, num) {
              return total + Math.round(num);
            }


           
            element.innerHTML = html;
            var container = element.appendChild(document.createElement("div"));
            container.id = "grouped_stack";

            // two simple functions that will return only the unique elements
            // in an array, then another to count them. I did this so
            // when a user selects 2 dimensions, we can use the count to 
            // offset the loop by that amount so each iteration jumps
            // through the array and creates a new array using that index's value
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }
            function countUnique(iterable) {
             return new Set(iterable).size;
            }

            // assigning variables for the list of unique elements and counts
            var uniqueDimensionValues = dimensionvalues.filter(onlyUnique)
            var uniqueSecondDimensionValues = seconddimensionvalues.filter(onlyUnique)
            var countUniqueDims = countUnique(dimensionvalues);
            var countUniqueSecondims = countUnique(seconddimensionvalues);

            // Need to create a better approach for this. Looping through
            // each of the pivoted arrays to skip through and find the Nth 
            // element based on a count of the unique elements in another array
            // is awful. It works but then it's hardcoded. I
            // should be dynamically creating new arrays for however long 
            // the data is

            // first pivoted array starting from index 0
            var pivoted_measure_skip_rows = []
            for(let j=0; j<data.length;j+=countUniqueSecondims){
                pivoted_measure_skip_rows.push(firstPivotedMeasArray[j])
            }
            var pivoted_second_measure_skip_rows = []
            for(let j=0; j<data.length;j+=countUniqueSecondims){
                pivoted_second_measure_skip_rows.push(secondPivotedMeasArray[j])
            }
            // second pivoted array starting from index 1
            var pivoted_measure_skip_rows_1 = []
            for(let j=1; j<data.length;j+=countUniqueSecondims){
                pivoted_measure_skip_rows_1.push(firstPivotedMeasArray[j])
            }
            var pivoted_second_measure_skip_rows_1 = []
            for(let j=1; j<data.length;j+=countUniqueSecondims){
                pivoted_second_measure_skip_rows_1.push(secondPivotedMeasArray[j])
            }
              // third pivoted array starting from index 2
            var pivoted_measure_skip_rows_2 = []
            for(let j=2; j<data.length;j+=countUniqueSecondims){
                pivoted_measure_skip_rows_2.push(firstPivotedMeasArray[j])
            }
            var pivoted_second_measure_skip_rows_2 = []
            for(let j=2; j<data.length;j+=countUniqueSecondims){
                pivoted_second_measure_skip_rows_2.push(secondPivotedMeasArray[j])
            }
            console.log(countUniqueDims,countUniqueSecondims,pivoted_measure_skip_rows);
            Highcharts.setOptions({
                colors: ['#F62366', '#9DFF02']
            });
                    options = {
                                stackStyle: {
                                  type: "string",
                                  label: "Stack Style",
                                  values: [
                                    {"Normal": "normal"},
                                    {"Percent": "percent"}                              ],
                                  display: "select",
                                  default: "percent",
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

                
                 // Create an option for all the unique values in the pivot list so each pivoted
                 // value can have its own color selection
                 for(let i=0;i<=pivot_list.length;i++){

                        var field = pivot_list[i];
                        id = "color_" + i
                        options[id] =
                        {
                            label: field,
                            default: Highcharts.getOptions().colors[i],
                            section: "Style",
                            type: "string",
                            display: "color",
                            display_size: "half",
                            order: 1
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
    console.log(queryResponse,data);

    Highcharts.chart('grouped_stack', {
        chart: {
            type: 'bar'
        },
        title: {
                text: dimension_head,
                style: {
                    fontSize: config.textSize,
                    color: config.color_0
                }
                },
           xAxis: [{
                    opposite: false,
                    categories: uniqueDimensionValues
                },{
                    opposite: false,
                    categories: uniqueSecondDimensionValues
                }],
        yAxis: {
            min: 0,
            title: {
                text: measurenames[0]
            }
        },
        legend: {
            reversed: true,
            labelFormatter: function () {
                return this.name;
            },
            enabled: config.legendtoggle
        },
        plotOptions: {
            bar: {
              stacking: config.stackStyle
            }
        },
        credits: {
            enabled: false
        },
        // Need to clean up this series generation so that it dynamically creates
        // as many series combinations as there are rows for the second dimension
        // Right now, just stopping at 5 since that seems like a logical grouping
        // limit. 
        series: [{
            name: uniqueSecondDimensionValues[0] +', ' + pivot_list_clean[0],
            id: '0',
            data: pivoted_measure_skip_rows,
            color: config.color_0,
            stack: 'StackA'
        }, {
            id: '1',
            name: uniqueSecondDimensionValues[0] +', ' + pivot_list_clean[1],
            color: config.color_1,
            data: pivoted_second_measure_skip_rows,
            stack: 'StackA'
            },{
            linked_to: '0',
            name: uniqueSecondDimensionValues[1] +', ' + pivot_list_clean[0],
            color: config.color_0,
            data: pivoted_measure_skip_rows_1,
                    stack: 'StackB'
        }, {
            linked_to: '1',
            name: uniqueSecondDimensionValues[1] +', ' + pivot_list_clean[1],
            color: config.color_1,
            data: pivoted_second_measure_skip_rows_1,
            stack: 'StackB'
            },
            {
            linked_to: '0',
            name: uniqueSecondDimensionValues[2] +', ' + pivot_list_clean[0],
            color: config.color_0,
            data: pivoted_measure_skip_rows_2,
            stack: 'StackC'
            },
            {
            linked_to: '1',
            name: uniqueSecondDimensionValues[2] +', ' + pivot_list_clean[1],
            color: config.color_1,
            data: pivoted_second_measure_skip_rows_2,
            stack: 'StackC'
            },
            {
            linked_to: '0',
            name: uniqueSecondDimensionValues[3] +', ' + pivot_list_clean[0],
            color: config.color_0,
            data: pivoted_measure_skip_rows_2,
            stack: 'StackD'
            },
            {
            linked_to: '1',
            name: uniqueSecondDimensionValues[3] +', ' + pivot_list_clean[1],
            color: config.color_1,
            data: pivoted_second_measure_skip_rows_2,
            stack: 'StackD'
            },
            {
            linked_to: '0',
            name: uniqueSecondDimensionValues[4] +', ' + pivot_list_clean[0],
            color: config.color_0,
            data: pivoted_measure_skip_rows_2,
            stack: 'StackE'
            },
            {
            linked_to: '1',
            name: uniqueSecondDimensionValues[4] +', ' + pivot_list_clean[1],
            color: config.color_1,
            data: pivoted_second_measure_skip_rows_2,
            stack: 'StackE'
            }
        ]
    });


            this.trigger('registerOptions', options) // register options with parent page to update visConfig

            doneRendering()
        }
    });
