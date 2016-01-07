function createScatter(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = [];
	var input = null;
	var plotInput = false;

	var att = {
		margin : {top: 10, right: 20, bottom: 40, left: 40},
		width : 768,
		height : 432,
		transitionSpeed : 400,
		delaySpeed : 0,
		stagger : 0,
		colors :['fillA'],
		aspectRatio : 0.5625,
		xMin : "0",
		xMax : 100,
		yMin : "0",
		yMax : 100,
		yLabel : null,
        xLabel : null,
        scatterScale : 100,
        xFakeScale : ["0%", "25%", "50%", "75%", "100%"],
        yFakeScale : null
	};

	/* Local Scope */
	var _height,
		_width,
		x,
		y;

	chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

	chart.append("g")
		.attr("class", "yLabel")
		.append("text")
		.attr('y', '1em')
		.attr('x', 0);

	chart.append("g")
		.attr("class", "xLabel")
		.append("text")
		.attr('y', '0.75em')
		.attr('x', 0);

	chart.append("g")
		.attr("class", "x axis");

	chart.append("g")
		.attr("class", "y axis");

	var draw = chart.append("g")
		.attr("class", "draw");

	var top = chart.append('rect')
		.attr('fill', 'transparent')
		.on('click', function () {
			if(!plotInput) return;
			input = {x: x.invert(d3.mouse(this)[0]), y: y.invert(d3.mouse(this)[1])};

			data[0] = { 
				"x": input.x,
				"y": input.y
			}

			my();
		});

	function my(){
		$(selector).parent().css('padding-bottom', ((att.aspectRatio * 100) + '%'));
		
		att.height = (att.width * att.aspectRatio);

		_height = att.height - att.margin.top - att.margin.bottom;
		_width = att.width - att.margin.left - att.margin.right;

		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

		if(plotInput){
			top.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")")
				.attr('width', _width).attr('height', _height);
		}

		x = d3.scale.linear()
			.domain([
				(att.xMin) ? att.xMin : d3.min(data, function(d) { return d.x; }), 
				(att.xMax) ? att.xMax : d3.max(data, function(d) { return d.x; })])
		    .range([0, _width]);	

		y = d3.scale.linear()
		    .domain([
				(att.yMin) ? att.yMin : d3.min(data, function(d) { return d.y; }),
				(att.yMax) ? att.yMax : d3.max(data, function(d) { return d.y; })])
		    .range([_height, 0]);

	    var scaleX = x;
	    if(att.xFakeScale !== null){
	    	scaleX = d3.scale.ordinal()
			    .domain(att.xFakeScale)
			    .rangeBands([0, _width], 1, 0);
	    }

	    var scaleY = y;
	    if(att.yFakeScale !== null){
	    	scaleY = d3.scale.ordinal()
			    .domain(att.yFakeScale)
			    .rangeBands([_height, 0], 1, 0);
	    }

		var xAxis = d3.svg.axis()
		    .scale(scaleX)
		    .innerTickSize(-_height)
    		.outerTickSize(0)
    		.ticks(5)
    		.tickPadding(10)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(scaleY)
		    .innerTickSize(-_width)
    		.outerTickSize(0)
		    .ticks(5)
		    .tickPadding(10)
		    .orient("left");

		chart.select(".xLabel")
			.select('text')
			.text(att.xLabel)
			.call(wrap, _height)
			.attr("transform", function(){ return "translate(" + (att.margin.left + (_width * 0.5)) + ", " + (_height + att.margin.top + att.margin.bottom - this.getBBox().height) + ")"; });

		chart.select(".yLabel").attr("transform", "translate(0, " + (att.margin.top + (_height * 0.5)) + ") rotate(-90)")
			.select('text')
			.text(att.yLabel)
			.call(wrap, _width);

		chart.select(".x.axis")
			.call(xAxis)
			.attr("transform", "translate(" + att.margin.left + ", " + (att.margin.top + _height) + ")")
			.selectAll("text");

		chart.select(".y.axis")
			.call(yAxis)
			.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")")
			.selectAll("text");

		draw.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")");

		// Add the points!
		var points = draw.selectAll(".points")
			.data(data)
		
		var g_Points = points.enter()
			.append("g")
			.attr("class", "points")
		
		g_Points.append("path")
			.attr("class", function(d, i){return att.colors[(i % att.colors.length)]})
			.attr("d", d3.svg.symbol().size(0))
			.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		points.select("path")
			.transition()
			.delay(att.delaySpeed)
			.duration(att.transitionSpeed)
			.ease('linear')
			.attr("d", d3.svg.symbol().size(att.scatterScale))
			.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
	}

	my.width = function(value) {
		if (!arguments.length) return width;
		att.width = value;
		return my;
	};

	my.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return my;
	};

	my.stagger = function(value) {
		if (!arguments.length) return stagger;
		att.stagger = value;
		return my;
	};

	my.transitionSpeed = function(value) {
		if (!arguments.length) return att.transitionSpeed;
		att.transitionSpeed = value;
		return my;
	};

	my.attr = function (value) {
		if (!arguments.length) return att;
		for(var keys in value){
			if(value.hasOwnProperty(keys)){
				if(att[keys] === Object(att[keys])){
					for(var innerKeys in att[keys]){
						if(value[keys].hasOwnProperty(innerKeys)){
							att[keys][innerKeys] = value[keys][innerKeys];
						}
					}
				} else {
					att[keys] = value[keys];
				}
			}	
		}
	    return my;
	};

	my.input = function(value) {
		if (!arguments.length) return input;
		input = value;
		return my;
	};

	my.plotInput = function(value) {
		if (!arguments.length) return plotInput;
		plotInput = value;
		return my;
	};

	return my;
}