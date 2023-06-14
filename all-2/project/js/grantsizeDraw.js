d3.csv("data/grantsize.csv",d3.docType)
.then(function(dataset){
    var alldata_g = [];
    var alldata_ts = [];
    var selectGroup = ['physics and mathematics', 'life science', 'chemistry','environmental and earth science', 'information science','engineering and materials science'];
    var tmp1_g = 0;
    var tmp2_g = 0;
    var tmp1_ts = 0;
    var tmp2_ts = 0;
    for(var i = 0; i < dataset.length; i++){
		    dataset[i].YTT_g = parseFloat(dataset[i].YTT_g);
        dataset[i].cohort_g = parseFloat(dataset[i].cohort_g);
        dataset[i].YTT_ts = parseFloat(dataset[i].YTT_ts);
        dataset[i].cohort_ts = parseFloat(dataset[i].cohort_ts);
        if(i%selectGroup.length===0){
          if(i>0){
            var dic_g = {'YTT': tmp1_g/selectGroup.length, 'cohort':tmp2_g/selectGroup.length, 'time':dataset[i-1].time};
            alldata_g.push(dic_g);
            tmp1_g = 0;
            tmp2_g = 0;
            var dic_ts = {'YTT': tmp1_ts/selectGroup.length, 'cohort':tmp2_ts/selectGroup.length, 'time':dataset[i-1].time};
            alldata_ts.push(dic_ts);
            tmp1_ts = 0;
            tmp2_ts = 0;
          }
        }else{
          tmp1_g += dataset[i].YTT_g;
          tmp2_g += dataset[i].cohort_g;
          tmp1_ts += dataset[i].YTT_ts;
          tmp2_ts += dataset[i].cohort_ts;
        }
        if(i === dataset.length - 1){
          var dic_g = {'YTT': tmp1_g/selectGroup.length, 'cohort':tmp2_g/selectGroup.length, 'time':dataset[i-1].time};
          alldata_g.push(dic_g);
          var dic_ts = {'YTT': tmp1_ts/selectGroup.length, 'cohort':tmp2_ts/selectGroup.length, 'time':dataset[i-1].time};
          alldata_ts.push(dic_ts);
        }
	  } 
    
    selectGroup.push("all");
    d3.select("#selectButton")
    .selectAll('myOptions')
    .data(selectGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
    function update(selectedGroup) {
      if(selectedGroup == "all"){
        d3.select("#grantchart svg").remove();
        d3.select("#teamsizechart svg").remove();
        
        DivergingBarChart(alldata_g, {
          x: d => (d['YTT'] - d['cohort'])/d['cohort'],
          y: d => d.time,
          xFormat: "+,%" ,
          xLabel: "← Counterparts · YTT →",
          marginRight: 70,
          marginLeft: 70,
          colors: d3.schemeCategory10,
        },"#grantchart")
        DivergingBarChart(alldata_ts, {
          x: d => (d['YTT'] - d['cohort'])/d['cohort'],
          y: d => d.time,
          xFormat: "+,%" ,
          xLabel: "← Counterparts · YTT →",
          marginRight: 70,
          marginLeft: 70,
          colors: d3.schemeCategory10,
        },"#teamsizechart")
      }else{
        d3.select("#grantchart svg").remove();
        d3.select("#teamsizechart svg").remove();
        
        var data = [];
        for(var i = 0; i < dataset.length; i++){
          if (dataset[i].discipline == selectedGroup){
              data.push(dataset[i]);
          }
        }
        // console.log(data);
        DivergingBarChart(data, {
          x: d => d['cohort_g'] > 0 ?(d['YTT_g'] - d['cohort_g'])/d['cohort_g'] : 0,
          y: d => d.time,
          xFormat: "+,%" ,
          xLabel: "← Counterparts · YTT →",
          marginRight: 70,
          marginLeft: 70,
          colors: d3.schemeCategory10,
        },"#grantchart")
        DivergingBarChart(data, {
          x: d => d['cohort_ts'] > 0 ?(d['YTT_ts'] - d['cohort_ts'])/d['cohort_ts'] : 0,
          y: d => d.time,
          xFormat: "+,%" ,
          xLabel: "← Counterparts · YTT →",
          marginRight: 70,
          marginLeft: 70,
          colors: d3.schemeCategory10,
        },"#teamsizechart")
      }
    }
    d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption)
  })
    var origin = [];
    for(var i = 0; i < dataset.length; i++){
      if (dataset[i].discipline == selectGroup[0]){
            origin.push(dataset[i]);
        }
    }
    DivergingBarChart(origin, {
      x: d => d['cohort_g'] > 0 ?(d['YTT_g'] - d['cohort_g'])/d['cohort_g'] : 0,
      y: d => d.time,
      xFormat: "+,%" ,
      xLabel: "← Counterparts · YTT →",
      marginRight: 70,
      marginLeft: 70,
      colors: d3.schemeCategory10,
    },"#grantchart")
    DivergingBarChart(origin, {
      x: d => d['cohort_ts'] > 0 ?(d['YTT_ts'] - d['cohort_ts'])/d['cohort_ts'] : 0,
      y: d => d.time,
      xFormat: "+,%" ,
      xLabel: "← Counterparts · YTT →",
      marginRight: 70,
      marginLeft: 70,
      colors: d3.schemeCategory10,
    },"#teamsizechart")
})

