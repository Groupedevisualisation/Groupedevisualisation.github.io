    // set the dimensions and margins of the graph
    const margin = {top: 40, right: 0, bottom: 40, left: 260},
        width = 650 -margin.left - margin.right,
        height =500 - margin.top - 2*margin.bottom;
    
    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              `translate(${margin.left}, ${margin.top})`);
    
    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/pkusqzhao/geo/main/tencountry.csv").then( function(data) {
    
    
    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, 32])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    // Y axis
    const y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map(function(d) { return d.Country; }))
      .padding(1);
    svg.append("g")
      .call(d3.axisLeft(y))
    
    // Lines
    svg.selectAll("myline")
      .data(data)
      .join("line")
        .attr("x1", function(d) { return x(d.Value); })
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.Country); })
        .attr("y2", function(d) { return y(d.Country); })
        .attr("stroke", "grey")
    
    // Circles
    svg.selectAll("mycircle")
      .data(data)
      .join("circle")
        .attr("cx", function(d) { return x(d.Value); })
        .attr("cy", function(d) { return y(d.Country); })
        .attr("r", "7")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
    })

   

