(function() {
  var viz = {
    id: "highcharts_arearange",
    label: "Arearange",
    options: {
      chartName: {
        section: "Chart",
        label: "Chart Name",
        type: "string",
      },
      color_range: {
        type: "array",
        label: "Color Range",
        display: "colors",
        default: ["#dd3333", "#80ce5d", "#f78131", "#369dc1", "#c572d3", "#36c1b3", "#b57052", "#ed69af"],
      },
      xAxisName: {
        label: "Axis Name",
        section: "X",
        type: "string",
        placeholder: "Provide an axis name ..."
      },
      yAxisName: {
        label: "Axis Name",
        section: "Y",
        type: "string",
        placeholder: "Provide an axis name ..."
      },
      yAxisMinValue: {
        label: "Min value",
        default: null,
        section: "Y",
        type: "number",
        placeholder: "Any number",
        display_size: "half",
      },
      yAxisMaxValue: {
        label: "Max value",
        default: null,
        section: "Y",
        type: "number",
        placeholder: "Any number",
        display_size: "half",
      },
    },
    // Set up the initial state of the visualization
    create: function(element, config) {
      element.innerHTML = ""
    },
    // Render in response to the data or settings changing
    update: function(data, element, config, queryResponse) {
      if (!handleErrors(this, queryResponse, {
        min_pivots: 0, max_pivots: 0,
        min_dimensions: 1, max_dimensions: 1,
        min_measures: 2, max_measures: 2,
      })) return;

      let dim = queryResponse.fields.dimension_like[0]
      let measures = queryResponse.fields.measure_like

      let categories = []
      let series = []
      data.forEach(function(datum) {
        let point = []

        if (dim.is_timeframe) {
          let date = datum[dim.name]["value"]
          switch(dim.field_group_variant) {
            case "Month":
            case "Quarter":
              date = date + "-01"
              break;
            case "Year":
              date = date + "-01-01"
              break;
          }
          dateVal = Date.UTC.apply(Date, date.split(/\D/))
          point.push(dateVal)
        } else if (dim.is_numeric) {
          point.push(datum[dim.name]["value"])
        } else {
          categories.push(datum[dim.name]["rendered"] ?
          datum[dim.name]["rendered"] :
          datum[dim.name]["value"])
        }

        measures.forEach(function(m) {
          point.push(datum[m.name]["value"])
        })

        series.push(point)
      })

      function unique(value, index, self) {
        return self.indexOf(value) === index;
      }

      let field_group_labels = measures.map(function(m) { return m.field_group_label})
      let field_group_label = field_group_labels.filter(unique)[0] // first. yolo

      let xAxisLabel = config.xAxisName ?
        config.xAxisName :
        dim.label_short ?
          dim.label_short :
          dim.label

      let yAxisLabel = config.yAxisName ?
        config.yAxisName :
        field_group_label ?
          field_group_label :
          measures[0].label_short ?
            measures[0].label_short :
            measures[0].label

      let options = {
          colors: config.color_range,
          credits: {
            enabled: false
          },
          chart: {
            type: "arearange",
            zoomType: "x"
          },
          title: {text: config.chartName},
          legend: {enabled: false},

          xAxis: {
            type: dim.is_timeframe ? "datetime" : null,
            title: {
              text: xAxisLabel
            }
          },

          yAxis: {
            min: config.yAxisMinValue,
            max: config.yAxisMaxValue,
            title: {
              text: yAxisLabel,
            }
          },

          tooltip: {
            crosshairs: true,
            shared: true,
          },

          series: [{
            name: yAxisLabel,
            data: series,
          }],
      };
      if (categories.length > 0) {
        options["xAxis"]["categories"] = categories
      }

      let myChart = Highcharts.chart(element, options);
    }
  };
  looker.plugins.visualizations.add(viz);
}());
