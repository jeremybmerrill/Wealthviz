var schoolColors = [{"School":"CMC", "Color":"Maroon"}, 
                    {"School":"Scripps", "Color":"DarkGreen"}, 
                    {"School":"Pitzer", "Color":"DarkOrange"}, 
                    {"School":"Pomona", "Color":"Blue"}, 
                    {"School":"HMC", "Color":"#cc9933"}];

function cleanName(name){
    //Cleans a name (e.g. John Q. O'Panda-Faranda) into something fit for an id, e.g. JohnQOPandaFaranda
    return name.replace("-","").replace(/ /g,"").replace(".","").replace("'","");
}

var baseFunction = function(d,i){ return d.Base; };
var totalCompFunction = function(d,i){ return d.TotalComp; };


var schoolColorDict = {};
for (i in schoolColors){
    schoolColorDict[schoolColors[i]["School"]] = schoolColors[i]["Color"];
}

function schoolColor(school){
    if (school in schoolColorDict){
        return schoolColorDict[school];
    }else{
        return "Gray"
    }
}

function commaFormatted(amount){
    return d3.format(",d")(amount);
}
/*function commaFormatted(amount){
    amount = String(Array(String(amount)).reverse());
    newstring = Array();
    for (var i = 0; i < amount.length; i++){
        newstring.push(amount[i]);
        if (i % 3 == 2 && i != amount.length - 1){
            newstring.push(",")
        }
    }
    return "$" + String(newstring.join(""));
}*/
