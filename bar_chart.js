$(document).ready(function(){

    var drinkFields = ["beer_servings", "spirit_servings", "wine_servings"]
    d3.csv("./assets/drinks_bar.csv", function(error, data){

        var drinkMap = {};
        console.log(drinkMap);

        data.forEach(function(d){
            var country = d.country;
            drinkMap[country] = [];

            drinkFields.forEach(function(field){
                drinkMap[country].push(+d[field]);
            });
        });

            console.log(drinkMap);
            console.log(data);

            drawBarChart(drinkMap);
    });





function drawBarChart(drinkMap){

    var margin = {
            top: 0,
            right: 100,
            bottom: 0,
            left: 120
        },
        wth = window.innerWidth || window.documentElment.clientWidth || window.getElementsByTagName('.world_map')[0].clientWidth,
        width = wth - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;


var svg = d3.select("#bar_chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
            .domain([0, 500])
            .range([0, width]);
          svg.append("g")
            .attr("transform", "translate(0," + 210 + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
              .attr("transform", "translate(-10,0)rotate(-45)")
              .style("text-anchor", "end")
              .style("stroke", "none")
              .style("font-family", "Arial")
              .style("font-size", "12px")
              .style("font-weight","600");

  var y = d3.scaleBand()
          .range([210, 0])
          .domain(drinkFields)
          .padding(.1);

    var yAxis = d3.axisLeft(y);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .style("font-size", "14px")
          .style("font-family", "Arial")
          .style("font-weight", "600");

///////////////////////////////DRAW BARS////////////////////////////////////////////////////
function updateBars(data){

var colors = d3.scaleOrdinal()
      .range(['#ffeda0', '#feb24c', '#f03b20']);

// var colors = d3.scaleOrdinal(d3.schemeCategory10);
    var bars = svg
            .selectAll(".bar")
            .data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i){
            console.log(x(d));
            return 0;
        })
        .attr("width", function(d,i){
            // console.log(height - x(drinkFields[i]));
            return x(d);
        })

        .attr("y", function(d,i){
            console.log(drinkFields[i]);
            return y(drinkFields[i]);
        })
        .attr("height", y.bandwidth())
        .style("fill", function(d,i){
          return colors(i);
        })
        .on("mouseover", function(d,i){
              d3.select(this)
              .style("opacity", 1)
              .style("stroke", "white")
              .style("stroke-width", 3)
              .classed("bar-hover", true);
        })
        .on('mouseout', function(d) {

              d3.select(this)
                  .style("opacity",1)
                  .style("stroke", "white")
                  .style("stroke-width", 0)
                  .classed("bar-hover", false);



          })
        .on("click", function(d,i){
            console.log(d);
            console.log(i);
            console.log(drinkFields[i]);

            if(drinkFields[i] == "beer_servings"){
                console.log("hello beer servings");
            }
            else if(drinkFields[i] ==  "spirit_servings"){
                console.log("hello spirit servigns");
            }
            else if(drinkFields[i] ==  "wine_servings"){
                console.log("hello wine servings");
            }
            else{
                console.log("hello total litres");
            }
        });





        // Update old ones, already have x / width from before
        bars
            .transition().duration(250)
            .attr("x", function(d,i) { return 0; })
            .attr("width", function(d,i) { return x(d); });




            // Remove old ones
bars.exit().remove();
};
///////////////////////////////Dropdown///////////////////////////////////////
console.log(drinkMap);
var dropdownChange = function(){
    var newDrink = d3.select(this).property('value'),
        newData =  drinkMap[newDrink];

        console.log(newDrink);
        console.log(newData);

        updateBars(newData);
}


var countries = Object.keys(drinkMap).sort();

    var dropdown = d3.select("#bar_chart")
            .insert("select", "svg")
            .on("change", dropdownChange);

        dropdown.selectAll("option")
                .data(countries)
                .enter().append("option")
                .attr("value", function(d){
                    return d;
                })
                .text(function(d){
                    // console.log(d);
                    return d[0].toUpperCase() + d.slice(1, d.length); //Captialize 1st Letter
                });

    var initialData = drinkMap[ countries[0] ];
    updateBars(initialData);
    // console.log(countries)
    console.log(dropdown);

}

});
