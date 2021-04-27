

// set the dimensions and margins of the graph
var g_margin = {top: 10, right: 100, bottom: 30, left: 30},
    g_width = 460 - g_margin.left - g_margin.right,
    g_height = 400 - g_margin.top - g_margin.bottom;

// append the svg object to the body of the page
var g_svg = d3v4
  .select("#my_dataviz")
  .append("svg")
    .attr("width", g_width + g_margin.left + g_margin.right)
    .attr("height", g_height + g_margin.top + g_margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + g_margin.left + "," + g_margin.top + ")");

//Read the data
d3v4.csv("predata.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["ArtistsForHumanity", "AsianCommunityDC", "BostonChinatownNC", "Enroot",
                    "GirlsIncorporated", "HealthResourcesInAction", "MGHYouthPrograms", "Squashbusters", "StStephens", 
                   "Stoughton", "Tierney"]

    // add the options to the button
    d3v4.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("site", function (d) { return d; }) // corresponding site returned by the button

    // Add X axis --> it is a date format
    var x = d3v4.scaleLinear()
      .domain([0,5])
      .range([ 0, g_width ]);
    g_svg.append("g")
      .attr("transform", "translate(0," + g_height + ")")
      .call(d3v4.axisBottom(x));

    // Add Y axis
    var y = d3v4.scaleLinear()
      .domain( [0,24])
      .range([ g_height, 0 ]);
    g_svg.append("g")
      .call(d3v4.axisLeft(y));

    // Initialize line with group a
    var line = g_svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3v4.line()
          .x(function(d) { return x(+d.score) })
          .y(function(d) { return y(+d.ArtistsForHumanity) })
        )
        .attr("stroke", "black")
        .style("stroke-width", 4)
        .style("fill", "none")

    // Initialize dots with group a
    var dot = g_svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
        .attr("cx", function(d) { return x(+d.score) })
        .attr("cy", function(d) { return y(+d.ArtistsForHumanity) })
        .attr("r", 7)
        .style("fill", "#69b3a2")


    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {score: d.score, site:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3v4.line()
            .x(function(d) { return x(+d.score) })
            .y(function(d) { return y(+d.site) })
          )
      dot
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(+d.score) })
          .attr("cy", function(d) { return y(+d.site) })
    }

    // When the button is changed, run the updateChart function
    d3v4.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3v4.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})


</script>
