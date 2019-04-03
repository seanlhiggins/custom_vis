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
            // Need to put in a conditional to check to see if the pivots
            // are even present, otherwise this will error
            var pivot_title = queryResponse.fields.pivots[0].label_short;
            
            // Pivot and measure lengths so we can use it for loops later and not go out of range
            var pivot_length = queryResponse.pivots.length
            var measureLength = queryResponse.fields.measure_like.length
            
            // pivot values
            var pivot_list=[] // need to get from the data for pivots a different way than dimensions/measures
            const firstPivotName = queryResponse.fields.pivots[0].name
            pivot_list.push(queryResponse.pivots[0].data[firstPivotName])
            const secondPivotName = queryResponse.fields.pivots[0].name
            pivot_list.push(queryResponse.pivots[1].data[secondPivotName])

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

            // Create a list of arrays that make up the pivoted data sets. 
            // To achieve the 'grouping' where the measures are grouped 
            // based on a higher dimension than the granularity
            // we jump through the data array by as many rows as the 
            // uniqueness of the 2nd dimension presents. i.e. if there's 
            // 3 unique values, then we want the 1st, 4th, 7th value
            // in a single array, 2nd 5th and 8th in the next etc.
            // Currently this works fine _if_ every single dim1:dim2 grouping
            // is a consistent ratio. However if the relationship varies
            // from 1:3 to 1:4 to 1:2 for example, the series jumping 
            // breaks. Need to do something like grab the index of 
            // each first occurence of a new unique value and use
            // _that_ as the 'jump' for each loop. THEN I need to
            // make sure I'm putting in a '0' for every missing 
            // dimension value 
            var pivot_measures_first = []
            for(let i=0; i<countUniqueSecondims;i+=1){
                var pivot_holder =[]
                for(let j=i; j<data.length;j+=countUniqueSecondims) {
                pivot_holder.push(firstPivotedMeasArray[j])
                }
                pivot_measures_first.push(pivot_holder)
            }
            console.log(pivot_measures_first);
            var pivot_measures_second = []
            for(let i=0; i<countUniqueSecondims;i+=1){
                var pivot_holder =[]
                for(let j=i; j<data.length;j+=countUniqueSecondims) {
                pivot_holder.push(secondPivotedMeasArray[j])
                }
                pivot_measures_second.push(pivot_holder)
            }
            console.log(pivot_measures_second);
            // console.log(countUniqueDims,countUniqueSecondims,pivoted_measure_skip_rows);
            Highcharts.setOptions({
                colors: ['#F62366', '#9DFF02']
            });
                    options = {
                                stackStyle: {
                                  type: "string",
                                  label: "Stack Style",
                                  values: [
                                    {"Normal": "normal"},
                                    {"Percent": "percent"}],
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
                                  default: 5,
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


    function seriesConstructor (){
        var listofseries =[];
        var i = 0;
                listofseries.push({name: uniqueSecondDimensionValues[0] +', ' + pivot_list[0],
                id: i,
                data: pivot_measures_first[0],
                color: config.color_0,
                stack: 'Stack_1'
                })
                listofseries.push({name: uniqueSecondDimensionValues[0] +', ' + pivot_list[1],
                id: i,
                data: pivot_measures_second[0],
                color: config.color_1,
                stack: 'Stack_1'
                })
                //start from 1 because the first index needs to be providing an ID for the subsequent indices to link to
        for(let i=1;i<countUniqueSecondims;i++){
                listofseries.push({name: uniqueSecondDimensionValues[i] +', ' + pivot_list[0],
                linked_to: i,
                data: pivot_measures_first[i],
                color: config.color_0,
                stack: 'Stack'+i
                })
                listofseries.push({name: uniqueSecondDimensionValues[i] +', ' + pivot_list[1],
                linked_to: i,
                data: pivot_measures_second[i],
                color: config.color_1,
                stack: 'Stack'+i
                })

            }
            return (listofseries)
            console.log(listofseries);

        // }
    }
    var newSeries = seriesConstructor();
    console.log(newSeries);

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
          xAxis: {
            categories:[{"name":uniqueDimensionValues[0],"categories":uniqueSecondDimensionValues},
            {"name":uniqueDimensionValues[1],"categories":uniqueSecondDimensionValues},
            {"name":uniqueDimensionValues[2],"categories":uniqueSecondDimensionValues},
            {"name":uniqueDimensionValues[3],"categories":uniqueSecondDimensionValues},
            {"name":uniqueDimensionValues[4],"categories":uniqueSecondDimensionValues},
            {"name":uniqueDimensionValues[5],"categories":uniqueSecondDimensionValues}
            ]
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
        series:  [{data:firstPivotedMeasArray,labels:{autoRotation: 45, style: {"fontSize": "10px"}, align: "right"}},{data:secondPivotedMeasArray,labels:{autoRotation: 45, style: {"fontSize": "10px"}, align: "right"}}]
        
    });


            this.trigger('registerOptions', options) // register options with parent page to update visConfig

            doneRendering()
        }
    });
