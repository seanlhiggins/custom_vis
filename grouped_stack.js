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
            height: ${combovalueslength}px;
            font-family: 'Open Sans', Helvetica, Arial, sans-serif; 
        }
        </style>`;
        // Handle some errors
        if (queryResponse.fields.dimensions.length <2) {
          this.addError({title: "Not enough Dimensions", message: "This chart requires exactly 2 dimensions, 1 pivot and 1 measure."});
          return;
        }  else if (queryResponse.pivots.length == 0){
          this.addError({title: "Not enough Pivots", message: "This chart requires exactly 2 dimensions, 1 pivot and 1 measure."});
          return;
        }   else if (queryResponse.fields.measure_like.length == 0){
          this.addError({title: "Not enough Measures", message: "This chart requires exactly 2 dimensions, 1 pivot and 1 measure."});
          return;
        }
        // Get the number of measures the user has selected
        var numMeasures = queryResponse.fields.measure_like.length;
        var numDimensions = data.length

        var firstnrows = data.slice(0,numDimensions);

       // A names of all the cells from the dimensions for the xaxis as well as labels of the measures for the pies
       var dimensionvalues = []
       data.forEach(function(value){
        dimensionvalues.push(LookerCharts.Utils.textForCell(value[queryResponse.fields.dimensions[0].name]));
       });

       console.log(queryResponse,data);
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

        for(let i=0;i<pivot_length;i++){
            pivot_list.push(queryResponse.pivots[i].data[queryResponse.fields.pivots[0].name])
        }
        var pivot_list_order_by=[] // need to get from the data for pivots a different way than dimensions/measures
        for(let i=0;i<pivot_length;i++){
            pivot_list_order_by.push(queryResponse.pivots[i].key)
        }

        // Needed to create 2 arrays from each of the pivots. 
        // Need to have the amount of arrays created be dynamic
        var firstPivotedMeasArray = [];
        var fullPivotedMeasArray =[]
        for(let j=0;j<pivot_length;j++){
            var array_holder = []
            for(let i=0;i<numDimensions;i++){
                array_holder.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list_order_by[j]].value * 10) / 10);
            }
                // console.log(firstnrows[j][queryResponse.fields.measure_like[0].name][pivot_list_order_by[0]].value);
            fullPivotedMeasArray.push(array_holder)
        }
        console.log(fullPivotedMeasArray)
        var secondPivotedMeasArray = [];
        for(let i=0;i<numDimensions;i++){
            secondPivotedMeasArray.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list_order_by[1]].value * 10) / 10)
        }
        console.log(secondPivotedMeasArray)

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
        
        // generate drill links. Work in progress. It's hard. And I suck at JS.
        /*const graph: any = {
        nodes: [],
        links: []
      }
        for (const key in data) {
          if (d[key].links) {
            d[key].links.forEach((link: Link) => { drillLinks.push(link) })
          }
        }

        graph.links.push({
          'drillLinks': drillLinks,
          'source': source,
          'target': target,
          'value': +d[measure.name].value
        })*/

        // assigning variables for the list of unique elements and counts
        var uniqueDimensionValues = dimensionvalues.filter(onlyUnique)
        var uniqueSecondDimensionValues = seconddimensionvalues.filter(onlyUnique)
        // create a list containing a shorter string for each value
        // because the package that renders the multiple categories shows grids that
        // are of a set length that's not possible to override which sucks...
        var uniqueSecondDimensionValuesLong = []
        for(let i = 0; i<uniqueSecondDimensionValuesLong.length; i++){
          uniqueSecondDimensionValuesLong.push(uniqueSecondDimensionValues[i].slice(0,10));
        }
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
        // console.log(pivot_measures_first);
        var pivot_measures_second = []
        for(let i=0; i<countUniqueSecondims;i+=1){
            var pivot_holder =[]
            for(let j=i; j<data.length;j+=countUniqueSecondims) {
            pivot_holder.push(secondPivotedMeasArray[j])
            }
            pivot_measures_second.push(pivot_holder)
        }
        // console.log(pivot_measures_second);
        // console.log(countUniqueDims,countUniqueSecondims,pivoted_measure_skip_rows);
        Highcharts.setOptions({
            colors: ['#5b3ef5', '#ff8e43']
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
                order: 1
              },

              dataLabelSize: {
                label: 'Data Label Size',
                min: 2,
                max: 15,
                step: .5,
                default: 5,
                section: 'Labels',
                type: 'number',
                display: 'range',
                order: 1
              },
              labelRotation: {
                label: 'Label Rotation',
                min: -90,
                max: 90,
                step: .5,
                default: 0,
                section: 'Labels',
                type: 'number',
                display: 'range',
                order: 2
              },
              titleSize: {
                label: 'Title Size',
                min: 2,
                max: 50,
                step: .5,
                default: 5,
                section: 'Style',
                type: 'number',
                display: 'range',
                order: 1
              },
              textLabel: {
                type: 'string',
                label: 'X Axis Title',
                placeholder: measurenames[0],
                section: 'Axes'
              },
              axisRangeMax: {
                type: 'string',
                label: 'Axis Range Max',
                placeholder: 100,
                section: 'Axes'
              },
               axisRangeMin: {
                type: 'string',
                label: 'Axis Range Min',
                placeholder: 100,
                section: 'Axes'
              },
              legendtoggle: {
                  label: 'Legend on/off',
                  type: 'boolean',
                  display: 'select',
                  section: "Style",
                  default: true,
                order: 2
              },
              dataLabelToggle: {
                  label: 'Value Labels on/off',
                  type: 'boolean',
                  display: 'select',
                  section: "Labels",
                  default: true,
                order: 1
              },
              labelColour: {
                  label: 'Label Colour',
                  section: "Labels",
                  default: "#FFFFFF",
                  type: "string",
                  display: "color",
                  display_size: "half",
                  order: 2
              },
              labelSize: {
                label: 'Label Size',
                min: 2,
                max: 15,
                step: .5,
                default: 5,
                section: 'Labels',
                type: 'number',
                display: 'range',
                order: 2
              },
              shadowToggle: {
                  label: 'Shadow on/off',
                  type: 'boolean',
                  display: 'select',
                  section: "Style",
                  default: false,
                order: 2
              },
              gridLinesToggle: {
                  label: 'Gridlines on/off',
                  type: 'boolean',
                  display: 'select',
                  section: "Style",
                  default: false,
                order: 2
              },
              decimalSeparator: {
                  label: 'Comma Separator',
                  type: 'boolean',
                  display: 'select',
                  section: "Labels",
                  default: false,
                order: 2
              },
              // not working right now
              // barOrColumn: {
              //     label: 'Reversed Axes on/off',
              //     type: 'boolean',
              //     display: 'select',
              //     section: "Axes",
              //     default: false,
              //   order: 2
              // }
            }

            
   // Create an option for all the unique values in the pivot list so each pivoted
   // value can have its own color selection
   for(let i=0;i<pivot_list.length;i++){

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

// This is no longer needed for now, it was a constructor of series of dynamic
// length, minimum 1 object up to as many different unique values for the second dimension
// were present in the data
// UPDATE created a quick loop to generate category objects to insert into a categories
// array
var categories=[];
  for(let i = 0; i < uniqueDimensionValues.length; i++){
    console.log(i);
    var category = {
          "name":uniqueDimensionValues[i],"categories":uniqueSecondDimensionValues, max: config.axisRangeMax
          };
    categories.push(category);
  };
  // Similar to above, I'm creating a dynamic length of series
  // based on the pivots and how long that list is 
  var serieslist = [];
    for(let i = 0; i < pivot_list_order_by.length; i++){
      var configcolor = "color_" + i

      var serie = {name: pivot_list[i],
          data:fullPivotedMeasArray[i],
          labels:{
          style: {"fontSize": config.textSize}, 
          align: "right"},
          color: config[configcolor]}
          serieslist.push(serie);
          console.log(configcolor);
    };

    // creating a variable to help dynamically change the chart height
    // too many values means the chart gets squished when the height is
    // very low
    var combovalueslength = (uniqueDimensionValues.length * uniqueSecondDimensionValues.length) * 30;
  console.log(serieslist);
// console.log(categories);
Highcharts.chart('grouped_stack', {
    chart: {
        type: 'bar',
        height: combovalueslength
    },
    // disabling title because the Y Axis will have a custom label
    title: {
            text: undefined,
            style: {
                fontSize: config.titleSize,
                color: config.color_2
            }
            },
      xAxis: {
            drawHorizontalBorders: config.gridLinesToggle,
        labels: {formatter: function(){
          return this.value;
        },
            groupedOptions: [{
                style: {
                    color: config.labelColour, // set a color for labels in 1st-Level  
                    align: 'left',
                    fontSize: config.labelSize
                },
                rotation: config.labelRotation
            }, {
                style:{
                  color: config.labelColour,
                  align: 'left',
                  fontSize: config.labelSize
              },
              style:{
                  color: config.labelColour,
                  align: 'left'},
                rotation: config.labelRotation // rotate labels for a 2nd-level, doesn't seem to work
            }],
             // rotation: config.labelRotation // 0-level options aren't changed, use them as always
        },
        // need an array of categories which are objects, each containing a name
        // which replaces the index of each category. We assign the 
        // unique values in the first dimension to those names
        // then there are categories within each object which are arrays,
        // which are assigned the full array of unique values from the second dimension
        // this way each new value for the 1st dim gets the full list of values from
        // the 2nd dim. The formatting is set in the labels and groupOptions above.
        // I've just set 5 categories for now as it is unlikely more than 5
        // is really needed. I'll make it dynamic soon. 
        // UPDATE: fixed. The second 'categories' is a list generated by a loop above
        categories:categories
        
    },
    yAxis: {
        max: config.axisRangeMax,
        min: config.axisRangeMin,
        title: {
        enabled: true,
        text: config.textLabel,
        style: {
            fontWeight: 'normal'
        },
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
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
                // location.href = "/explore/ecommerce/order_items?fields=users.id,users.last_name,users.first_name,orders.count&f[orders.status]=pending&f[users.age_tier]=85+or+Above&f[users.gender]=f&limit=500"
                window.open('/explore/ecommerce/order_items?fields=users.id,users.last_name,users.first_name,orders.count&f[orders.status]=pending&f[users.age_tier]=85+or+Above&f[users.gender]=f&limit=500','_parent');
            }
          }
        }
        },
      bar: {
          stacking: config.stackStyle,
          grouping: config.groupToggle,
          shadow: config.shadowToggle,
          dataLabels: {
            enabled: config.dataLabelToggle,
            style:{
                "color": "contrast", 
                "fontSize": config.dataLabelSize 
                },
            formatter: function(){
              var datalabel = this.y.toString()
              console.log(typeof datalabel);
              if(config.decimalSeparator){
                datalabel = datalabel.replace(".", ",");
              }
              return datalabel;
            }
        }
      }
    },
    credits: {
        enabled: false
    },
    // Need to clean up this series generation so that it dynamically creates
    // as many series combinations as there are rows for the second dimension
    // Right now, just stopping at 3 since that seems like a logical grouping
    // limit. 
    series:  serieslist
    
});


        this.trigger('registerOptions', options) // register options with parent page to update visConfig

        doneRendering()
    }
  });
