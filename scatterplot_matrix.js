/*!
 * An implementation of Mike Bostock's Scatterplot Matrix with Brush within the Looker custom visualization API
 *
 * https://bl.ocks.org/mbostock/4063663
 */

(function() {
  var viz = {
    id: "scatterplot_matrix",
    label: "Scatterplot Matrix",
    options: {
      color_range: {
        type: "array",
        label: "Color Range",
        display: "colors",
        default: ["#dd3333", "#80ce5d", "#f78131", "#369dc1", "#c572d3", "#36c1b3", "#b57052", "#ed69af"],
      },
    },
    // Set up the initial state of the visualization
    create: function(element, config) {
      let css = element.innerHTML = `
        <style>

          svg {
            font: 10px sans-serif;
            padding: 10px;
          }

          .axis,
          .frame {
            shape-rendering: crispEdges;
          }

          .axis line {
            stroke: #ddd;
          }

          .axis path {
            display: none;
          }

          .cell text {
            font-weight: bold;
            text-transform: capitalize;
          }

          .frame {
            fill: none;
            stroke: #aaa;
          }

          circle {
            fill-opacity: .7;
          }

          circle.hidden {
            fill: #ccc !important;
          }

          .extent {
            fill: #000;
            fill-opacity: .125;
            stroke: #fff;
          }

          </style>
      `;
      this._svg = d3.select(element).append("svg");
    },
    handleErrors: function(queryResponse) {
      var non_numeric_dimensions = queryResponse.fields.dimension_like.filter(function(dim) {
        return !(dim.is_numeric || dim.is_timeframe)
      }).length;
      if (non_numeric_dimensions > 1) {
        this.addError({
          group: "num-req",
          title: "Incompatible Dimension Data Type",
          message: "Can have only one category dimension",
        });
        return false;
      }
      this.clearErrors("num-req");
      return true;
    },
    // Render in response to the data or settings changing
    update: function(data, element, config, queryResponse) {
      if (!handleErrors(this, queryResponse, {
        min_pivots: 0, max_pivots: 1,
        min_dimensions: 2, max_dimensions: undefined,
        min_measures: 0, max_measures: 0,
      })) return;
      if (!this.handleErrors(queryResponse)) return;
      this.create(element, config);

      function accessor(d, trait) {
        return d[trait].value
      }

      var domainByTrait = {},
          traits = queryResponse.fields.dimension_like.filter(function(dim) {
            return (dim.is_numeric || dim.is_timeframe)
          }).map(function(d) { return d.name; }),
          non_numeric_dimension,
          n = traits.length,
          padding = 20,
          size = d3.min([element.offsetWidth / n - padding, element.offsetHeight / n - padding ]);

      if (queryResponse.fields.dimension_like.filter(function(dim) {
        return !(dim.is_numeric || dim.is_timeframe)
      })) {
        non_numeric_dimension = queryResponse.fields.dimension_like.filter(function(dim) {
          return !(dim.is_numeric || dim.is_timeframe)
        })[0]
      }

      var x = d3.scale.linear()
          .range([padding / 2, size - padding / 2]);

      var y = d3.scale.linear()
          .range([size - padding / 2, padding / 2]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(6);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(6);

      var fill;
      if (non_numeric_dimension) {
        var color = d3.scale.ordinal()
            .domain(d3.map(data, function(d){return accessor(d, non_numeric_dimension.name);}).keys())
            .range(config.color_range);
        fill = function(d) { return color(accessor(d, non_numeric_dimension.name)); };
      } else {
        fill = function(d) { return "black"; };
      }

      traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) { return accessor(d, trait); });
      });

      xAxis.tickSize(size * n);
      yAxis.tickSize(-size * n);

      var brush = d3.svg.brush()
          .x(x)
          .y(y)
          .on("brushstart", brushstart)
          .on("brush", brushmove)
          .on("brushend", brushend);

      var svg = this._svg
          .attr("width", size * n + padding)
          .attr("height", size * n + padding)
        .append("g")
          .attr("transform", "translate(" + padding + ",0)");

      svg.selectAll(".x.axis")
          .data(traits)
        .enter().append("g")
          .attr("class", "x axis")
          .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
          .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

      svg.selectAll(".y.axis")
          .data(traits)
        .enter().append("g")
          .attr("class", "y axis")
          .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
          .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

      var cell = svg.selectAll(".cell")
          .data(cross(traits, traits))
        .enter().append("g")
          .attr("class", "cell")
          .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
          .each(plot);

      // Titles for the diagonal.
      cell.filter(function(d) { return d.i === d.j; }).append("text")
          .attr("x", padding)
          .attr("y", padding)
          .attr("dy", ".71em")
          .text(function(d) { return d.x; });

      cell.call(brush);

      function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
          .enter().append("circle")
            .attr("cx", function(d) { return x(accessor(d, p.x)); })
            .attr("cy", function(d) { return y(accessor(d, p.y)); })
            .attr("r", 4)
            .style("fill", fill);
      }

      var brushCell;

      // Clear the previously-active brush, if any.
      function brushstart(p) {
        if (brushCell !== this) {
          d3.select(brushCell).call(brush.clear());
          x.domain(domainByTrait[p.x]);
          y.domain(domainByTrait[p.y]);
          brushCell = this;
        }
      }

      // Highlight the selected circles.
      function brushmove(p) {
        var e = brush.extent();
        svg.selectAll("circle").classed("hidden", function(d) {
          return e[0][0] > accessor(d, p.x) || accessor(d, p.x) > e[1][0]
              || e[0][1] > accessor(d, p.y) || accessor(d, p.y) > e[1][1];
        });
      }

      // If the brush is empty, select all circles.
      function brushend() {
        if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
      }

      function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
      }
    }
  };
  looker.plugins.visualizations.add(viz);
}());
