looker.plugins.visualizations.add({
  id: "hello_world",
  label: "Hello World",
  options: {
    font_size: {
      type: "string",
      label: "Font Test",
      values: [
        {"Large": "large"},
        {"Small": "small"}
      ],
      display: "radio",
      default: "large",
      section: "Style"    
    },
    font_align: {
      type: "string",
      label: "Font Align",
      values: [
        {"Left": "left"},
        {"Right": "right"}
      ],
      display: "radio",
      default: "large",
      section: "Style"    
    },
    textVertPosition: {
      label: 'Text Vertical Offset',
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.5,
      section: 'Value',
      type: 'number',
      display: 'range'
    },
    textSize: {
      label: 'Text Size',
      min: 0,
      max: 1,
      step: 0.01,
      default: 1,
      section: 'Value',
      type: 'number',
      display: 'range'
    },
    textColor: {
      label: 'Text Color',
      default: '#000000',
      section: 'Style',
      type: 'string',
      display: 'color'
    }
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
          color: config.textColor
        }
        .hello-world-text-left {
          text-align: left;
        }
        .hello-world-text-right {
          text-align: right;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    var container = element.appendChild(document.createElement("div"));
    container.className = "hello-world-vis";

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

    // Set the size to the user-selected size
    if (config.font_align == "left") {
      this._textElement.className = "hello-world-text-left";
    } else {
      this._textElement.className = "hello-world-text-right";
    }

  }
});
