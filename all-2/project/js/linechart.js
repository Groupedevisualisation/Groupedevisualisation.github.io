function IndexChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value for series
    defined, // for gaps in data
    curve = d3.curveLinear, // how to interpolate between points
  
    marginTop = 20, // top margin, in pixels
    marginRight = 40, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 800, // outer width, in pixels
    height = 500, // outer height, in pixels
  
    xType = d3.scaleLinear, // the x-scale type//将时间类型改为线性比例尺
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xFormat, // a format specifier string for the x-axis
  
    yType = d3.scaleLog, // the y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat = "", // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
  
    zDomain, // array of z-values
  
    //formatDate = "%b %-d, %Y", // format specifier string for dates (in the title)
    colors = d3.schemeTableau10, // array of categorical colors
  } = {}) {
  
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);
    //console.log(X)
  
    // Compute default x- and z-domains, and unique the z-domain.
    if (xDomain === undefined) xDomain = d3.extent(X); //[min,max]
    if (zDomain === undefined) zDomain = Z;
    zDomain = new d3.InternSet(zDomain); //set
  
    // Omit any data not present in the z-domain.
    const I = d3.range(X.length).filter(i => zDomain.has(Z[i])); //满足条件的index
    const Xs = d3.sort(I.filter(i => D[i]).map(i => X[i])); // for bisection(二分) later
    
    // Compute default y-domain.
    if (yDomain === undefined) {
      const r = I => d3.max(I, i => Y[i]) / d3.min(I, i => Y[i]);//最大值/最小值
  
      const k = d3.max(d3.rollup(I, r, i => Z[i]).values());
      //console.log(k)
      yDomain = [1 / k, k];
    }
    //console.log(yDomain)
  
    // Construct scales and axes.比例尺和坐标轴
    const xScale = xType(xDomain, xRange).interpolate(d3.interpolateRound); //插值
    const yScale = yType(yDomain, yRange);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisBottom(xScale).ticks(width / 40, xFormat).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(null, yFormat);
  
    // Construct formats.
    //formatDate = xScale.tickFormat(null, formatDate);
  
    // Construct a line generator.
    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y((i, _, I) => yScale(Y[i] / Y[I[0]]));//y对应的数据是比值，Y[I[0]]是基准
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .on("touchstart", event => event.preventDefault())
        .on("pointermove", pointermoved);
        
    //x轴和y轴
    svg.append("g") //group元素
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove());//没有线，只保留标签
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", d => d === 1 ? null : 0.2)
            .attr("x2", width - marginLeft - marginRight))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    const rule = svg.append("g");
  
    //指示线
    rule.append("line")
        .attr("y1", marginTop)
        .attr("y2", height - marginBottom - 15)
        .attr("stroke", "currentColor");
    //指示线的标签
    const ruleLabel = rule.append("text")
        .attr("y", height - marginBottom - 15)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr("dy", "1em");
  
    //数据绘制
    const serie = svg.append("g")
      .selectAll("g")
      .data(d3.group(I, i => Z[i]))
      .join("g");
  
    serie.append("path")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke", ([z]) => color(z))
        .attr("d", ([, I]) => line(I));
  
    serie.append("text")
        .attr("font-weight", "bold")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round")
        .attr("x", ([, I]) => xScale(X[I[I.length - 1]]))
        .attr("y", ([, I]) => yScale(Y[I[I.length - 1]] / Y[I[0]]))
        .attr("dx", 3)
        .attr("dy", "0.35em")
        .text(([z]) => z)
      .clone(true)
        .attr("fill", ([z]) => color(z))
        .attr("stroke", null);
  
    function update(date) {
      //.log(Xs)
      date = Xs[d3.bisectCenter(Xs, date)];//使用二分查找算法（d3.bisectCenter）找到在已排序的Xs数组中最接近给定date的日期
      //console.log(date)
      rule.attr("transform", `translate(${xScale(date)},0)`);//rule元素（指示线）平移
      ruleLabel.text(date); //指示线的标签//ruleLabel.text(formatDate(date));
      serie.attr("transform", ([, I]) => { //对serie元素集合中的每个元素进行转换操作
        const i = I[d3.bisector(i => X[i]).center(I, date)];
        return `translate(0,${yScale(1) - yScale(Y[i] / Y[I[0]])})`;
      });
      svg.property("value", date).dispatch("input", {bubbles: true}); //设置了 "value" 属性为给定的 date 值，然后使用 .dispatch("input", {bubbles: true}) 触发了一个自定义的 "input" 事件，并将事件传播到其他相关的元素。
    }
  
    function pointermoved(event) {
      update(xScale.invert(d3.pointer(event)[0]));//pointer用于获取事件发生时指针的坐标位置（x,y)。[0]获取x值
      //将横坐标的值 x 通过 xScale.invert 方法进行逆转换，将图表上的像素坐标转换为实际的数据值。
    }
  
    update(0);//指示线放在第一个日期所在的位置
    console.log(xDomain)
  
    return Object.assign(svg.node(), {scales: {color}, update});//这段代码将 scales 和 update 两个属性添加到 SVG 元素的 DOM 节点上。其中，scales 属性是一个对象，它包含一个名为 color 的属性，表示颜色的比例尺。update 属性是一个函数，可能用于更新图表或响应特定的事件。
  };
  
  
  d3.csv("data/YTT_year.csv",function(row){
    return{
      year_delta: Number(row.year_delta), //转换为数值类型
      num_of_pub: +row.num_of_pub, // 转换为数值类型
      Discipline: row.Discipline // 字符串类型字段保持不变
    }
  }).then(function(csvdata) {
      var indices = csvdata;
      console.log(indices)
      chart = IndexChart(indices, {
        x: d => d.year_delta,
        y: d => d.num_of_pub,
        z: d => d.Discipline,
        yLabel: "num of publication",
        width: 1000,
        height: 600
      });
      
      var container = d3.select('#linechart').append('div'); // 创建一个非SVG容器元素
      container.append(() => chart); // 将图表追加到非SVG容器元素中
    }
  );