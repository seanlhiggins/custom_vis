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
        var seconddimensionvalues = []
       data.forEach(function(value){
        seconddimensionvalues.push(LookerCharts.Utils.textForCell(value[queryResponse.fields.dimensions[1].name]));
       });
       console.log(seconddimensionvalues);
        var dimension_head = queryResponse.fields.dimensions[0].label_short;
        var measurenames = []
       queryResponse.fields.measure_like.forEach(function(value){
        measurenames.push(value.label_short);
       });
        var pivot_title = queryResponse.fields.pivots[0].label_short;
        var pivot_length = queryResponse.pivots.length

        var pivot_list=[] // need to get from the data by 
        var measureLength = queryResponse.fields.measure_like.length
        // pivot values
        for(let i=0;i<pivot_length;i++){
            pivot_list.push([queryResponse.pivots[i].key])
        };

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

        // console.log(queryResponse,data);
       
        element.innerHTML = html;
        var container = element.appendChild(document.createElement("div"));
        container.id = "grouped_stack";
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }
        var uniqueDimensionValues = dimensionvalues.filter(onlyUnique)
        var uniqueSecondDimensionValues = seconddimensionvalues.filter(onlyUnique)
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

            
             // Create an option for the first n rows in the query, commented out for now until the final vis is fixed
             // for(let i=0;i<=1;i++){

             //        var field = queryResponse.fields.measure_like[i].label_short;
             //        id = "color_" + i
             //        options[id] =
             //        {
             //            label: field,
             //            default: Highcharts.getOptions().colors[i],
             //            section: "Pie Style",
             //            type: "string",
             //            display: "color",
             //            display_size: "half",
             //            order: 1
             //        }
             //        measChartTypeId = "charttype_" + i
             //          options[measChartTypeId] =
             //        {
             //                  type: "string",
             //                  label: field + " Style",
             //                  values: [
             //                    {"Column": "column"},
             //                    {"Line": "spline"}
             //                  ],
             //                  display: "select",
             //                  default: "column",
             //                  section: "Style",
             //                  display_size:"half",
             //                  order: 2
             //                }
             //        measAxisId = "measureaxis_" + i                    
             //        options[measAxisId] =
             //        {
             //                  type: "boolean",
             //                  label: field + " Axis",
             //                  display: "select",
             //                  default: "column",
             //                  section: "Style",
             //                  order: 3
             //                }
             //        }

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
        text: 'Stacked bar chart'
    },
    xAxis: [{
          categories: uniqueDimensionValues
      },
    {   
       categories: uniqueSecondDimensionValues 
    }],
    yAxis: {
        min: 0,
        title: {
            text: 'x-axis'
        }
    },
    legend: {
        reversed: true
    },
  plotOptions: {
    bar: {
      stacking: 'normal'
    }
  },
    series: [{
        name: 'x',
        data: firstPivotedMeasArray,
                stack: 'StackA'
    }, {
        name: 'y',
        data: secondPivotedMeasArray,
        stack: 'StackA'
        },{
        name: 'x',
        data: [3,6,11,14],
                stack: 'StackB'
    }, {
        name: 'y',
        data: [4,5,12,13],
        stack: 'StackB'
        },
        {
        name: 'y',
        data: [4,5,12,13]
        }
        ,
         {
           name: '',
           data: [0,0,0,0,0,0,0,0],
           showInLegend: false,
           stack: 'StackB',
           xAxis: 2            
        }
    ]
});


        this.trigger('registerOptions', options) // register options with parent page to update visConfig

        doneRendering()
    }
});
