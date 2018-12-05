looker.plugins.visualizations.add({
  id: "sankey",
  label: "Sankey",
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
      .node,
      .link {
        transition: 0.5s opacity;
      }
      </style>
    `;
    this._svg = d3v4.select(element).append("svg");
  },
  // Render in response to the data or settings changing
  update: function(data, element, config, queryResponse) {
    if (!handleErrors(this, queryResponse, {
      min_pivots: 0, max_pivots: 0,
      min_dimensions: 2, max_dimensions: undefined,
      min_measures: 1, max_measures: 1,
    })) return;
    let d3 = d3v4;

    let width = element.clientWidth;
    let height = element.clientHeight;

    let svg = this._svg
      .html("")
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g");

    let dimensions = queryResponse.fields.dimension_like;
    let measure = queryResponse.fields.measure_like[0];

    let format = formatType(measure.value_format);

    let color = d3.scaleOrdinal()
      .range(config.color_range);

		let defs = svg.append('defs');

		let sankey = d3.sankey()
				.nodeWidth(10)
				.nodePadding(12)
				.extent([[1, 1], [width - 1, height - 6]]);

		let link = svg.append("g")
				.attr("class", "links")
				.attr("fill", "none")
				.attr("stroke", "#fff")
			.selectAll("path");

		let node = svg.append("g")
				.attr("class", "nodes")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
			.selectAll("g");

		let graph = {
			nodes: [],
			links: []
		};

		let nodes = d3.set();

		data.forEach(function(d) {
      // variable number of dimensions
      let path = dimensions.map(function(dim) {return d[dim.name].value + ""});
      path.forEach(function(p,i) {
        if (i == path.length-1) return;
        let source = path.slice(i,i+1)[0] + i;
        let target = path.slice(i+1,i+2)[0] + (i+1);
        nodes.add(source);
        nodes.add(target);
        graph.links.push({ "source": source,
                           "target": target,
                           "value": +d[measure.name].value});
      });
		});

		let nodesArray = nodes.values();

		graph.links.forEach(function (d, i) {
			d.source = nodesArray.indexOf(d.source);
			d.target = nodesArray.indexOf(d.target);
		});

		graph.nodes = nodes.values().map(function(d) {
			return {
				name: d.slice(0,-1)
			};
		});

		sankey(graph);

		link = link
			.data(graph.links)
			.enter().append("path")
				.attr("class", "link")
				.attr("d", function(d) { return "M" + -10 + "," + -10 + d3.sankeyLinkHorizontal()(d); })
				.style("opacity", 0.4)
				.attr("stroke-width", function(d) { return Math.max(1, d.width); })
        .on("mouseenter", function(d) {
          svg.selectAll(".link")
            .style("opacity", 0.05)
          d3.select(this)
            .style("opacity", 0.7)
          svg.selectAll(".node")
            .style("opacity", function(p) {
              if (p == d.source) return 1;
              if (p == d.target) return 1;
              return 0.5;
            });
        })
        .on("mouseleave", function(d) {
          d3.selectAll(".node").style("opacity", 1);
          d3.selectAll(".link").style("opacity", 0.4);
        });

		// gradients https://bl.ocks.org/micahstubbs/bf90fda6717e243832edad6ed9f82814
		link.style('stroke', function(d,i) {

			// make unique gradient ids
			let gradientID = "gradient" + i;

			let startColor = color(d.source.name.replace(/ .*/, ""));
			let stopColor = color(d.target.name.replace(/ .*/, ""));

			let linearGradient = defs.append('linearGradient')
					.attr('id', gradientID);

			linearGradient.selectAll('stop')
				.data([
						{offset: '10%', color: startColor },
						{offset: '90%', color: stopColor }
					])
				.enter().append('stop')
				.attr('offset', function(d) {
					return d.offset;
				})
				.attr('stop-color', function(d) {
					return d.color;
				});

			return "url(#" + gradientID + ")";
		})

		node = node
			.data(graph.nodes)
			.enter().append("g")
      .attr("class", "node")
      .on("mouseenter", function(d) {
        svg.selectAll(".link")
          .style("opacity", function(p) {
            if (p.source == d) return 0.7;
            if (p.target  == d) return 0.7;
            return 0.05;
          });
      })
      .on("mouseleave", function(d) {
        d3.selectAll(".link").style("opacity", 0.4);
      });

		node.append("rect")
				.attr("x", function(d) { return d.x0; })
				.attr("y", function(d) { return d.y0; })
				.attr("height", function(d) { return d.y1 - d.y0; })
				.attr("width", function(d) { return d.x1 - d.x0; })
				.attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
				.attr("stroke", "#555");

		node.append("text")
				.attr("x", function(d) { return d.x0 - 6; })
				.attr("y", function(d) { return (d.y1 + d.y0) / 2; })
				.attr("dy", "0.35em")
				.style("font-weight", "bold")
				.attr("text-anchor", "end")
				.style("fill", "#222")
				.text(function(d) { return d.name; })
			.filter(function(d) { return d.x0 < width / 2; })
				.attr("x", function(d) { return d.x1 + 6; })
				.attr("text-anchor", "start");

		node.append("title")
				.text(function(d) { return d.name + "\n" + d.value; });
  }
});

