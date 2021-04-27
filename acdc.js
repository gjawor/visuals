// plots histograms
// code from https://www.d3-graph-gallery.com/graph/histogram_basic.html

// set the dimensions and margins of the graph
var genny_margin = { top: 10, right: 30, bottom: 30, left: 40 },
  genny_width = 460 - genny_margin.left - genny_margin.right,
  genny_height = 400 - genny_margin.top - genny_margin.bottom;

// append the svg object to the body of the page
var genny_svg1 = d3
  .select("#viz0")
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

  genny_svg1
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
  genny_svg1.append("g").call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  genny_svg1
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
