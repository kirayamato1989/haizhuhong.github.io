var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function updateSVG(selectId){
  var objSel = document.getElementById(selectId);
  embed = document.getElementById('svg-object')
  if (objSel.value == "clear") {
    embed.setAttribute('width', "0")
    embed.setAttribute('height', "0")
  } else {
    var selectVal = "./data/" + objSel.value + ".svg";
    embed.setAttribute("src",  selectVal);
    embed.setAttribute('width', "100%")
    embed.setAttribute('height', "800")
  }

  // 由于embed内部的svg会重新绘制，所以需要重新对embed做一次svgPanZoom
  if (!embed._pzLis) {
    lastEventListener = function(){
      svgPanZoom(embed, {
        zoomEnabled: true,
        controlIconsEnabled: true
      });
    }
    embed.addEventListener('load', lastEventListener)
    embed._pzLis = true
  }
  return embed
}


function othername() {
  var inputword = document.getElementById("userInput").value;
  var corpus = document.getElementById("corpus_select").value;
  if (corpus == "clear") {
    d3.select("svg").remove();
    alert ("select a corpus first");
  } else {
    d3.select("svg").remove();
    draw(corpus, inputword);
  }
}



draw = (filename, inputs) => {//Read the data
d3.csv("./data/"+filename+"-PLOTS.csv",

  // Now I can use this dataset:
  function(data) {
    var cols = data.columns;
    if (cols.indexOf(inputs) < 0)
    {alert ("can't find word: " + inputs);}
    else {
    var svg = d3.select("#my_dataviz")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("style", "margin-left:auto; margin-right:auto; display:block")
            .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.time_index +50; })])
      .range([ 0, width ]);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
        .append("text")
          .attr("fill", "#000")
          .attr("x", 400)
          .attr("dy", "3em")
          .attr("text-anchor", "end")
          .text("Narrative Time");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d[inputs]; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y))
       .append("text")
        .attr("fill", "#000")
        .attr("y", 10)
        .attr("dy", "-1.2em")
        .attr("text-anchor", "end")
        .text("KDE");

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.time_index);})
        .y(function(d) { return y(d[inputs]); })
        );

}});
}





