//creates svg image and sets parameters, appends g group to svg and sets its parametersvar 
svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//creates scale for one group in bar chart
var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

//creates scale for x axis
var x1 = d3.scaleBand()
    .padding(0.05);

//creates linear scale for y axis
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

//colour scale
var cat = d3.scaleOrdinal(d3.schemeCategory20);

var tempColor;

//creates tooltip and sets parameters
var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

//imports data from csv file
d3.csv("2011fat.csv", function(d, i, columns) {
  //Puts all of the column headings (in the first row) into an array, calculates sum 
  //of all values in each column
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

//sets domains
  x0.domain(data.map(function(d) { return d.FAT; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

//appends g group, sets parameters, creates rectangles based on fat data,
//creates rectangles in groups based on headings array, fills rectangles based
//on colour scale and age
  g.append("g")
    .attr("width","100%")
    .attr("height","100%")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.FAT) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return cat(d.key); })

      //on mouseover, displays tooltip information based on fat value
      .on('mouseover', function(d) {

        tooltip.transition()
            .style("visibility","visible")
            .style('opacity', .9)

        tooltip.html(d.value)
            .style('left', (d3.event.pageX - 15) + 'px')
            .style('top',  (d3.event.pageY - 20) + 'px')
            .style('background','lightsteelblue')

        //on tooltip, changes bar opacity and colour
        tempColor = this.style.fill;
        d3.select(this)
            .style('opacity', .5)
            .style('fill','coral')
    })

      //on mouseout, hides tooltip and returns bar colour to original
    .on('mouseout', function(d) {
        d3.select(this)
            .style('opacity', 1)
            .style('fill', tempColor)
            tooltip.transition().duration(1000).style("visibility","hidden")
            });

//creates and appends x axis to g group
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

    //appends axis title to svg image, sets parameters
      svg.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("FAT Score");

//creates and appends y axis to g group, adjusts amount of ticks
//adds axis title to top of axis
  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Captured");

//creates legend variable and appends it to g group, sets parameters, amount of
//lines based on column headings array, reverses order of headings
  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//appends rectangles to legend, colours based on colour scale
  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", cat);

//appends text (headings) to legend
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});
