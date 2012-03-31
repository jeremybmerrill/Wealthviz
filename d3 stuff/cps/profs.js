var dataProfs; //scope

var compFunctionProfs;
compFunctionProfs = baseFunction;

//var data = d3.range(10).map(Math.random);
d3.csv("a.csv", function(csv){
    dataProfs = csv.filter(function(d, i){ return d["Position"] == "Faculty";});
    dataProfs = dataProfs.sort(function(d1, d2){ return d2.Base - d1.Base});
    dataProfs.forEach(function(x) {
    });
    drawGraphProfs( dataProfs);
});

function drawGraphProfs(dataProfs){
    var w = 515,
        h = 460,
        x = d3.scale.linear().domain([0, 350000]).range([0, w-100]),
        y = d3.scale.ordinal().domain(d3.range(dataProfs.length)).rangeBands([0, h], .2);

    var vis = d3.select("#profs-chart")
      .append("svg:svg")
        .attr("width", w)
        .attr("height", h + 20)
      .append("svg:g")
        .attr("transform", "translate(120,0)");

    var bars = vis.selectAll("g.bar")
        .data(dataProfs)
      .enter().append("svg:g")
        .attr("class", "bar")
        .attr("y", function(d, i) { return y(i); });
        /*.attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });*/

    bars.append("svg:rect") // the bars themselves
        .attr("class", "bar")
        .attr("fill", function(d,i){return schoolColor(d.College);})
        .attr("width", function(d){ return x(compFunctionProfs(d)); })
        .attr("y", function(d, i) { return y(i); })
        .attr("height", y.rangeBand());

    bars.append("svg:text") // Numbers on bars.
        .attr("x", function(d){ return x(compFunctionProfs(d)) -6; })
        .attr("y", function(d, i) { return y(i) + 12; })
        .attr("fill", "white")
        .attr("class", "valueLabel")
        .attr("text-anchor", "end")
        .text(function(d){ return "$" + commaFormatted(compFunctionProfs(d)); });

    bars.append("svg:text") // Discipline labels on bars.
        .attr("x", 4)
        .attr("y", function(d, i) { return y(i) +12; })
        .attr("fill", "white")
        .attr("class", "disciplineLabel")
        .attr("text-anchor", "start")
        .text(function(d){ return d.Discipline; });

    bars.append("svg:text") //left of bar labels
        .attr("x", -6)
        .attr("y", function(d, i) { return y(i) + 12; })
        .attr("class", "nameLabel")
        .attr("text-anchor", "end")
        .text( function(d, i) { return d.Person; } ); // this sets the name left of the bars.

    var rules = vis.selectAll("g.rule") //scale
        .data(x.ticks(8))
      .enter().append("svg:g")
        .attr("class", "rule")
        .attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });

    rules.append("svg:line") //ticks
        .attr("y1", h)
        .attr("y2", h + 6)
        .attr("stroke", "black");

    rules.append("svg:line") // visual white line things
        .attr("y1", 0)
        .attr("y2", h)
        .attr("stroke", "white")
        .attr("stroke-opacity", .3);

    rules.append("svg:text") //tick labels.
        .attr("y", h + 8)
        .attr("dy", ".71em")
        .attr("text-anchor", "middle")
        .text(x.tickFormat(10));

    vis.append("svg:line") // line between A-J and hte bars.
        .attr("y1", 0)
        .attr("y2", h)
        .attr("stroke", "black");

    legendx = .6 * w;
    legendy = .5 * h;
    var legends = vis.selectAll("g.legend")
        .attr("x", legendx)
        .attr("y", legendy)
        .attr("text-anchor", "end")
        .data(schoolColors)
        .enter()
        .append("svg:g");
    legends.append("svg:rect")
            .attr("x", legendx)
            .attr("y", function(datum, index) { return legendy + index * 25 })
            .attr("height", 20)
            .attr("width", 20)
            .attr("fill", function(datum){ return datum["Color"]; } )
    legends.append("svg:text")
        .attr("x", legendx + 25)
        .attr("y", function(datum, index) { return legendy + index * 25 })
        .attr("dy", "12px")
        .attr("text-anchor", "left")
        .text(function(datum){ return datum["School"]; } );

}
function toggleCompProfs() { //take the proper version of includeOthers and compFunction as arguments, change them in link target when clicked.
    if(compFunctionProfs == totalCompFunction){
        compFunctionProfs = baseFunction;
    }else{
        compFunctionProfs = totalCompFunction;
    }
    var w = 530,
        h = 460,
        x = d3.scale.linear().domain([0, 350000]).range([0, w-100]),
        y = d3.scale.ordinal().domain(d3.range(dataProfs.length)).rangeBands([0, h], .2);
    
    dataProfs = dataProfs.sort(function(d1, d2){ return compFunctionProfs(d2) - compFunctionProfs(d1)})

    d3.selectAll("#profs-chart rect.bar")
       .data(dataProfs, function(d) { return d.Person; })
        .transition().duration(1000).delay(0)
        .attr("y", function(d, i) { return y(i); })
        .transition().duration(1000).delay(1000)
        .attr("width", function(d){ return x((compFunctionProfs(d))); });

    d3.selectAll("#profs-chart text.valueLabel")
       .data(dataProfs, function(d) { return d.Person; })
        .transition().duration(1000).delay(0)
        .text(function(d){ return "$" + String(commaFormatted(compFunctionProfs(d)))})
        .attr("y", function(d, i) { return y(i) + 12; })
        .transition().duration(1000).delay(1000)
        .attr("x", function(d){ return x(compFunctionProfs(d)) -6; });
    d3.selectAll("#profs-chart text.nameLabel") 
       .data(dataProfs, function(d) { return d.Person; })
        .transition().duration(1000).delay(0)
        .attr("y", function(d, i) { return y(i) + 12; });
    d3.selectAll("#profs-chart text.disciplineLabel") 
       .data(dataProfs, function(d) { return d.Person; })
        .transition().duration(1000).delay(0)
        .attr("y", function(d, i) { return y(i) + 12; });
}
