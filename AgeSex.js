
// Create svg and set the dimensions and margins of the graph
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the ranges
var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);


//Puts colours in an ordinal scale 
var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var tempColor;

    //Creates tooltip, sets parameters
    var tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'white')
            .style('opacity', 0)

//imports data from csv file within folder
d3.csv("AgeSexdata.csv", function(d, i, columns) {
  //Puts all of the column headings (in the first row) into an array, calculates sum 
  //of all values in each column
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;


  var keys = data.columns.slice(1);

  //sets domains
  x.domain(data.map(function(d) { return d.Sex; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

//appends g group, stacks each column's values on top of each other and uses ordinal
//colour scale to colour them. Uses data to construct and append rectangles.
  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Sex); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())

      //tooltip is activated upon mouseover
      .on('mouseover', function(d) {
        tooltip.transition()
            .style("visibility","visible")
            .style('opacity', .9)

        //positions and sets tooltip text
        tooltip.html(d[1]-d[0])
            .style('left', (d3.event.pageX - 15) + 'px')
            .style('top',  (d3.event.pageY - 20) + 'px')
            .style('background','lightsteelblue')

        //upon mouseover, changes opacity of rectangles
        tempColor = this.style.fill;
        d3.select(this)
            .style('opacity', .5)
    })

    //hides tooltip upon mouseout
    .on('mouseout', function(d) {
        d3.select(this)
            .style('opacity', 1)
            .style('fill', tempColor)
            tooltip.transition().duration(1000).style("visibility","hidden")
            });

  //appends x axis
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  //appends y axis and axis title
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
      .text("Population");

  //creates group for (and sets parameters) for legend object
  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  //creates legend rectangles and colours them according to ordinal colour array
  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  //appends column headings to respective rectangles in legend
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});
