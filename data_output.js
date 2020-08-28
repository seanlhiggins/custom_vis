
const visObject = {
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
    // set the dimensions and margins of the graph
    console.log(data);
    console.log(queryResponse);
	}
};

looker.plugins.visualizations.add(visObject);
