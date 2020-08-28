
const visObject = {
	create: function(element, config){
	element.innerHTML = "<h1>Ready to render!</h1>";
},
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
    // set the dimensions and margins of the graph
    console.log(data);
    console.log(queryResponse);
    element.innerHTML=JSON.stringify(data) + 'data end'
    element.innerHTML+=JSON.stringify(queryResponse)
	}
};

looker.plugins.visualizations.add(visObject);
