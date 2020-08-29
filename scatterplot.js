/**
 * Welcome to the Looker Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

const visObject = {
 /**
  * Configuration options for your visualization. In Looker, these show up in the vis editor
  * panel but here, you can just manually set your default values in the code.
  **/
  
 
 /**
  * The create function gets called when the visualization is mounted but before any
  * data is passed to it.
  **/
	create: function(element, config){
		element.innerHTML = "Scatterplot";
 

	},

 /**
  * UpdateAsync is the function that gets called (potentially) multiple times. It receives
  * the data and should update the visualization with the new data.
  **/
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){

    Highcharts.setOptions({
        colors: ['#3EB0D5', '#B1399E', '#C2DD67', '#592EC2', '#4276BE', '#72D16D', '#FFD95F', '#B32F37', '#9174F0', '#E57947', '#75E2E2', '#FBB555']
    });
    // set the dimensions and margins of the graph
    console.log(data, queryResponse)
		var fieldnamesfriendly = []
    queryResponse.fields.dimension_like.forEach(function(value) {
     fieldnamesfriendly.push(value.label_short);
     
    });
    		var measurenamesfriendly = []
    queryResponse.fields.measure_like.forEach(function(value) {
     measurenamesfriendly.push(value.label_short);
     
    });
   	var fieldviewnames = []
    queryResponse.fields.dimension_like.forEach(function(value) {
     fieldviewnames.push(value.name);
    });
		var measurenames = []
      queryResponse.fields.measure_like.forEach(function(value) {
     measurenames.push(value.name);
    });
    console.log(measurenames)
   	var container = element.appendChild(document.createElement("div"));
  	container.id = "container";
    var hcstructureddata = []
		
//    var seriesaxis = data[0][fieldviewnames[0]].value
    var seriesaxesvalues =[]
    data.forEach(function(d) {
      seriesaxesvalues.push(d[fieldviewnames[0]].value)

})
    
    function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

    // usage example:
    var uniqueseriesnames = seriesaxesvalues.filter( onlyUnique ); 

    // for N number of values in the first series, create an array of data objects of N length for the HC series vis object
    // e.g. if the first dimension is 2 values, there'll be 2 arrays of data, 3 values = 3 arrays etc.
    // e.g. [{user.gender: {value: 'Male'}, user.age: {value: 18}, user.lifetime_revenue: {value: 100}},
    //       {user.gender: {value: 'Male'}, user.age: {value: 18}, user.lifetime_revenue: {value: 100}}, ]
    var dataseriesarrays =[]
    i = 0
    while (i<uniqueseriesnames.length){
        let tempobject = {}
        //{
    //     name: uniqueseriesnames[0],
    //     color: 'rgba(119, 152, 191, .5)',
    //     data: series2hcdataarray
    // }

        let temparray = data.filter(function(users){
        return users[fieldviewnames[0]].value==uniqueseriesnames[i]})
        //dataseriesarrays.push(temparray)
        console.log(temparray)
        let tempdataarray = []
        temparray.forEach(function(d){
            let tempdata = []
            tempdata.push(d[fieldviewnames[1]].value)
            tempdata.push(d[measurenames[0]].value)
            tempdataarray.push(tempdata)
        })
        console.log(tempdataarray)
        tempobject.name = uniqueseriesnames[i]
        tempobject.data = tempdataarray
        tempobject.color = Highcharts.getOptions().colors[i]
        dataseriesarrays.push(tempobject)
        i++
    } 
  
    console.log(dataseriesarrays)

    Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: `${fieldnamesfriendly[1]} vs ${measurenamesfriendly[0]}`
    },
    subtitle: {
        text: `${data.length} rows`
    },

    xAxis: {
        title: {
            enabled: true,
            text: `${fieldnamesfriendly[1]}`
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: `${measurenamesfriendly[0]}`
        }
    },
    legend: {
        layout: 'vertical',
        align: 'left',
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

	}
};

looker.plugins.visualizations.add(visObject);
