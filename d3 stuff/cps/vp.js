Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};


    var schoolColorDict = {};
    for (i in schoolColors){
        schoolColorDict[schoolColors[i]["School"]] = schoolColors[i]["Color"];
    }

var compFunctionVP;
compFunctionVP = baseFunction;

var dataVP; //hooray scope!

d3.csv("a.csv", function(csv){
    dataVP = csv.filter(function(d){ return d["Position"].indexOf("VP") != -1;});
    var collegesSoFar = {};
    dataVP = dataVP.filter(function(d){ return d["College"] != "Other"}); //only 5Cs
    
    dataVP.forEach(function(d,i) {
    });
    drawGraphVP(dataVP);
});

var college_x_dict = {"None": 0}; //the lexical x value for the college (e.g. for five elements, returns 1 -5)
function college_x(college){
    if (college in college_x_dict){
        return college_x_dict[college] - 1;
    }else{
        new_x = d3.max(d3.values(college_x_dict)) + 1;
        college_x_dict[college] = new_x;
        return new_x - 1;
    }
}
var college_elements = {};

function drawGraphVP(dataVP){
    var h = 550,
        w = 500,
        y = d3.scale.linear().domain([0, 1800000]).range([0, h]),
        x = d3.scale.ordinal().domain(d3.range((dataVP.map(function(d){ return d.College;})).unique().length)).rangeBands([0, w], .2);

    var current_height_dict = {}; //the height to start the next block for this college.

    function current_height(college){ //getter / init'er
        if (college in current_height_dict){
            return current_height_dict[college];
        }else{
            current_height_dict[college] = h;
            return h;
        }
    }
    var vis = d3.select("#vp-chart")
      .append("svg:svg")
        .attr("height", h + 30)
        .attr("width", w)
        .attr("id", "vpchart")
      .append("svg:g")
        .attr("transform", "translate(70,0)");

    /* Base comp bars */
    var bars = vis.selectAll("svg#vpchart")
        .data(dataVP)
        .enter()
        .append("svg:g")
        .attr("class", "bar");
    bars.append("svg:rect")
        .attr("width", x.rangeBand() * .7)
        .attr("fill", function(d,i){return schoolColor(d.College);})
        .attr("x", function(d,i){ return college_x(d.College) * 70 + 15;})
        .attr("y", function(d) {    new_y = current_height(d.College) - y(compFunctionVP(d));
                                    current_height_dict[d.College] = new_y;
                                    return new_y + .5 + 22; } )
        .attr("height", function(d) { return y(compFunctionVP(d));})
        .attr("class", function(d){ elementsSoFar = college_elements[d.College] || 0;
                                    if(elementsSoFar % 2 == 0){
                                        odd_or_even = "even";
                                    }else{
                                        odd_or_even = "odd";
                                    }
                                    college_elements[d.College] = elementsSoFar + 1;
                                    return ['bar', cleanName(d.College), odd_or_even, cleanName(d.College) + "-" + elementsSoFar, 'bar-' + college_x(d.College)].join(" "); })
        .attr("id", function(d){return cleanName(d.Person); }) //TODO: put this replace function in a utils files somewhere
        .attr("opacity", function(d){ if( d3.select("#vp-chart #" + cleanName(d.Person)).attr("class").indexOf("odd") == -1){ return .7;}else{return 1; } })
        .on("click", function(d, i){ doInfobox(d, x.rangeBand(), y(compFunctionVP(d))) ;});

    /*bars.append("svg:line") // lines separating bar components (later obsolete due to shading? Maybe not.) 
        .attr("y1", function(d) { return d3.select("#" + cleanName(d.Person)).attr("y"); } )
        .attr("y2", function(d) { return d3.select("#" + cleanName(d.Person)).attr("y"); } )
        .attr("x1", function(d,i){ return (college_x(d.College) * 70 + 15 - 10 );} )
        .attr("x2", function(d,i){ return (college_x(d.College) * 70) + x.rangeBand() + 15 + 10;} )
        .attr("z", 5)
        .attr("class", function (d) { return 'separator separator-' + college_x(d.College); })
        .attr("stroke", "black");*/
       /*.transition()
         .delay(function(d, i) { return i * 10; })
         .attr("y", y1)
         .attr("height", function(d) { return y0(d) - y1(d); });*/

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

    /*rules.append("svg:line") // visual white line things
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", h)
        .attr("y2", h)
        .attr("stroke", "white")
        .attr("stroke-opacity", .3);*/

    numerical_labels = rules.append("svg:text") //numerical tick labels.
        .attr("y", h + 4)
        .attr("x", "-3em")
        .attr("text-anchor", "middle")
        .text(y.tickFormat(10));

    vis.append("svg:line") // line between A-J and hte bars.
        .attr("y1", 20)
        .attr("y2", h + 20)
        .attr("stroke", "black");

    drawLegend(h, w);
}

