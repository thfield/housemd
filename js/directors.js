//function directors(filePath) {
  var margin = {top: 0, right: 0, bottom: 50, left: 30},
      width = 600 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;
  
  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.ordinal()
      .rangePoints([height, 0], 5);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format("s"));

  var svg = d3.select("#directors").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var title = svg.append("text")
      .text("Episode Director")
      .attr("class", "title")
      .style("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", 10);

  //d3.csv(filePath, function(error, data) {
  d3.csv('data/directors.csv', function(error, data) {

    var epDirectors = d3.keys(data[0]).filter(function(key) { return (key!="Show"||key!="Season"||key!="Ep"||key!="Title"||key!="Date"); });
    //var episode = d3.keys(data[0].filter(function(key){ return(key=="Show"); }));

    var totalUsers = d3.keys(data[0]).filter(function(key) { return (key=="total"); });

    data.forEach(function(d) {
      d.AirDate = parseDate(d.AirDate);
      d.Show = +d.Show;
      d.Season = +d.Season;
      d.Ep = +d.Ep;
    });

    x.domain(d3.extent(data, function(d) { return d.Show; }));
    y.domain(epDirectors).rangePoints([0,width],1);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("rides");

    var totalrides = svg.selectAll(".category")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.duration) + ",0)"; });

    totalrides.selectAll("rect") // draw total rides
        .data(function(d) { return d.totalRides; })
      .enter().append("rect")
        .attr("class","totalbar")
        .attr("width", x0.rangeBand())
        .attr("x", function(d) { return x0(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        //.style("fill", function(d) { return x1(d.name); });
        .style("fill", colorUsers.total)
      .append("title")
        .text(function(d) { return d.value + " rides"; });
  });
//} // end directors()

//directors('data/directors.csv')