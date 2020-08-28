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

    
		//console.log(seriesaxis)

     let arraymalevalues = data.filter(function(users){

       return users[fieldviewnames[0]].value==uniqueseriesnames[0]})
     
			console.log(arraymalevalues)
      
		let arrayfemalevalues = data.filter(function(users){
     return users[fieldviewnames[0]].value==uniqueseriesnames[1]})
			console.log(arrayfemalevalues)
		
    var series1hcdataarray =[] 
    arraymalevalues.forEach(function(d){
    	series1hcdataarray.push(d[fieldviewnames[1]].value)
      series1hcdataarray.push(d[measurenames[0]].value)
    });
    var series2hcdataarray =[]
    arrayfemalevalues.forEach(function(d){
    	series2hcdataarray.push(d[fieldviewnames[1]].value)
      series2hcdataarray.push(d[measurenames[0]].value)
    });
    
    console.log(series1hcdataarray)
    


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
    series: [{
        name: uniqueseriesnames[1],
        color: 'rgba(223, 83, 83, .5)',
        data: series1hcdataarray

    }, {
        name: uniqueseriesnames[0],
        color: 'rgba(119, 152, 191, .5)',
        data: series2hcdataarray
    }]
});

	}
};

looker.plugins.visualizations.add(visObject);
