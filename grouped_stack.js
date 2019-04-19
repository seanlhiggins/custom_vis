/*
Looker Vis Components:
*/
looker.plugins.visualizations.add({
 create: function(element, config) {
  element.innerHTML = "<div id='grouped_stack'></div>";
 },
 updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
  var html = `<style>
          #grouped_stack {
          margin: 0 auto;
          min-width: 310px;
          height: ${combovalueslength}px;
          font-family: 'Open Sans', Helvetica, Arial, sans-serif; 
      }
      </style>`;
  // Handle some errors
  if (queryResponse.fields.dimensions.length < 2) {
   this.addError({
    title: "Not enough Dimensions",
    message: "This chart requires exactly 2 dimensions, 1 pivot and 1 measure."
   });
   return;
  } else if (queryResponse.pivots.length == 0) {
   this.addError({
    title: "Not enough Pivots",
    message: "This chart requires exactly 2 dimensions, 1 pivot and 1 measure."
   });
   return;
  } else if (queryResponse.fields.measure_like.length == 0) {
   this.addError({
    title: "Not enough Measures",
    message: "This chart requires exactly 2 dimensions, 1 pivot and 1 measure."
   });
   return;
  }

  // Get the number of dimensions values the user has selected
  var numDimensions = data.length
  var firstnrows = data.slice(0, numDimensions);

  // A names of all the cells from the dimensions for the xaxis 
  // TODO: If there are 2 dimensions with uncommon values like this:
  //  a | 1
  //  a | 2
  //  b | 1
  //  b | 3
  //  b | 4
  // we want to have them grouped. Probably need to create a dimension
  // object or some sort of key:value per row so it can be dynamic
  // Right now it's just whatever the unique values are, and both
  // dimensions are agnostic of each other's cardinality.
  var dimensionvalues = []
  data.forEach(function(value) {
   dimensionvalues.push(LookerCharts.Utils.textForCell(value[queryResponse.fields.dimensions[0].name]));
  });

  // console.log(queryResponse,data);
  // list all the values from the second dimension chosen by the user
  var seconddimensionvalues = []
  data.forEach(function(value) {
   seconddimensionvalues.push(LookerCharts.Utils.textForCell(value[queryResponse.fields.dimensions[1].name]));
  });

  // get the first dimension's title
  var dimension_head = queryResponse.fields.dimensions[0].label_short;
  var measurenames = []
  queryResponse.fields.measure_like.forEach(function(value) {
   measurenames.push(value.label_short);
  });

  // Pivot title
  // Need to put in a conditional to check to see if the pivots
  // are even present, otherwise this will error
  // var pivot_title = queryResponse.fields.pivots[0].label_short; // unneeded now

  // Pivot and measure lengths so we can use it for loops later and not go out of range
  var pivot_length = queryResponse.pivots.length
  // var measureLength = queryResponse.fields.measure_like.length // unneeded now

  // pivot values
  var pivot_list = [] // need to get from the data for pivots a different way than dimensions/measures
  for (let i = 0; i < pivot_length; i++) {
   pivot_list.push(queryResponse.pivots[i].data[queryResponse.fields.pivots[0].name])
  }
  var pivot_list_order_by = [] // need to get from the data for pivots a different way than dimensions/measures
  for (let i = 0; i < pivot_length; i++) {
   pivot_list_order_by.push(queryResponse.pivots[i].key)
  }


  // Needed to create 2 arrays from each of the pivots. 
  // Need to have the amount of arrays created be dynamic
  // TODO: downstream of the data, the click event needs to 
  // access a link from the data object with the following structure:
  //   {
  //   y: 10,
  //   ownURL: 'http://www.google.com/search?q=pizza'
  // }
  // I'll try add a placeholder for now just to see if it works
  // I had to create 2 arrays, one for each side of the pivot. 
  // If there are 3 pivot values there's going to be an error
  // TODO: smooth this out so each value gets a new array // NOT NEEDED ANYMORE
  // TODO: find a way to pass down the pivot index
  // so the click event can be aware of which pivot array
  // to perform the callback function on i.e. this.index // NOT NEEDED ANYMORE

  var fullPivotedMeasArray = []
  var clickdataarrayobject = []
  var clickdataarrayobject2 = []
  for (let j = 0; j < pivot_length; j++) {
   var array_holder = [];
   var urlHolder;
   var halfpivot_length = pivot_length / 2;
   if (j < pivot_length / 2) {
    for (let i = 0; i < numDimensions; i++) {
     array_holder.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list_order_by[j]].value * 10) / 10);
     urlHolder =
      Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list_order_by[j]].value * 10) / 10,
      clickdataarrayobject.push(urlHolder);
    }
   } else {
    for (let i = 0; i < numDimensions; i++) {
     array_holder.push(Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list_order_by[j]].value * 10) / 10);
     urlHolder = Math.round(firstnrows[i][queryResponse.fields.measure_like[0].name][pivot_list_order_by[j]].value * 10) / 10,
      clickdataarrayobject2.push(urlHolder);
    }
   }
   fullPivotedMeasArray.push(array_holder);
  }
  console.log(clickdataarrayobject, clickdataarrayobject2);
  var consolidatedclickdataarrays = [clickdataarrayobject, clickdataarrayobject2];

  // just a function to get the sum of each arrays so user doesn't have to do Looker totals which add SQL overhead
  function getSum(total, num) {
   return total + Math.round(num);
  }
  var totals = []
  totals.push(clickdataarrayobject.reduce(getSum));
  totals.push(clickdataarrayobject2.reduce(getSum));
  console.log(totals);
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
  // create a list containing a shorter string for each value
  // because the package that renders the multiple categories shows grids that
  // are of a set length that's not possible to override which sucks...
  var uniqueSecondDimensionValuesLong = []
  for (let i = 0; i < uniqueSecondDimensionValuesLong.length; i++) {
   uniqueSecondDimensionValuesLong.push(uniqueSecondDimensionValues[i].slice(0, 10));
  }

  // Finally updated so that regardless of the cardinality of Dim1 and Dim2,
  // the groupings should reflect what the data results table shows in Looker
  // This is helpful if there are non-repeating values for dim2
  var dim1uniqueindices = []; // need to now create an actual array of indices of unique instances
  uniqueDimensionValues.forEach(function(dimvalue) {
   var index = dimensionvalues.indexOf(dimvalue)
   dim1uniqueindices.push(index);
  });
  // console.log(dim1uniqueindices);
  var finalarrayofseconddimensionlists = [];
  for (let i = 0; i < dim1uniqueindices.length; i++) {
   var j = i + 1
   var indexstart = dim1uniqueindices[i];
   var indexstop = dim1uniqueindices[j];
   var arrayholdertemp = []
   arrayholdertemp.push(seconddimensionvalues.slice(indexstart, indexstop))
   finalarrayofseconddimensionlists.push(arrayholdertemp);
  }

  // WORKING:
  var categories = [];
  for (let i = 0; i < uniqueDimensionValues.length && i < 50; i++) {
   var category = {
    "name": uniqueDimensionValues[i],
    "categories": finalarrayofseconddimensionlists[i][0],
    max: config.axisRangeMax
   };
   categories.push(category);
  };

  // Similar to above, I'm creating a dynamic length of series
  // based on the pivots and how long that list is 
  var serieslist = [];
  for (let i = 0; i < pivot_list_order_by.length; i++) {
   var configcolor = "color_" + i
   var serie = {
    name: pivot_list[i],

    data: consolidatedclickdataarrays[i],
    labels: {
     style: {
      "fontSize": config.textSize
     },
     align: "right"
    },
    color: config[configcolor]
   }
   serieslist.push(serie);
  };

  // creating a variable to help dynamically change the chart height
  // too many values means the chart gets squished when the height is
  // very low
  var combovalueslength = (uniqueDimensionValues.length * uniqueSecondDimensionValues.length) * 30;

  // put everything in the iframe's div
  element.innerHTML = html;
  var container = element.appendChild(document.createElement("div"));
  container.id = "grouped_stack";


  // Set the user options
  Highcharts.setOptions({
   colors: ['#5b3ef5', '#ff8e43']
  });
  options = {
   stackStyle: {
    type: "string",
    label: "Stack Style",
    values: [{
      "Normal": "normal"
     },
     {
      "Percent": "percent"
     }
    ],
    display: "select",
    default: "Percent",
    section: "Style",
    order: 1
   },

   dataLabelSize: {
    label: 'Data Label Size',
    min: 2,
    max: 15,
    step: .5,
    default: 8,
    section: 'Labels',
    type: 'number',
    display: 'range',
    order: 1
   },
   labelRotation: {
    type: 'string',
    label: 'Label Rotation',
    placeholder: 0,
    section: 'Labels'
   },
   groupPadding: {
    label: 'Line Padding',
    min: 0,
    max: 1,
    step: .01,
    default: .1,
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
    label: 'Legend',
    type: 'boolean',
    display: 'select',
    section: "Style",
    default: true,
    order: 2
   },
   dataLabelToggle: {
    label: 'Data Value Labels',
    type: 'boolean',
    display: 'select',
    section: "Labels",
    default: true,
    order: 1
   },
   logLinToggle: {
    type: "string",
    label: "Scale",
    values: [{
      "Linear": "linear"
     },
     {
      "Logarithmic": "logarithmic"
     },
     {
      "Date Time": "datetime"
     }
    ],
    display: "select",
    default: "Linear",
    section: "Axes",
    order: 3
   },
   labelColour: {
    label: 'Label Colour',
    section: "Labels",
    default: "#043b48",
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
   labelOffset: {
    label: 'Label Offset',
    min: -180,
    max: 180,
    step: .5,
    default: 5,
    section: 'Labels',
    type: 'number',
    display: 'range',
    order: 2
   },
   shadowToggle: {
    label: 'Shadow',
    type: 'boolean',
    display: 'select',
    section: "Style",
    default: false,
    order: 2
   },
   gridLinesToggle: {
    label: 'Category Gridlines',
    type: 'boolean',
    display: 'select',
    section: "Style",
    default: false,
    order: 2
   },
   dataGridLinesToggle: {
    label: 'Data Gridlines',
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
  for (let i = 0; i < pivot_list.length; i++) {
   var field = pivot_list[i];
   id = "color_" + i
   options[id] = {
    label: field,
    default: Highcharts.getOptions().colors[i],
    section: "Style",
    type: "string",
    display: "color",
    display_size: "half",
    order: 1
   }
  }



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
    gridLineWidth: 0,
    drawHorizontalBorders: config.gridLinesToggle,
    labels: {
     style: {
      whiteSpace: "wrap"
     },
     groupedOptions: [{
       y:config.labelOffset,
       style: {
        whiteSpace: "wrap",
        color: config.labelColour, // set a color for labels in 1st-Level  
        align: 'left',
        fontSize: config.labelSize
       },
       rotation: config.labelRotation
      },
      {
       y:config.labelOffset,
       style: {
        color: config.labelColour, // set a color for labels in 1st-Level  
        align: 'left',
        fontSize: config.labelSize
       },
       rotation: config.labelRotation
      },
      {
       y:config.labelOffset,
       style: {
        color: config.labelColour, // set a color for labels in 1st-Level  
        align: 'left',
        fontSize: config.labelSize
       },
       rotation: config.labelRotation
      }
     ],
    },

    // UPDATE: fixed. The second 'categories' is a list generated by a loop above
    categories: categories

   },
   yAxis: {
    type: config.logLinToggle,
    gridLineWidth: config.dataGridLinesToggle,
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
    labelFormatter: function() {
     return this.name;
    },
    enabled: config.legendtoggle
   },
   tooltip: {
    formatter: function(tooltip) {
     return tooltip.defaultFormatter.call(this, tooltip) +
      "Percentage: " + Math.round(this.percentage) + "% <br>" + "Total: " + this.total
    }
   },
   plotOptions: {
    series: {
     cursor: 'pointer',
     groupPadding: config.groupPadding,
     point: {
      events: {
       click: function() {
        // Since we have 2 objects in the series, one for each pivot
        // the this.series.index will select the appropriate object
        // based on the pivot value selected
        // this.index is the index within each array. So I still need
        // to address the above TODO which is to have the array be of
        // dynamic length based on those pivot values.
        // If I've 3 pivot values, my simplistic approach above will break
        // SEE LINE ~85
        var cell = data[this.index][queryResponse.fields.measures[0].name][pivot_list[this.series.index]];
        LookerCharts.Utils.openDrillMenu({
         links: cell.links,
         event: event
        });
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
      style: {
       "color": "contrast",
       "fontSize": config.dataLabelSize
      },
      formatter: function() {
       var datalabel = this.y.toString()
       // console.log(typeof datalabel);
       if (config.decimalSeparator) {
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

   series: serieslist

  });


  this.trigger('registerOptions', options) // register options with parent page to update visConfig

  doneRendering()
 }
});
