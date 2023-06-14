  //默认选项的值
  var selectElement1 = document.querySelector('#dropdownSelect1');
  var selectedOption1 = selectElement1.options[selectElement1.selectedIndex].value;
  var selectElement2 = document.querySelector('#dropdownSelect2');
  var selectedOption2 = selectElement2.options[selectElement2.selectedIndex].value;

  var column = getColumnName(selectedOption1, selectedOption2); // 初始时根据默认值获取column的值
  console.log(column);
  function getColumnName(option1, option2) {
    return option1 + '_' + option2 + 'pub';
  }
  boxchart()

  // 动态更改选项的值
  //var column=selectedOption1+'_'+selectedOption2+'pub';
  function showSelectedOption1() {
    //var selectElement1 = document.querySelector('#dropdownSelect1');
    //var selectedOptionElement1 = document.querySelector('#selectedOption1');
    selectedOption1 = selectElement1.options[selectElement1.selectedIndex].value;
    //selectedOptionElement1.innerHTML = '选择的选项是：' + selectedOption1;
    column = getColumnName(selectedOption1, selectedOption2);
    console.log(column)
    boxchart()
  }
  function showSelectedOption2() {
    //var selectElement2 = document.querySelector('#dropdownSelect2');
    //var selectedOptionElement2 = document.querySelector('#selectedOption2');
    selectedOption2 = selectElement2.options[selectElement2.selectedIndex].value;
    //selectedOptionElement2.innerHTML = '选择的选项是：' + selectedOption2;
    column = getColumnName(selectedOption1, selectedOption2);
    console.log(column)
    boxchart()
  }
  //var column=selectedOption1+'_'+selectedOption2+'pub'
  
  function boxchart(){
  // set the dimensions and margins of the graph
  var all_width=1200;
  var all_height=460;
  var margin = {top: 10, right: 30, bottom: 50, left: 70},
      width = all_width - margin.left - margin.right,
      height = all_height - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#boxchart_div")
    .html("")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  

  d3.csv("data/YTT_SEA2.csv",function(row){
    
    var convertedRow = {};
    Object.keys(row).forEach(function(key) {
      convertedRow[key] = +row[key];
    });
    //console.log(convertedRow)
    return convertedRow;
  // return{
  //   year_delta: Number(row.year_delta), //转换为数值类型
  //   num_of_pub: +row.num_of_pub, // 转换为数值类型
  //   Discipline: row.Discipline // 字符串类型字段保持不变
  // }
  }).then(function(data) {
    var v = column//column;//'LA_top10pub';
    //筛选出所需数据
    data = data.filter(function(d) {
        return d.year >= -2;
    });
    console.log(data)
    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = Array.from(d3.group(data, function(d) { return d.year; }))
      .map(function(d) {
        //console.log(d)
        var values = Array.from(d[1], function(g) { return g[v]; }).sort(d3.ascending);
        var q1 = d3.quantile(values, 0.25);
        var median = d3.quantile(values, 0.5);
        var q3 = d3.quantile(values, 0.75);
        var interQuantileRange = q3 - q1;
        var min = q1 - 1.5 * interQuantileRange;
        var max = q3 + 1.5 * interQuantileRange;
        return {
          year:d[0],
          q1: q1,
          median: median,
          q3: q3,
          interQuantileRange: interQuantileRange,
          min: min,
          max: max
        };
      });
    console.log(sumstat)

    //sumstat获取了所有统计数据
  
    // Show the X scale
    var uniqueX = Array.from(new Set(data.map(function(d) { return d.year; })));
    var x = d3.scaleBand()
      .range([0, width])
      .domain(uniqueX)
      .padding(.4);
    // var x = d3.scaleLinear()
    //   .domain(d3.extent(data, function(d) { return d.year; }))
    //   .range([0, width])
    //   //.padding(.4);改
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain").remove()
  
    // Show the Y scale
    var y = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d[v]; }))//[4,8]
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      //.select(".domain").remove()
    
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/2+100)
      .attr("y", -margin.left/2)
      .text("Difference in productivity growth")
      .style("font-size", "12px");
  
    // Color scale
    var myColor = d3.scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain(d3.extent(data, function(d) { return d[v]; }))//[4,8]
  
    // // Add Y axis label:
    // svg.append("text")
    //     .attr("text-anchor", "end")
    //     .attr("x", 20)
    //     .attr("y", 20)
    //     .text("num");



  //       .attr("y1", marginTop)
  //       .attr("y2", height - marginBottom - 15)
  //       var all_width=1200;
  // var all_height=460;
  // var margin = {top: 10, right: 30, bottom: 50, left: 70},
  //     width = all_width - margin.left - margin.right,
  //     height = all_height - margin.top - margin.bottom;
  
    // Show the main vertical line
    svg
      .selectAll("vertLines")
      .data(sumstat)
      .enter()
      .append("line")
        .attr("x1", function(d) { return x(d.year)+ x.bandwidth() / 2;})// + x.step() / 2; 改
        .attr("x2", function(d) { return x(d.year)+ x.bandwidth() / 2;})
        .attr("y1", function(d) { return y(d.min); })
        .attr("y2", function(d) { return y(d.max); })
        .attr("stroke", "black")
        .style("width", 40);




    // create a tooltip
    var tooltip = d3.select("#boxchart_div")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "16px")
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 1)
      tooltip
          .html("<span style='color:grey'>num: </span>" + d[v]) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
          .style("left", (d3.mouse(this)[0]+30) + "px")
          .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var mousemove = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var mouseleave = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }
    // Add individual points with jitter
    var jitterWidth = 45
    svg
      .selectAll("indPoints")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return( x(d.year) + (x.bandwidth()/2) - jitterWidth/2 + Math.random()*jitterWidth )})
        .attr("cy", function(d){ return( y(d[v]))})
        .attr("r", 1.2)
        .style("fill", function(d){ return(myColor(+d[v])) })
        //.attr("stroke", "black")
        // .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        // .on("mouseleave", mouseleave)

    // rectangle for the main box
    svg
      .selectAll("boxes")
      .data(sumstat)
      .enter()
      .append("rect")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.bandwidth())
          .attr("y", function(d){return(y(d.q3))})
          .attr("height", function(d){return(y(d.q1)-y(d.q3))})
          .attr("stroke", "black")
          .style("fill", "#69b3a2")
          .style("opacity", 0.5)
  
    // Show the median
    svg
      .selectAll("medianLines")
      .data(sumstat)
      .enter()
      .append("line")
        .attr("y1", function(d){return(y(d.median))})
        .attr("y2", function(d){return(y(d.median))})
        .attr("x1", function(d){return(x(d.year) + x.bandwidth()/4)})
        .attr("x2", function(d){return(x(d.year) + 3 * x.bandwidth()/4)})
        .attr("stroke", "black")
        .style("width", 80)

        svg
      //.selectAll('indicatrix')
      .append('line')
        .attr('x1',margin.left-x.bandwidth())
        .attr('x2',all_width-margin.left-margin.right-x.bandwidth() / 2)
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("stroke", "black");
  
  
  })
}