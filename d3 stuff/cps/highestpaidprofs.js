//var data = the highest paid prof from each school.

var dataHighestPaidProfs; //hooray scope!

var compFunctionHighestPaidProfs;
compFunctionHighestPaidProfs = baseFunction;

d3.csv("a.csv", function(csv){
    dataHighestPaidProfs = csv.filter(function(d, i){ return d["Position"] == "Faculty";});
    dataHighestPaidProfs = dataHighestPaidProfs.sort(function(d1, d2){ return d2.Base - d1.Base});
    var collegesSoFar = {};
    dataHighestPaidProfs = dataHighestPaidProfs.filter(function(d, i){ 
                        var x = d["College"] in collegesSoFar;
                        collegesSoFar[d["College"]] = "";
                        return !x; });

    dataHighestPaidProfs.forEach(function(d,i) {
    });
    drawGraphHighestPaidProfs(dataHighestPaidProfs);
});

function drawGraphHighestPaidProfs(dataHighestPaidProfs){
    var h = 550,
        w = 500,
        y = d3.scale.linear().domain([0, 350000]).range([0, h]),
        x = d3.scale.ordinal().domain(d3.range(dataHighestPaidProfs.length)).rangeBands([0, w], .2);

    var vis = d3.select("#highestpaidprofs-chart")
      .append("svg:svg")
        .attr("height", h + 40)
        .attr("width", w + 80)
      .append("svg:g")
        .attr("transform", "translate(70,0)");

    var defs = vis.append('svg:defs');

    var allpatterns = defs.selectAll("pattern")
        .data(dataHighestPaidProfs.map(function(d,i){ return i; }))
      .enter().append('svg:pattern')
        .attr('id', function(d, i) { return "pic" + i ; })
        .attr('width', 64)
        .attr('height', 64)
        .attr('patternUnits', 'objectBoundingBox'); 

    allpatterns.append('svg:image')
        .attr('width', 64)
        .attr('height', 64)
        .attr('xlink:href', 'icon.png');

    /* Base comp bars */
    var bars = vis.selectAll("g.bar")
        .data(dataHighestPaidProfs)
      .enter().append("svg:g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ",20)"; });

    bars.append("svg:rect") // the bars themselves
        .attr("fill", function(d,i){return schoolColor(d.College);})
        .attr("height", function(d){ return y(d.Base); })
        .attr("y", function(d) { return h - y(d.Base) - .5; })
        .attr("width", x.rangeBand())
        .attr("class", "bar")
        .on("click", function(d, i){ changeInfobox(i) ;});

    bars.append("svg:rect") // image boxes
        .attr("y", function(d) { return h - y(d.Base) + 5.5; })
        .attr("x", 5)
        .attr("class", "img")
        .attr("display", "block")
        .attr("fill", function(d, i) { return "url(#pic" + i + ")"; })
        .attr("height", (x.rangeBand() - 10 ))
        .attr("width", (x.rangeBand()) - 10 )
        .on("click", function(d, i){ changeInfobox(i) ;});

    bars.append("svg:text") // Numbers on bars.
        .attr("transform", function(d){ return "rotate(270, ".concat(String((x.rangeBand() / 2) + 12), ", ", String(h - y(d.Base) + .5 + 90), ")");} )
        .attr("y", function(d) { return h - y(d.Base) + .5 + 90; })
        .attr("x", (x.rangeBand() / 2) + 12)
        .attr("z", 5)
        .attr("class", "valueLabel")
        .attr("font-size", "3em")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .text(function(d){ return String(commaFormatted(d.Base))})
        .on("click", function(d, i){ changeInfobox(i) ;});

    bars.append("svg:text") //left of bar labels
        .attr("y", h)
        .attr("x", x.rangeBand() / 2)
        .attr("dx", -6)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text( function(d, i) { return dataHighestPaidProfs[i].Person; } ); // this sets the name left of the bars.

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
        .text(y.tickFormat(10));

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

    infoboxx = .3 * w;
    infoboxy = .08 * h;
    var infobox = vis.selectAll("rect.infobox")
        .data(dataHighestPaidProfs.filter(function(d, i){ return i == 0;} )) //filter to take only one?
        .enter()
        .append("svg:g");
    infobox.append("svg:rect")
        .attr("x", infoboxx)
        .attr("class", "infobox")
        .attr("y", infoboxy)
        .attr("height", 85)
        .attr("width", 300)
        .attr("fill", "none")
        .attr("stroke", "black");

    infoboxtext = infobox.append("svg:text")
        .attr("x", infoboxx + 5)
        .attr("y", infoboxy + 16)
        .attr("class", "infobox")
        .attr("dy", "24px")
        .attr("class", function(datum, index){ return "infobox"; } )
        .attr("id", function(datum, index){ return "infobox" + index; } );

    infoboxtext.append("svg:tspan")
            .attr("class", "infobox")
            .attr("id", "infoboxPerson")
            .attr("dy", "0em")
            .attr("x", infoboxx + 5)
            .text(function(datum){ return datum["Person"]; } )
    infoboxtext.append("svg:tspan")
            .attr("id", "infoboxProfOf")
            .attr("class", "infobox")
            .attr("dy", "1em")
            .attr("x", infoboxx + 5)
            .text("Professor of ")
            .append("svg:tspan")
                .attr("id", "infoboxDiscipline")
                .attr("dx", ".1em")
                .text(function(datum){ return datum["Discipline"]; } );
    infoboxtext.append("svg:tspan")
            .attr("dy", "1em")
            .attr("class", "infobox")
            .attr("x", infoboxx + 5)
            .attr("id", "infoboxAt")
            .text("at")
            .append("svg:tspan")
                .attr("id", "infoboxCollege")
                .attr("dx", ".2em")
                .text(function(datum){ return datum["College"]; } );
    salary = infoboxtext.append("svg:tspan")
            .attr("dy", "1em")
            .attr("class", "infobox")
            .attr("x", infoboxx + 5)
            .attr("id", "infoboxSalary")
            .text("makes a base salary of");
    salary.append("svg:tspan")
                .attr("class", "infobox")
                .attr("id", "infoboxBase")
                .attr("dx", ".2em")
                .text(function(datum){ return commaFormatted(datum["Base"]); } );
    salary2 = infoboxtext.append("svg:tspan")
            .attr("class", "infobox")
            .attr("id", "infoboxAndReceives")
            .attr("x", infoboxx + 5)
            .attr("dy", "1em")
            .text("and receives ");
    salary2.append("svg:tspan")
                .attr("class", "infobox")
                .attr("id", "infoboxTotal")
                .attr("dx", ".2em")
                .text(function(datum){ return commaFormatted(datum["TotalComp"]); } );
    salary2.append("svg:tspan")
                .attr("class", "infobox")
                .attr("id", "infoboxInTotalCompensation")
                .attr("dx", ".2em")
                .text("in total compensation.");
    d3.selectAll('#highestpaidprofs-chart .infobox').attr("display", "none");
}

