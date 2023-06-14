zxt1()
function zxt1(){  
const height = 500, width = 500, margin = 25;
//定义咱们的svg画布空间容器
let svg = d3.select('#zhexian1')
         .append('svg')
         .attr('width',width)
         .attr('height',height);

 //创建线性比例尺，使用坐标轴必备
const yScale = d3.scaleLinear().domain([1, 0]).range([15, width - margin*2]);
//const xScale = d3.scaleLinear().domain([2009, 2015]).range([0, width - margin*2]);
//const xScale = d3.scaleBand().domain(['2009年','2010年','2011年','2012年','2013年','2014年','2015年']).range([0, width-margin*2]);
const xScale = d3.scaleOrdinal().domain(['2009年','2010年','2011年','2012年','2013年','2014年','2015年']).range([15,90,165,240,315,390,465])

//绘制一个横着的坐标轴
function drawXAxis() {

    //创建底部的x的坐标轴
    const xAxis = d3.axisBottom(xScale);

    //使坐标轴插入svg中
    svg.append('g').attr('class','x-axis').attr('transform',function(){
        //让平移到底部x对的位置，咱们还要绘制y轴呢
        return `translate(${margin}, ${ height - margin })`
    }).call(xAxis);
}



 //绘制一个竖着的坐标轴
 function drawYAxis() {
    //创建底部的x的坐标轴
    const yAxis = d3.axisLeft(yScale);

    //使坐标轴插入svg中
    svg.append('g').attr('class','y-axis').attr('transform',function(){
        //让平移到底部x对的位置，咱们还要绘制y轴呢
        return `translate(${margin}, ${ margin })`
    }).call(yAxis);
}

function drawGrid() {
    //绘制y轴的线
    d3.selectAll('.y-axis .tick')
       .append('line')

       //大家不必疑惑这个height - margin * 2 他其实就是咱们的长度啊
       .attr('x2',(height - margin * 2))
       .attr('y2',0)
       .attr('stroke','#e4e4e4')

    //绘制x轴的线
    d3.selectAll('.x-axis .tick')
       .append('line')
       .attr('x2',0)
       .attr('y2',(- height  + margin * 2))
       .attr('stroke','#e4e4e4')
}


//数据定义, 两条线
const data = [
    [
        {x:'2009年',y:1},
        {x:'2010年',y:0.2},
        {x:'2011年',y:0.49},
        {x:'2012年',y:0.29},
        {x:'2013年',y:0.20},
        {x:'2014年',y:0.50},
        {x:'2015年',y:0},
    ]
]

function drawLine() {
    //d3.line是把数组的坐标生成一个path路径
    let line = d3.line()
            .x(function(d){
                //这个d就是咱们的data[0] 遍历的数据了 return也就是坐标 相当于帮咱们生成了一个 M0,0 L 1,2.....这个样
              return xScale(d.x)
            })
            .y(function(d){
              return yScale(d.y)
            })
            .curve(d3.curveCardinal)  //曲线效果
      
  svg.selectAll('path.path')
   .data(data)
   .enter()
   .append('path')
   .attr('class','path')
   .attr('d',function(d){
      return line(d)
    })
   .attr('stroke', '#2e6be6')
   .attr('fill', 'none')
   .attr('transform',`translate(${margin}, ${margin})`)
}


function drawCircle() {
    data.forEach(item => {
       svg.append('g')
          .selectAll('.circle')
          .data(item)
          .enter()
          .append('circle')
          .attr('class','circle')
          .attr('cx',function(d){return xScale(d.x)})
          .attr('cy', function(d){return yScale(d.y)})
          .attr('r',4)
          .attr('transform', `translate(${margin}, ${margin})`)
          .attr('fill','#fff')
          .attr('stroke','rgba(56, 8, 228, .5)')
          .style('stroke-width',0);
   });
}


function drawAnimations() {
    //连线动画
    svg.selectAll('path.path')
    .attr('stroke', '#2e6be6')
    .attr('transform','translate(25,25)')
    .style('stroke-dasharray',function(){
        return d3.select(this).node().getTotalLength()
    })
    .style('stroke-dashoffset',function(){
        return d3.select(this).node().getTotalLength()
    })
    .transition()
    .duration(2000)
    .delay(200)
    .ease(d3.easeLinear)
    
    .style('stroke-dashoffset',0);

   //圆点
   svg.selectAll('.circle')
        .style('stroke-width',0)
        .transition()
        .duration(1000)
        .delay(function(d,i){
            return i * 100
        })
        .ease(d3.easeLinear)
        .style('stroke-width',1)
} 


(async function draw() {
  await drawXAxis();
  await drawYAxis();
  await drawGrid();
  await drawLine();
  await drawCircle();
  await drawAnimations();
})();


svg
.append("text")
.attr("text-anchor", "end")
.style("fill", "black")
.attr("x", width*4/7-40)
.attr("y", height-150 )
.attr("width", 90)
.html(" ")
.style("font-size", 16)
}