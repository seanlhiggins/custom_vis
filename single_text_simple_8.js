looker.plugins.visualizations.add({
	id: "simple_text",
  label: "Simple Text",
  options: {

    font_align: {
      type: "string",
      label: "Font Align",
      values: [
        {"Left": "left"},
        {"Center": "center"},
        {"Right": "right"}
      ],
      display: "radio",
      default: "left",
      section: "Style"    
    },
    font_style: {
      type: "string",
      label: "Font Style",
      values: [
        {"Looker": "helvetica"},
        {"Impact": "impact"},
        {"Times New Roman": "times"}
      ],
      display: "select",
      default: "looker",
      section: "Style"    
    },

    textSize: {
      label: 'Text Size',
      min: 2,
      max: 35,
      step: .5,
      default: 7,
      section: 'Style',
      type: 'number',
      display: 'range'
    },
    textColor: {
      label: 'Text Color',
      default: '#dddddd',
      section: 'Style',
      type: 'string',
      display: 'color'
    },

  },
	create: function(element, config){
		element.innerHTML = `"<div id="foo">Ready to render!</div>"`;
	},
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
		var color = config.textColor
		element.innerHTML = html;
		// if (config.font_align == "right") {
		// var str = 'hello there';
		valueHTML = LookerCharts.Utils.htmlForCell(cell)
  		document.getElementById('foo').innerHTML = LookerCharts.Utils.htmlForCell(cell);
		var html = `<div id="foo" style="color:${color}">${valueHTML}</div>`;
		for(var row of data) {
			var cell = row[queryResponse.fields.dimensions[0].name];
			html += LookerCharts.Utils.htmlForCell(cell);
		}
		
  	// }
		doneRendering()
	}
});
