function writers() {
  var margin = {top: 50, right: 0, bottom: 0, left: 30},
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

var writtenby = [],
    episode = [];
 
$.get(city.docks, function (txt){
    rowNames = txt.split('\n');
});
$.get(city.docks, function (txt){
    colNames = txt.split('\n');
}); 

var //numCols = colNames.length,
    cellSize = city.cells,
    //cellSize = 16,
    legendElementWidth = 40;

d3.csv(city.file,
        function(d) {
          return {
            row: +d.start,
            col: +d.end,
            value: +d.rides
          };
        },
        function(error, data) {
          var colorScale = d3.scale.threshold()
              //.domain([0, colorHeat.length - 1, d3.max(data, function (d) { return d.value; })])
              .domain(city.slices)
              .range(colorHeat);

          var svg = d3.select("#heat").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "heatmap heat"+city.location)// for switching btwn cities
                //.style("display", "none")// for switching btwn cities
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 ///*
          if (city.showlabels){
            svg.style("display", "inline");
            var rowLabels = svg.selectAll(".rowLabel")
              .data(rowNames)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return (i+1) * cellSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(" + cellSize / 2 + "," + cellSize / 2 + ")")
                .attr("class", "rowLabel mono axis")
                .on("mouseover", function(d) {
                  d3.select(this).classed("text-hover",true);})
                .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});
             
            svg.append("text")
                .text("Starting station:")
                .attr("x", 0)
                .attr("y", cellSize/2)
                .attr("class", "mono axis")
                .style("text-anchor", "end");
          
            var colLabels = svg.selectAll(".colLabel")
              .data(colNames)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", 0)
                .attr("y", function(d, i) { return (i+1) * cellSize; })
                .style("text-anchor", "left")
                .attr("transform", "translate(" + cellSize / 2 + ","+cellSize / 2 +") rotate (-90)")
                .attr("class", "colLabel mono axis")
                .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
                .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});
            svg.append("text")
                .text("Ending station:")
                .attr("x", 0)
                .attr("y", 0)
                .attr("transform", "translate(" + cellSize / 2 + ","+ 0 +") rotate (-90)")
                .attr("class", "mono axis")
                .style("text-anchor", "left");
          };
/**/
          var heatMap = svg.selectAll(".cell")
                .data(data)
              .enter().append("rect")
                .attr("x", function(d,i) { return (d.col) * cellSize; })
                .attr("y", function(d,i) { return (d.row) * cellSize; })
                /*.attr("rx", 4)
                .attr("ry", 4)*/
                .attr("class", "cell bordered")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", colorHeat[0])
                .style("fill", function(d) { return colorScale(d.value); })
                .on("mouseover", function(d){
                  //highlight text
                  d3.select(this).classed("highlight",true);
                  d3.selectAll(".rowLabel").classed("text-hover",function(r,ri){ return ri==(d.row-1);});
                  d3.selectAll(".colLabel").classed("text-hover",function(c,ci){ return ci==(d.col-1);});
                  //Update the tooltip position and value
                  d3.select("#tooltip")
                    .style("left", (d3.event.pageX - 75) + "px")
                    .style("top", (d3.event.pageY+10) + "px")
                    .select("#value")
                    .text(d.value+" rides from " + rowNames[d.row-1] + " to "  + colNames[d.col-1]);  
                  //Show the tooltip
                  d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(){
                  d3.select(this).classed("highlight",false);
                  d3.selectAll(".rowLabel").classed("text-hover",false);
                  d3.selectAll(".colLabel").classed("text-hover",false);
                  d3.select("#tooltip").classed("hidden", true);
                });

          
          if(city.showlabels){    
            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.domain()), function(d) { return d; })
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", "translate("+ city.legend +",0)");;

            legend.append("rect")
              .attr("x", function(d, i) { return legendElementWidth * i; })
              .attr("y", height)
              .attr("width", legendElementWidth)
              .attr("height", cellSize / 2)
              .style("fill", function(d, i) { return colorHeat[i]; })
              .style("stroke", "#E6E6E6");
///*
            legend.append("text")
              .attr("class", "mono")
              .text(function(d) { return "≥ " + Math.round(d); })
              .attr("x", function(d, i) { return legendElementWidth * i; })
              .attr("y", height + cellSize);
/**/
          };
  
      });
} //end heatmap()