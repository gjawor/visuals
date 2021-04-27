// plots histograms
// code from https://www.d3-graph-gallery.com/graph/histogram_basic.html
var genny_margin = { top: 10, right: 30, bottom: 30, left: 40 },
  genny_width = 460 - genny_margin.left - genny_margin.right,
  genny_height = 400 - genny_margin.top - genny_margin.bottom;

// append the svg object to the body of the page
var genny_svg2 = d3
  .select("#viz1")
  .append("svg")
  .attr("width", genny_width + genny_margin.left + genny_margin.right)
  .attr("height", genny_height + genny_margin.top + genny_margin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + genny_margin.left + "," + genny_margin.top + ")"
  );

// get the data
d3.csv("all_stats.csv", function (data) {
  //  console.log(data);

  // X axis: scale and draw:
  var x = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.EmotionalEngagement;
      }),
    ])
    .range([0, genny_width]);

  genny_svg2
    .append("g")
    .attr("transform", "translate(0," + genny_height + ")")
    .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d.EmotionalEngagement;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(6)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear().range([genny_height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  genny_svg2.append("g").call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = genny_svg2
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", genny_width)
    .attr("height", genny_height)
    .attr("x", 0)
    .attr("y", 0);

  // Add brushing
  var brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [genny_width, genny_height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = genny_svg2.append("g").attr("clip-path", "url(#clip)");

  // Add the brushing
  scatter.append("g").attr("class", "brush").call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart() {
    extent = d3.event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      x.domain([4, 8]);
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      scatter.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    scatter
      .selectAll("rect")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d.EmotionalEngagement);
      })
      .attr("cy", function (d) {
        return y(d.EmotionalEngagement);
      });
  }

  // append the bar rectangles to the svg element
  genny_svg2
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", "500px")
    .attr("height", function (d) {
      return genny_height - y(d.length);
    })
    .style("fill", "#69b3a2");
});
