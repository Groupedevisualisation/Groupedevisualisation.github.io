xueke()
function xueke(){
    const WIDTH = 600;// 画布宽度
    const HEIGHT = 400;// 画布高度
    const PADDING = 30;// 画布四周空间
  
    // 数据
    let datas = [
      {
        key:"Chemistry",        
        value:"56"
      },
      {
        key:"Engineering Sci",        
        value:"56"
      },
      {
        key:"Environmental Sci",        
        value:"41"
      },
      {
        key:"Information Science",        
        value:"59"
      },
      {
        key:"Life Science",        
        value:"80"
      },
      {
        key:"Physics and Mathematics",        
        value:"78"
      }
      ];
    
    // 排序标记
    let sort_flag = false;
  
    // 生成svg画布
    d3.select('#wrap')
      .append('svg')
      .classed('container', true)
      .attr('width', WIDTH + PADDING * 2)
      .attr('height', HEIGHT + PADDING *2)
      .style('background', '#FFFFFF')
      
    // 容器画布
    let container = d3.select('.container')
    
    // x比例尺
    let xScale = d3.scaleBand()
      .domain(datas.map(d=>d.key))
      .range([0, WIDTH])
      .paddingInner(0.3)// 定义柱形之间的间隙
    let xAxis = d3.axisBottom(xScale);
  
    // y线性比例尺
    let yScale = d3.scaleLinear()
      .domain([0,d3.max(datas,d=>d.value)])
      .range([HEIGHT, 0])
    // 坐标轴从下往上，所以反过来
    let yAxis = d3.axisLeft(yScale);
   
    // x轴坐标轴展示
    container.append('g')
      .attr('id', 'xAxis')
      .attr('transform', 'translate(' + PADDING + ',' + (HEIGHT + PADDING) + ')')
      .call(xAxis)
    
    // y轴坐标轴展示
    container.append('g')
      .attr('id', 'yAxis')
      .attr('transform', 'translate(' + PADDING + ',' + PADDING + ')')
      .call(yAxis)
  
  
    // 柱状图容器
    let rectGroup = container.append('g').attr('id', 'rectGroup');
    // 文本容器
    let textGroup = container.append('g').attr('id', 'textGroup');
  
    // 加载rect
    function renderRect() {
      rectGroup.selectAll('rect')
        .data(datas)
        .enter()
        .append('rect')
        .classed('rect', true)
  
      container.selectAll('.rect')
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('x', (d, i)=>{
          return xScale(d.key) + PADDING
        })
        .attr('y', (d, i)=>{
          return HEIGHT + PADDING
        })
        .style('fill', d => '#5F9EA0')
        .transition()// 设置过渡
        .duration(300)
        .delay((d, i)=>{
          return i * 20
        })
        .attr('height', (d, i)=>{
          return HEIGHT - yScale(d.value)
        })
        .attr('y', (d, i)=>{
          return yScale(d.value) + PADDING
        })
  
    }
      
  // 加载文本
    function renderText() {
      textGroup.selectAll('text')
        .data(datas,d=>d.value)
        .enter()
        .append('text')
        .classed('text', true)
  
      textGroup.selectAll('text')
        .attr('text-anchor', 'middle')// 将文本中点设置为中心
        .text((d, i)=>{
          return d.value
        })
        .attr('x', (d, i)=>{
          return xScale(d.key) + xScale.bandwidth() / 2 + PADDING
        })
        .attr('y', HEIGHT + PADDING - 10)
        .transition()
        .duration(300)
        .delay((d, i)=>{
          return i * 20
        })
        .attr('y', (d, i)=>{
          return yScale(d.value) + PADDING - 10
        })
    }
  
    // 加载事件
    function initEvent() {
      // 离开时关闭提示
      d3.select('#wrap').on('mouseleave', ()=>{
        d3.select('#prompt').style('display', 'none')
      })
  
      // 点击排序
      d3.select('#btn-sort').on('click', ()=>{
      rectGroup.selectAll('rect')
        .sort((a, b)=>{// d3自带方法，升序降序
          return sort_flag ? d3.descending(a, b) : d3.ascending(a, b)
        })
        .transition()
        .duration(500)
        .attr('x', (d, i)=>{
          return xScale(d.key) + PADDING
        })

        textGroup.selectAll('text')
        .sort((a, b)=>{// d3自带方法，升序降序
          return sort_flag ? d3.descending(a, b) : d3.ascending(a, b)
        })
        .transition()
        .duration(500)
        .attr('x', (d, i)=>{
          return xScale(d.key) + xScale.bandwidth() / 2 + PADDING
        })
        
        sort_flag = !sort_flag;// 切换顺序
    })

    }
        
     // 视图初始化
    renderRect();
    renderText();
    initEvent();
}