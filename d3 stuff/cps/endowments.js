//var data = the highest paid prof from each school.

var dataEndowments; //hooray scope!

d3.csv("endowmentscorrect.csv", function(csv){
    dataEndowments = csv.sort(function(d1, d2){ return d2.Endowments - d1.Endowments});
    drawEndowments(dataEndowments);
});

function drawEndowments(dataHighestPaidProfs){
    var h = 300,
        w = 500,
        y = d3.scale.linear().domain([0, 1800000000]).range([0, h]),
        x = d3.scale.ordinal().domain(d3.range(dataEndowments.length)).rangeBands([0, w], .2);

    var vis = d3.select("#endowments-chart")
      .append("svg:svg")
        .attr("height", h + 40)
        .attr("width", w + 60)
      .append("svg:g")
        .attr("transform", "translate(70,0)");

    /* Base comp bars */
    var bars = vis.selectAll("g.bar")
        .data(dataEndowments)
      .enter().append("svg:g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ",20)"; });

    bars.append("svg:rect") // the bars themselves
        .attr("fill", function(d,i){return schoolColor(d.College);})
        .attr("height", function(d){ return y(d.Endowments); })
        .attr("y", function(d) { return h - y(d.Endowments) - .5; })
        .attr("width", x.rangeBand())
        .attr("class", "bar");

    bars.append("svg:text") // Numbers on bars.
        //.attr("transform", function(d){ return "rotate(270, ".concat(String((x.rangeBand() / 2) + 12), ", ", String(h - y(d.Endowments) + .5 + 90), ")");} )
        .attr("y", function(d) { return h - y(d.Endowments) + .5 - 2; })
        .attr("x", (x.rangeBand() / 2))
        .attr("class", "valueLabel")
        .attr("font-size", "1.25em")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text(function(d){ return "$" + String(commaFormatted(d.Endowments))});

    bars.append("svg:text") //left of bar labels
        .attr("y", h)
        .attr("x", x.rangeBand() / 2)
        .attr("dx", -6)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text( function(d, i) { return d.College; } ); // this sets the name left of the bars.

    var rules = vis.selectAll("g.rule") //scale
        .data(y.ticks(10))
      .enter().append("svg:g")
        .attr("class", "rule")
        .attr("transform", function(d) { return "translate(0," + (-y(d) + 20) + ")"; });

    rules.append("svg:line") //ticks
        .attr("y1", h)
        .attr("y2", h)
        .attr("x1", 0)
        .attr("x2", 6)
        .attr("stroke", "black");

    rules.append("svg:line") // visual white line things
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", h)
        .attr("y2", h)
        .attr("stroke", "white")
        .attr("stroke-opacity", .3);

    numerical_labels = rules.append("svg:text") //numerical tick labels.
        .attr("y", h + 4)
        .attr("x", "-3em")
        .attr("text-anchor", "middle")
        .text(function(d){ tick = y.tickFormat(",.4r")(d); return "$" + (tick.substring(0, tick.lastIndexOf(",000,000")) || 0) + "m"; });

    vis.append("svg:line") // line between A-J and hte bars.
        .attr("y1", 20)
        .attr("y2", h + 20)
        .attr("stroke", "black");

    legendx = .81 * w;
    legendy = .25 * h;
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
        .text(function(datum){ return datum["School"]; } );

}
