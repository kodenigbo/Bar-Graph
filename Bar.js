// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    //imports data from csv file within folder
    d3.csv("2010data.csv", function(error, data) {
      if (error) throw error;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
    //declare data from NoCaptured as integers
    d.NoCaptured = +d.NoCaptured;
  });

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.SunsetHours; }));
  y.domain([0, d3.max(data, function(d) { return d.NoCaptured; })]);

//create tooltip, set its parameters
  var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

  // append the rectangles for the bar chart
 svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .style('fill', 'black')
      .attr("x", function(d) { return x(d.SunsetHours); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.NoCaptured); })
      .attr("height", function(d) { return height - y(d.NoCaptured); })

      //activates tooltip upon mouseover, decides tooltip background
      .on('mouseover', function(d) {
        tooltip.transition()
            .style("visibility","visible")
            .style('opacity', .9)

        //positions and sets tooltip text
        tooltip.html(d.NoCaptured)
            .style('left', (d3.event.pageX - 35) + 'px')
            .style('top',  (d3.event.pageY - 30) + 'px')

        //decides opacity of rectangles
        tempColor = this.style.fill;
        d3.select(this)
            .style('opacity', .3)
    })

      //Hides the tooltip on mouseout
      .on('mouseout', function(d) {
          d3.select(this)
              .style('opacity', 1)
              .style('fill', tempColor)
              tooltip.transition().duration(1000).style("visibility","hidden")
              });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  //adds the x axis title
  svg.append("text")
       .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
       .attr("transform", "translate("+(width/2)+","+height*1.1+")")  // centre below axis
       .text("Time ranges (after Sunset)");

//adds the y axis title
 svg.append("text")
         .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
         .attr("transform", "translate(-30,"+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
         .text("Number of Owls Captured");

});
