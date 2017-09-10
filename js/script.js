const margin = { top: 60, right: 30, bottom: 110, left: 60 };
const height = 600 - margin.top - margin.bottom, 
			width = 1000 - margin.left - margin.right;
			
var labelFormat = function(str) {
	const curr = Date.parse(str);
	const formatting = d3.timeFormat('%Y - %B');
	return formatting(curr);
}

d3.json('GDP-data.json', function(data){
	const gdpData = data.data;
	const gdpValues = data.data.reduce(
		( acc, cur ) => acc.concat([cur[1]]),
		 []);
	const gdpDates = data.data.reduce(
		( acc, cur ) => acc.concat([cur[0]]),
		 []);
	const processedDates = gdpDates.map((elem) => Date.parse(elem));
	const maxValue = d3.max(gdpValues);
 
  
	const yScale = d3.scaleLinear()
		.domain([0, maxValue])
		.range([0, height]);

	const xScale = d3.scaleBand()
		.domain(d3.range(0, gdpData.length))
		.range([0, width])
		.paddingInner(0);
			
	var tooltip= d3.select('body').append('div')
		.classed('tooltip', true)
		.style('position', 'absolute')
		.style('padding', '0 10px')
		.style('opacity', 0);	
	
	var myChart = d3.select('#chart').append('svg')
		.attr('width', width + margin.left + margin.right)		
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
			.selectAll('rect').data(gdpData)
			.enter().append('rect')
				.style('fill', '#cb4b19')
				.attr('width', xScale.bandwidth())
				.attr('height', 0)
				.attr('x', (d, i) => xScale(i))
				.attr('y', height)
			.on('mouseover', function(d){
				
				tooltip.transition()
					.style('opacity', .9);

				 tooltip.html('<p>$'+d[1]+' billion <br/>'+ labelFormat(d[0])+'</p>')
				   	.style('left',(d3.event.pageX - 50) + 'px')
				   	.style('top', (d3.event.pageY - 50) + 'px');
				
				d3.select(this)
					.style("opacity", .5)
			})
			.on('mouseout', function(){
			 	d3.select(this)
			 		.style("opacity", 1)
			});
	
	myChart.transition()
		.attr('height', d => yScale(d[1]))
		.attr('y', d => height - yScale(d[1]))
		.delay((d, i) => i * 10)
		.duration(750)
		.ease();

	const yAxisScale = d3.scaleLinear()
		.domain([0, maxValue])
		.range([height, 0]);

	const xAxisScale = d3.scaleTime()
		.domain([d3.min(processedDates), d3.max(processedDates)])
		.range([0, width]);

	var yAxis = d3.axisLeft(yAxisScale);
	var xAxis = d3.axisBottom(xAxisScale);

	d3.select('svg').append('g')
		.attr('transform', 'translate('+margin.left+','+margin.top+')')
		.call(yAxis);
	d3.select('svg').append('g')
 		.attr('transform', 'translate('+margin.left+', '+(height+margin.top)+')')
 		.call(xAxis); 

	d3.select('svg').append('text')
	  .attr('x', 350)
		.attr('y', 40)
		.attr('class', 'chart-name')
		.text('Gross Domestic Product, USA');

	d3.select('svg').append('text')
		.attr('x', 80)
		.attr('y', 190)
		.attr('class', 'axis-title')
		.text('Billions of Dollars')
		.attr('transform', 'rotate(270, 80, 190)');

	d3.select('svg').append('text')
		.attr('x', 490)
		.attr('y', 530)
		.attr('class', 'axis-title')
		.text('Year');
 	
 	const comment = data.description;
 	const index = comment.indexOf('-');
 	const firstLine = comment.substring(0, index),
 				secondLine = comment.substring(index+1);

 	d3.select('svg').append('g')
 		.attr('class', 'comment')
 	  .append('text')
			.attr('x', 50)
			.attr('y', 560)
			.attr('class', 'chart-comment')
			.text(firstLine);
	d3.select('svg').select('g.comment')
		.append('text')
			.attr('x', 400)
			.attr('y', 580)
			.attr('class', 'chart-comment')
			.text(secondLine);
});
