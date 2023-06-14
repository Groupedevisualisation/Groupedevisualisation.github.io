var w = 700,
	h = 500;
var colorscale = d3.scaleOrdinal(d3.schemePastel1);
//Options for the Radar chart, other than default
var mycfg = {
	w: w,
	h: h,
	maxValue: 0.6,
	levels: 6,
	ExtraWidthX: 300,
}

//Legend titles
const LegendOptions = ['Receiver','Rejector'];

// get data from csv
const Axises = ['top100','PI','avg_pub','avg_FA_pub','avg_FA_top10pub','avg_LA_pub','avg_LA_top10pub','grant_nlg'];
const AxisesMap = ['PhD from globally top-100 STEM program','Overseas faculty appointments','Articles per year (ln)','First-authored articles per year',
'First-authored articles in top 10% of journals per year','Last-authored articles per year','Last-authored articles in top 10% of journals per year',
'Research funding $10 k per year (lg)']
// References:https://gist.github.com/d3noob/ca63722085de611bee1e620097b03c94
d3.csv("data/acceptor_rejector.csv",d3.docType)
.then(function(dataset){
	var acceptor = [];
	var rejector = [];
	
	// get data splited by reject 
	for(var i = 0; i < dataset.length; i++){
		if(dataset[i].reject == "0"){
			acceptor.push(dataset[i]);
		}else{
			rejector.push(dataset[i]);
		}
	}
	
	// compute the mean by every axis
	var accpetor_mean = [];
	var rejector_mean = [];
	var mean_data = [];

	for(var i =0; i< Axises.length; i++){
		var axis = Axises[i];
		var sum1 = 0;
		var mean1 = 0;
		acceptor.forEach(function(d){
			var value = 0;
			if(d[axis] != "NA"){
				value = parseFloat(d[axis]);
			}
			return sum1 += value;});

		if(axis == 'grant_nlg'){
			mean1 = d3.format('.3f')(Math.log10(sum1/(acceptor.length*1000)));
		}else{
			if(axis === "avg_pub"){
				mean1 = d3.format('.3f')(Math.log(sum1/acceptor.length));
			}else{
				mean1 = d3.format('.3f')(sum1/acceptor.length);
			}
			
		}

		var dic1 = {'axis':AxisesMap[i],'value':parseFloat(mean1)};
		accpetor_mean.push(dic1);

		var sum2 = 0;
		var mean2 = 0;
		rejector.forEach(function(d){
			var value = 0;
			if(d[axis] != "NA"){
				value = parseFloat(d[axis]);
			}
			return sum2 += value;});

		if(axis == 'grant_nlg'){
			mean2 = d3.format('.3f')(Math.log10(sum2/(rejector.length*1000)));
		}else{
			if(axis === "avg_pub"){
				mean2 = d3.format('.3f')(Math.log(sum2/rejector.length));
			}else{
				mean2 = d3.format('.3f')(sum2/rejector.length);
			}
		}
		var dic2 = {'axis':AxisesMap[i],'value':parseFloat(mean2)};
		rejector_mean.push(dic2);
	}
	mean_data.push(accpetor_mean);
	mean_data.push(rejector_mean);
	
	// Draw RadarChart
	RadarChart.draw("#radarchart", mean_data, mycfg);

	// Initiate Legend
	var svg = d3.select('#radarchart')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

	//Create the title for the legend
	var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 20)
	.attr("font-size", "18px")
	.attr("font-weight","bold")
	.attr("fill", "#404040")
	.text("Class");
	
	//Initiate Legend	
	var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)	
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') ;

	//Create colour squares
	legend.selectAll('rect')
	.data(LegendOptions)
	.enter()
	.append("rect")
	.attr("x", w - 85)
	.attr("y", function(d, i){ return i * 20 + 15;})
	.attr("width", 15)
	.attr("height", 15)
	.style("fill", function(d, i){ return colorscale(i);});

	//Create text next to squares
	legend.selectAll('text')
	.data(LegendOptions)
	.enter()
	.append("text")
	.attr("x", w - 62)
	.attr("y", function(d, i){ return i * 22 + 25;})
	.attr("font-size", "13px")
	.attr("fill", "#737373")
	.text(function(d) { return d; });	
})

