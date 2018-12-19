looker.plugins.visualizations.add({
  id: "hello_world",
  label: "Hello World",
  options: {
    font_size: {
      type: "string",
      label: "Font Size",
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
    },
    colorPreSet:
    {
      type: 'string',
      display: 'select',
      label: 'Color Range',
      section: 'Data',
      values: [{'Custom': 'c'},
      {'Tomato to Steel Blue': '#F16358,#DF645F,#CD6566,#BB666D,#A96774,#97687B,#856982,#736A89,#616B90,#4F6C97,#3D6D9E'},
      {'Pink to Black': '#170108, #300211, #49031A, #620423, #79052B, #910734, #AA083D, #C30946, #DA0A4E, #F30B57, #F52368, #F63378, #F63C79, #F75389, #F86C9A, #F985AB, #FB9DBC, #FCB4CC, #FDCDDD, #FEE6EE'},
      {'Green to Red': '#7FCDAE, #7ED09C, #7DD389, #85D67C, #9AD97B, #B1DB7A, #CADF79, #E2DF78, #E5C877, #E7AF75, #EB9474, #EE7772'},
      {'White to Green': '#ffffe5,#f7fcb9 ,#d9f0a3,#addd8e,#78c679,#41ab5d,#238443,#006837,#004529'}],
       default: 'c',
      order: 1
    },
    colorRange: {
      type: 'array',
      label: 'Custom Color Ranges',
      section: 'Data',
      order: 2,
      placeholder: '#fff, red, etc...'
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
          color: green;
        }
        .hello-world-text-left {
          text-align: left;
        }
        .hello-world-text-right {
          text-align: right;
        }
        .hello-world-text-large {
          font-size: 72px;
        }
        .hello-world-text-small {
          font-size: 36px;
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
      document.getElementById("hello-world-vis").style.textAlign = "left";
    } else {
      document.getElementById("hello-world-vis").style.textAlign = "right";
    }
    // if (config.font_size == "large") {
    //   this._textElement.innerHTML += "font-size: 72px";
    // } else {
    //   this._textElement.innerHTML += "font-size: 36px";
    // }
    // if (settings.colorPreSet  == 'c') {
    //   var colorSettings =  settings.colorRange || ['white','green','red']; // put a default in
    // } else {
    //   var colorSettings =  settings.colorPreSet.split(",");
    // }
    ;

  }
});