function toggleCompHighestPaidProfs() { //take the proper version of includeOthers and compFunctionHighestPaidProfs as arguments, change them in link target when clicked.
    if(compFunctionHighestPaidProfs == totalCompFunction){
        compFunctionHighestPaidProfs = baseFunction;
    }else{
        compFunctionHighestPaidProfs = totalCompFunction;
    }
    var h = 550,
        w = 500,
        y = d3.scale.linear().domain([0, 350000]).range([0, h]),
        x = d3.scale.ordinal().domain(d3.range(dataHighestPaidProfs.length)).rangeBands([0, w], .2);

   d3.selectAll("#highestpaidprofs-chart rect.bar")
       .data(dataHighestPaidProfs)
        .transition().duration(1000)
        .attr("height", function(d){ return y(compFunctionHighestPaidProfs(d)); })
        .attr("y", function(d) { return h - y(compFunctionHighestPaidProfs(d)) - .5; });

    d3.selectAll("#highestpaidprofs-chart text.valueLabel") // Numbers on bars.
       .data(dataHighestPaidProfs)
      .transition().duration(1000)
        .attr("transform", function(d){ return "rotate(270, ".concat(String((x.rangeBand() / 2) + 12), ", ", String(h - y(compFunctionHighestPaidProfs(d)) + .5 + 90), ")");} )
        .attr("y", function(d) { return h - y(compFunctionHighestPaidProfs(d)) + .5 + 90; })
        .text(function(d){ return String(commaFormatted(compFunctionHighestPaidProfs(d)))});
    d3.selectAll("#highestpaidprofs-chart rect.img") //This is what slows things down.
      .style("display", "none")
       .data(dataHighestPaidProfs)
      .transition().duration(0).delay(1000)
        .attr("y", function(d) { return h - y(compFunctionHighestPaidProfs(d)) + 5.5; })
        .style("display", "block");
}


function changeInfobox(i){
    d3.selectAll('#highestpaidprofs-chart .infobox').attr("display", "block");
    d3.select("#highestpaidprofs-chart .infobox")
        .transition().duration(500)
        .attr("opacity", 0);
    d3.select("#highestpaidprofs-chart .infobox")
        .transition().delay(200).duration(500)
        .attr("opacity", 100);

    d3.select("#highestpaidprofs-chart tspan#infoboxPerson")
        .transition().attr("opacity", 0)
    d3.select("#highestpaidprofs-chart tspan#infoboxPerson")
        .transition().delay(200).duration(1500)
        .attr("opacity", 100)
        .text(dataHighestPaidProfs[i].Person);

    d3.select("#highestpaidprofs-chart tspan#infoboxProfOf")
        .transition().attr("opacity", 0)
    d3.select("#highestpaidprofs-chart tspan#infoboxProfOf")
        .transition().delay(400).duration(1500)
        .attr("opacity", 100)
    d3.select("#highestpaidprofs-chart tspan#infoboxDiscipline")
        .text(dataHighestPaidProfs[i].Discipline);

    d3.select("#highestpaidprofs-chart tspan#infoboxAt")
        .transition().attr("opacity", 0)
    d3.select("#highestpaidprofs-chart tspan#infoboxAt")
        .transition().delay(600).duration(1500)
        .attr("opacity", 100)
    d3.select("#highestpaidprofs-chart tspan#infoboxCollege")
        .text(dataHighestPaidProfs[i].College);

    d3.select("#highestpaidprofs-chart tspan#infoboxSalary")
        .transition().attr("opacity", 0)
    d3.select("#highestpaidprofs-chart tspan#infoboxSalary")
        .transition().delay(800).duration(1500)
        .attr("opacity", 100)
    d3.select("#highestpaidprofs-chart tspan#infoboxBase")
        .text(commaFormatted(dataHighestPaidProfs[i].Base));

    d3.select("#highestpaidprofs-chart tspan#infoboxAndReceives")
        .transition().attr("opacity", 0)
    d3.select("#highestpaidprofs-chart tspan#infoboxAndReceives")
        .transition().delay(1000).duration(1500)
        .attr("opacity", 100)
    d3.select("#highestpaidprofs-chart tspan#infoboxTotal")
        .text(commaFormatted(dataHighestPaidProfs[i].TotalComp));
}
