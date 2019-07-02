$(document).ready(function() {

    var margin = {
            top: 200,
            right: 0,
            bottom: 0,
            left: 0
        },
        wth = window.innerWidth || window.documentElment.clientWidth || window.getElementsByTagName('.world_map')[0].clientWidth,
        ht = window.innerHeight || window.documentElment.clientHeight || window.getElementsByTagName('.world_map')[0].clientHeight,
        width = wth - margin.left - margin.right,
        height = ht - margin.top - margin.bottom;

    var svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('class', 'map');

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(150)
        .center([0, 60])
        .translate([width / 2, height / 3.5]);

    // Data and color scale
    var data = d3.map();
    //console.log(data);
    var colorScale = d3.scaleThreshold()
        .domain([0, 2.5, 5, 7.5, 10, 12.5, 16])
        .range(["#fff",  "#ffeda0",  "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026"]);

    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "./assets/drinks_maps.csv", function(d) {

            data.set(d.code, +d.total_litres_of_pure_alcohol);
            // //console.log(data.set(d.code, +d.wine_servings))
        })
        .await(ready);




    var format = d3.format(",");

    // Set tooltips


    //console.log(data);

    function ready(error, mapData) {




        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function(d) {
                d.total = data.get(d.id) || 0;
            

              if(d.total == ""){
                return '#fff';
              }
              else{
                  return colorScale(d.total);
              }

            })
            .on('mouseover', function(d, i) {
                // tip.show(d);

                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 3)
                    .classed("country-hover", true);

                var dataRow = data.get(d.id);

                //console.log(format(dataRow));

                var xPosition = d3.event.pageX+15;
                var yPosition = d3.event.pageY+15;

                        //Update the tooltip position and value
                        d3.select("#tooltip")
                          .style("left", xPosition + "px")
                          .style("top", yPosition + "px")
                          .select("#country")
                          .text(d.properties.name);

                        d3.select("#tooltip")
                          .style("left", xPosition + "px")
                          .style("top", yPosition + "px")
                          .select("#litres_value")
                          .text(dataRow);

                        d3.select("#tooltip")
                        .classed("hidden", false)
                        .style("display", "block");



            })
            .on('mouseout', function(d) {



                d3.select(this)
                    .style("opacity",1)
                    .style("stroke", "white")
                    .style("stroke-width", 0)
                    .classed("country-hover", false);

                    d3.select("#tooltip")
                    .classed("hidden", true)
                    .style("display", "none");

            });




    }


});
