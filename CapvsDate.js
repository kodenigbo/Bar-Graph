//parse dates written in the format: month/day/year
//year in the format "yy" not "YYYY"
var parseDate = d3.timeParse("%m/%d/%y");

//import and give variable name to csv file 
var bardata = d3.csv("NoCaptured.csv")
  .row(function(d) {return {date: parseDate(d.date), captured:Number(d.captured), average:Number(d.average)};})
  .get(function(error,data) {

    var tempColor;

    //sets basic parameters for graphic
    var margin = { top: 30, right: 30, bottom: 40, left:50 }
    var height = 400 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right,
    padding = 100,
    barWidth = 50,
    barOffset = 5;

    //normalizes max y value and gets earliest and latest date
    var max = 35;
    var minDate = d3.min(data,function(d){return d.date;})
    var maxDate = d3.max(data,function(d){return d.date;})

    //sets x scale and sets size parameters
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    //sets domain
    x.domain(data.map(function(d) { return d.date; }));

    //creates linear scale and sets domain/range
    var y = d3.scaleLinear()
              .domain([0,max])
              .range([height,0]);

    //creates tooltip, sets parameters
    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

    //creates x and y axes, adjusts amount of ticks on x axis
    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x)
        .tickValues(x.domain().filter(function(d,i){return !(i%4)}));

    //creates svg image and sets parameters
    var svg = d3.select("body").append("svg")
            .attr("height", 450)
            .attr("width", 650)
            .append("g")
            .attr("transform","translate("+margin.left+","+margin.top+")")

  //creates area chart
  var area = d3.area()
                .x(function(d,i) {return x(d.date)})
                .y0(height) //sets location of the lowerline
                .y1(function(d) {return y(d.average);}); //sets location of the upper line

  //creates line for area chart, not necessary if line is not going
  //to be a different colour
  /*var line = d3.line()
                .x(function(d){return x(d.date);})
                .y(function(d){return y(d.average);});*/

  //draws area chart
  svg.append("path")
     .attr("d",area(data))
     .style("fill", "lightsteelblue")

  //draws line on top of area chart, only necessary if var line is active
  /*svg.append("path")
     .attr("d", line(data))
     .attr("stroke","lightsteelblue");*/

    //appends x axis to the svg, edits the way the dates will appear on the x axis
    //sets axis parameters
    svg.append("g").attr("class","x axis")
        .attr("transform","translate(0,"+height+")").call(xAxis.tickFormat(d3.timeFormat("%d %b")))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");


    //creates bar chart, sets colour, x values based on date, y values based on one
    //year of data, bars are drawn according to height - magnitude of that bar
     var myChart = svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .style('fill', 'steelblue')
              .attr("x", function(d) { return x(d.date); })
              .attr("width", x.bandwidth())
              .attr("y", function(d) { return y(d.captured); })
              .attr("height", function(d) { return height - y(d.captured); })
              //on mousover, display tooltip
              .on('mouseover', function(d) {
                tooltip.transition()
                    .style("visibility","visible")
                    .style('opacity', .9)
                tooltip.html(d.captured)
                    .style('left', (d3.event.pageX - 35) + 'px')
                    .style('top',  (d3.event.pageY - 40) + 'px')

        //on mouseover, opacity of the bars changes
        tempColor = this.style.fill;
        d3.select(this)
            .style('opacity', .3)
    })

    //on mouseout, tooltip is hidden, bars returned to their original colour
    .on('mouseout', function(d) {
        d3.select(this)
            .style('opacity', 1)
            .style('fill', tempColor)
            tooltip.transition().duration(1000).style("visibility","hidden")
            });

    //appends y axis to the svg
    svg.append("g").attr("class","y axis").call(yAxis);

    //appends x axis title to the svg, sets parameters
    svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (width/2) +","+(height*1.2)+")")  // centre below axis
                .text("Date");

    //appends the y axis title to the svg, sets parameters
    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(-30,"+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Number of Owls Captured");

})
