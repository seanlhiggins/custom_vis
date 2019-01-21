looker.plugins.visualizations.add({
  id: "single_text",
  label: "Single Text",
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
   
  // Set up the initial state of the visualization
  create: function(element, config) {

    // Insert a <style> tag with some styles we'll use later.
    var css = element.innerHTML = `
      <style>
        .hello-world-vis {
          /* Vertical centering */
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          font-family: Arial, Helvetica, sans-serif
        }
        a:link {
          color: red;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    var container = element.appendChild(document.createElement("div"));
    container.className = "hello-world-vis";
    container.id = "txt01"
    // Create an element to contain the text.
    this._textElement = container.appendChild(document.createElement("div"));

  },
  // Render in response to the data or settings changing
  update: function(data, element, config, queryResponse) {

    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
      return;
    }

    // Grab the first cell of the data
    var firstRow = data[0];
    var firstCell = firstRow[queryResponse.fields.dimensions[0].name];

    // Insert the data into the page
    this._textElement.innerHTML = LookerCharts.Utils.htmlForCell(firstCell);
    // this.set css attr font-size: 

    // Set the size to the user-selected size
    if (config.font_align == "right") {
      document.getElementById("txt01").style.textAlign = "right";
    } else if (config.font_align == "center") {
      document.getElementById("txt01").style.textAlign = "center";
    } else {
      document.getElementById("txt01").style.textAlign = "left";
    }

    var size = config.textSize;
    document.getElementById("txt01").style.fontSize = size + "px";

    document.getElementById("txt01").style.color = config.textColor;
    document.getElementById("txt01").a.style.color = config.textColor;

    if (config.font_style == "times") {
      document.getElementById("txt01").style.fontFamily = "Times New Roman, serif";
    } else if (config.font_style == "impact") {
      document.getElementById("txt01").style.fontFamily = "Impact,Charcoal,sans-serif";
    } else {
      document.getElementById("txt01").style.fontFamily = "Open Sans, Helvetica, Arial, sans-serif";
    }

    ;
  }
});
