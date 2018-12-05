looker.plugins.visualizations.add({
  id: "matrix",
  label: "Matrix",
  options: {
    color_range: {
      type: "array",
      label: "Color Range",
      display: "colors",
      default: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
    },
    logarithmicScale: {
      label: "Logarithmic",
      type: "boolean",
      default: true,
      display_size: "half",
      order: 0,
    },
  },
  // Set up the initial state of the visualization
  create: function(element, config) {
    let css = element.innerHTML = `
      <style>
      .axis path {
        display: none;
      }
      rect {
        opacity: 0.9;
      }
      .x.axis text {
        cursor: ns-resize;
      }
      .y.axis text {
        cursor: ew-resize;
      }
      </style>
    `;

    this._svg = d3v4.select(element).append("svg");
  },
  // Render in response to the data or settings changing
  update: function(data, element, config, queryResponse) {
    if (!handleErrors(this, queryResponse, {
      min_pivots: 0, max_pivots: 0,
      min_dimensions: 2, max_dimensions: 2,
      min_measures: 1, max_measures: 1,
    })) return;
    let d3 = d3v4;

    let margin = {top: 100, right: 10, bottom: 10, left: 200};
    let width = element.clientWidth - margin.left - margin.right;
    let height = element.clientHeight - margin.top - margin.bottom;

    let size = Math.min(width,height);

    let svg = this._svg
        .html("")
        .attr("width", element.clientWidth)
        .attr("height", element.clientHeight)
      .append("g")
        .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

    let dimension1 = queryResponse.fields.dimension_like[0];
    let dimension2 = queryResponse.fields.dimension_like[1];
    let measure = queryResponse.fields.measure_like[0];

    let field_accessor = function(field) { return function(d) { return d[field.name].value }}
    let dimension1_accessor = field_accessor(dimension1);
    let dimension2_accessor = field_accessor(dimension2);
    let measure_accessor = field_accessor(measure);
    let formatted_measure_accessor = function(d) { return formatType(measure.value_format)(measure_accessor(d)) }

    let colorScale = config.logarithmicScale ? d3.scaleLog() : d3.scaleLinear();

    let measureExtent = d3.extent(data, measure_accessor);

    let color = colorScale
      .domain(measureExtent)
      .range(config.color_range);

    let dimset1 = d3.set();
    let dimset2 = d3.set();

    data.forEach(function(d) {
      dimset1.add(dimension1_accessor(d));
      dimset2.add(dimension2_accessor(d));
    });

    let yscale = d3.scaleBand()
      .range([0, size])
      .paddingOuter(0.1)
      .paddingInner(0.1)
      .domain(dimset1.values());

    let xscale = d3.scaleBand()
      .range([0, size])
      .paddingOuter(0.1)
      .paddingInner(0.1)
      .domain(dimset2.values());

    let yaxis = d3.axisLeft()
      .scale(yscale);

    let xaxis = d3.axisTop()
      .scale(xscale)

    svg.append("g")
      .attr("class", "y axis")
      .call(yaxis);

    svg.select(".y.axis")
      .selectAll("text")
      .style("font-size", "15px");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (0) + ")")
      .call(xaxis);

    svg.select(".x.axis")
      .selectAll("text")
      .attr("text-anchor", "start")
      .style("font-size", "15px")
      .attr("transform", "translate(0,0) rotate(-30)");

    svg.selectAll("rect")
        .data(data)
      .enter().append("rect")
        .attr('y', function(d) {
          return yscale(dimension1_accessor(d));
        })
        .attr('x', function(d) {
          return xscale(dimension2_accessor(d));
        })
        .attr('height', yscale.bandwidth())
        .attr('width', xscale.bandwidth())
        .style("fill", function(d) {
          return color(measure_accessor(d));
        })
      .append("title")
        .text(function(d) { return formatted_measure_accessor(d); });

    svg.selectAll(".x.axis text")
      .on("click", function(d) {
        let lookup = {};

        let filtered = data.filter(function(p) {
          return dimension2_accessor(p) == d;
        })

        filtered.forEach(function(p) {
          lookup[dimension1_accessor(p)] = measure_accessor(p);
        });

        let sorted = dimset1.values()
        sorted.sort(function(a,b) {
            let one = a in lookup ? lookup[a] : 0;
            let two = b in lookup ? lookup[b] : 0;
            return two - one;
          });

        yscale.domain(sorted);

        svg.selectAll("rect")
          .transition()
          .duration(800)
          .attr('y', function(d) {
            return yscale(dimension1_accessor(d));
          })

        svg.select(".y.axis")
          .transition()
          .duration(800)
          .call(yaxis);
      });

    svg.selectAll(".y.axis text")
      .on("click", function(d) {
        let lookup = {};

        let filtered = data.filter(function(p) {
          return dimension1_accessor(p) == d;
        })

        filtered.forEach(function(p) {
          lookup[dimension2_accessor(p)] = measure_accessor(p);
        });

        let sorted = dimset2.values()
        sorted.sort(function(a,b) {
            let one = a in lookup ? lookup[a] : 0;
            let two = b in lookup ? lookup[b] : 0;
            return two - one;
          });

        xscale.domain(sorted);

        svg.selectAll("rect")
          .transition()
          .duration(800)
          .attr('x', function(d) {
            return xscale(dimension2_accessor(d));
          })

        svg.select(".x.axis")
          .transition()
          .duration(800)
          .call(xaxis);
      });

  }
});