function drawLegend(myh, myw){ //w and h are the w and h of the graph as it is currently drawn.
    legendx = .72 * myw;
    legendy = .15 * myh;
    var vis = d3.select("svg#vpchart")
    var legends = vis.selectAll("g.legend")
        .attr("x", legendx)
        .attr("y", legendy)
        .attr("text-anchor", "end")
        .data(schoolColors)
        .enter()
        .append("svg:g")
        .attr("class", "legend");
    legends.append("svg:rect")
            .attr("x", legendx)
            .attr("y", function(datum, index) { return legendy + index * 25 })
            .attr("height", 20)
            .attr("width", 20)
            .attr("fill", function(datum){ return datum["Color"]; } )

    legends.append("svg:text")
        .attr("x", legendx + 25)
        .attr("y", function(datum, index) { return legendy + index * 25 + 12})
        .text(function(datum){ return datum["School"]; } );
}

function commaFormatted(amount){
    amount = String(Array(String(amount)).reverse());
    newstring = Array();
    for (var i = 0; i < amount.length; i++){
        newstring.push(amount[i]);
        if (i % 3 == 2 && i != amount.length - 1){
            newstring.push(",")
        }
    }
    return "$" + String(newstring.join(""));
}
function toggleCompVP() { //take the proper version of includeOthers and compFunctionVP as arguments, change them in link target when clicked.
    if(compFunctionVP == totalCompFunction){
        compFunctionVP = baseFunction;
    }else{
        compFunctionVP = totalCompFunction;
    }
    var h = 550,
        y = d3.scale.linear().domain([0, 1800000]).range([0, h]);

    function getY(d){
        //what number am i?
        var myElem = d3.select("#vp-chart #" + cleanName(d.Person));
        var myClasses = myElem.attr("class").split(" ") // e.g. "bar bar-4 CMC CMC-2"
        var myNumber;
        var mySchool;
        for(i in myClasses){
            if(!isNaN(i) && myClasses[i].indexOf("bar") == -1){
                if(!isNaN(myClasses[i].substr(-1))){ //if last character of this class is a number
                    mySchool = myClasses[i].substr(0, myClasses[i].indexOf("-")); //e.g. CMC
                    myNumber = myClasses[i].substr(-1); //e.g. 2
                }
            }
        }
        //what's the total space taken up by the folks with lower numbers than me?
        var newBottom = 0;
        var alertstrlist = ["I am " + mySchool + "-" + myNumber]
        for(i=0; i < myNumber; i++){
            //alertstrlist.push(mySchool + "-" + i + " has height: " + parseInt(d3.select("." + mySchool + "-" + i).attr("fakeHeight")));
            newBottom = newBottom + parseInt(d3.select("#vp-chart ." + mySchool + "-" + i).attr("fakeHeight"));
            //alertstrlist.push("New total: " + String(newBottom));
        }
        //alert(alertstrlist.join("\n"));
        return h - newBottom - .5;
    }

    d3.selectAll("#vp-chart rect.bar")
       .data(dataVP)
        .attr("fakeHeight", function(d){ return y(compFunctionVP(d)); })
        .transition().duration(1000)
        .attr("height", function(d){ return y(compFunctionVP(d)); })
        .attr("y", function(d){ newy = getY(d); return newy + 22 - y(compFunctionVP(d)); }); 
}



function doInfobox(d,width,height){ //width = distance to displace tooltip rightwards, height of the element

    /* This moves the to the right of the one you clicked 100px right. I think this is actually unnecessary...
    for(i = college_x(d.College) + 1; i < jQuery.unique(dataVP.map(function(d){ return d.College;})).length; i++){
        d3.selectAll("rect.bar-" + i).transition().duration(500)
            .attr("x", (i * (width + 15) + 100)); //move 100px to the right (other methods, eg translate, didn't work, hence, hacky workaround)
        d3.selectAll("line.separator-" + i).transition().duration(500)
            .attr("x1", (i * (width + 15) + 100))
            .attr("x2", (i * (width + 15) + 100 + width)); 

    }*/
    var contentstring = [d.Position + ", " + d.College, "Base salary: " + commaFormatted(d.Base), "Total compensation: " + commaFormatted(d.TotalComp)].join("<br />");
    jQuery("#vp-chart #" + cleanName(d.Person)).qtip({
        content: {text: contentstring, title: {text: d.Person, button: 'Close'} },
        position: {
           target: jQuery("#vp-chart #" + cleanName(d.Person)),
           corner: {
              target: 'rightMiddle', 
              tooltip: 'leftMiddle',
           },
            adjust: {x: width, y: height / 2},
        },
        style: {tip: 'leftMiddle'},
        show: {ready: true, when: {event: 'click'}},
        hide: {fixed: true, when: {event: 'mouseout'}},
    });
}
