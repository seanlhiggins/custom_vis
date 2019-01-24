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
    textLabel: {
      type: 'string',
	  label: 'Label',
	  placeholder: 'Add a label or description',
	  section: 'Style'
    }

  },
	create: function(element, config){
		element.innerHTML = `"<div id="foo">Ready to render!</div>"`;
	},
	updateAsync: function(data, element, config, queryResponse, details, doneRendering){
		var color = config.textColor;
		var textInput = config.textLabel;
		var html = `<div id="foo" style="color:${color}">${textInput}</div>`;
		for(var row of data) {
			var cell = row[queryResponse.fields.dimensions[0].name];
			html += textInput;
		}
		element.innerHTML = html;
		var str = LookerCharts.Utils.textForCell(cell);
  		document.getElementById('foo').innerHTML = str;
  		var size = config.textSize;
		document.getElementById('foo').style.fontSize = size + "px";
		document.getElementById('foo').style.textAlign = config.font_align;
		document.getElementById('foo').style.fontFamily = config.font_style;
		doneRendering()
	}
});
