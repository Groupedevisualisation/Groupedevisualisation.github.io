country() 
    function country(){
    // The svg
    const svg = d3.select("#my_dataviz1"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    // Map and projection
    const projection = d3.geoMercator()
        .center([0,20])                // GPS of location to zoom on
        .scale(90)                       // This is like the zoom
        .translate([ width*4/7, height*4/7 ])
    
    Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("https://raw.githubusercontent.com/pkusqzhao/geo/main/finaldata.csv")
    ]).then(function (initialize) {
    
        let dataGeo = initialize[0]
        let data = initialize[1]
    
      // Create a color scale
      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.homecontinent))
        .range(d3.schemePaired);
    
      // Add a scale for bubble size
      const valueExtent = d3.extent(data, d => +d.n)
      const size = d3.scaleSqrt()
        .domain(valueExtent)  // What's in the data
        .range([ 1, 15])  // Size in pixel
    
      // Draw the map
      svg.append("g")
          .selectAll("path")
          .data(dataGeo.features)
          .join("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
          .style("stroke", "none")
          .style("opacity", .3)
    
      // Add circles:
      svg
        .selectAll("myCircles")
        .data(data.sort((a,b) => +b.n - +a.n).filter((d,i) => i<1000))
        .join("circle")
          .attr("cx", d => projection([+d.homelon, +d.homelat])[0])
          .attr("cy", d => projection([+d.homelon, +d.homelat])[1])
          .attr("r", d => size(+d.n))
          .style("fill", d => color(d.homecontinent))
          .attr("stroke", d=> {if (d.n>10) {return "black"} else {return "none"}  })
          .attr("stroke-width", 1)
          .attr("fill-opacity", .4)
    
    
    
      // Add title and explanation

     
    
      // --------------- //
      // ADD LEGEND //
      // --------------- //
    
      // Add legend: circles
      // Add legend: circles
      var valuesToShow = [1,15,50]
      var xCircle = width*1/8
      var xLabel = width*1/8+40
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("circle")
          .attr("cx", xCircle)
          .attr("cy", d => height - size(d))
          .attr("r", d => size(d))
          .style("fill", "none")
          .attr("stroke", "black")
    
      // Add legend: segments
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("line")
          .attr('x1', d => xCircle + size(d))
          .attr('x2', xLabel)
          .attr('y1', d => height - size(d))
          .attr('y2', d => height - size(d))
          .attr('stroke', 'black')
          .style('stroke-dasharray', ('2,2'))
    
      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .join("text")
          .attr('x', xLabel)
          .attr('y', d => height - size(d))
          .text(d => d)
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')
    })
  }