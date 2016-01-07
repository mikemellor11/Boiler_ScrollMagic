function createBubble(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = [];

	var att = {
		margin : {top: 0, right: 0, bottom: 60, left: 70},
		padding : {inner: 0.2, outer: 0.2},
		width : 1024,
		height : 512,
		transitionSpeed : 800,
		delaySpeed : 1000,
		staggerSpeed : 200,
		labels : false,
		aspectRatio : 0.5,
		colors : ['fillA', 'fillB', 'fillC', 'fillD', 'fillE'], 
		yLabel : "",
        xLabel : "",
        sizeModifier : 0,
        yMin : null,
        yMax : null,
        ordinalY : null,
        ordinalX : null
	}

	/* Local Scope */
	var _height,
		_width;

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

	var bottom = chart.append("g")
		.attr("class", "bottom");

	var draw = chart.append("g")
		.attr("class", "draw");

	function my(){
		$(selector).parent().css('padding-bottom', ((att.aspectRatio * 100) + '%'));

		att.height = (att.width * att.aspectRatio);

		_height = att.height - att.margin.top - att.margin.bottom;
		_width = att.width - att.margin.left - att.margin.right;

		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

		renderAxis();

		_sizeMax = d3.max(data, function(d, i) { return d3.max(d.values, function(d){ return +d.value; }); });
		_bubbleMaxX = _x.rangeBand() * 0.5;
		_bubbleMaxY = _y.rangeBand() * 0.5;

		var groups = draw.selectAll('.group').data(data);

		var gGroups = groups.enter().append('g').attr('class', 'group');

		groups.exit()
			.transition()
			.duration(att.transitionSpeed)
    		.style("opacity", 0)
    		.remove();

		groups.each(function(sectionData, sectionIndex) {
			var bubbles = d3.select(this).selectAll('.groups').data(sectionData.values);

			var gBubbles = bubbles.enter().append('g').attr('class', 'bubble');

			gBubbles.append("circle")
				.attr('class', function (d, i) {if(+d.value === +_sizeMax){return 'fillD';} return att.colors[i % att.colors.length]; })
				.attr("cx", function(d, i) { return (_x(d.key) + _bubbleMaxX); })
				.attr("cy", function(d, i) { return _y(sectionData.key) + _bubbleMaxY; })
				.attr("r", 0);

			bubbles.select('circle').transition()
				.delay(function(d, i) {return (i * att.staggerSpeed) + att.delaySpeed; })
				.duration(att.transitionSpeed)
				.attr("cx", function(d, i) { return (_x(d.key) + _bubbleMaxX); })
				.attr("cy", function(d, i) { return _y(sectionData.key) + _bubbleMaxY; })
				.attr("r", function(d, i) {
					return (((+d.value + ((_sizeMax - +d.value) * att.sizeModifier)) / _sizeMax) * _bubbleMaxX); 
				});

			/*gBubbles.append("text")
				.attr("y", '1em')
				.attr("x", 0)
				.attr("transform", function(d, i){ return "translate(" + (_x(d.xAxis) + _bubbleMaxX) + ", " + _y(+d.yAxis) + ")"; })
				.attr('opacity', 0);

			bubbles.select('text')
				.text(function(d, i){ return d.valueLabel; })
				.call(wrap, _x.rangeBand())
				.transition()
				.delay(function(d, i) {return (i * att.staggerSpeed) + att.delaySpeed; })
				.duration(att.transitionSpeed)
				.attr('class', function (d, i){
					var radius = ((((+d.value + ((_sizeMax - +d.value) * att.sizeModifier)) / _sizeMax) * _bubbleMaxX) * 2);
					if(radius < this.getBBox().width) {
						return "reverseColor";
					}
					return '';
				})
				.attr("transform", function (d, i){ 
					var radius = ((((+d.value + ((_sizeMax - +d.value) * att.sizeModifier)) / _sizeMax) * _bubbleMaxX) * 2);
					if(radius < this.getBBox().width) {
						return "translate(" + (_x(d.xAxis) + _bubbleMaxX) + ", " + (_y(+d.yAxis) + (radius * 0.5)) + ")";
					}
					return "translate(" + (_x(d.xAxis) + _bubbleMaxX) + ", " + (_y(+d.yAxis) - (this.getBBox().height * 0.5)) + ")";
				})
				.attr('opacity', 1);*/

			bubbles.exit()
				.transition()
				.duration(att.transitionSpeed)
	    		.style("opacity", 0)
	    		.remove();
		});

		return my;
	}

	function renderAxis() {
		chart.select(".yLabel").attr("transform", "translate(0, " + (att.margin.top + (_height * 0.5)) + ") rotate(-90)")
			.select('text')
			.text(att.yLabel)
			.call(wrap, _height);

		chart.select(".xLabel")
			.select('text')
			.text(att.xLabel)
			.call(wrap, _width)
			.attr("transform", function(){ return "translate(" + (att.margin.left + (_width * 0.5)) + ", " + (_height + att.margin.top + att.margin.bottom - this.getBBox().height) + ")"; });

		if(att.ordinalX){
			_x = d3.scale.ordinal()
			    .domain(att.ordinalX)
			    .rangeBands([0, _width], att.padding.inner, att.padding.outer);
	    } else {
	    	_x = d3.scale.ordinal()
			    .domain(data.map(function(d){ return d.xAxis;}))
			    .rangeBands([0, _width], att.padding.inner, att.padding.outer);
	    }

	    if(att.ordinalY){
			_y = d3.scale.ordinal()
			    .domain(att.ordinalY)
			    .rangeBands([_height, 0], att.padding.inner, att.padding.outer);
	    } else {
	    	_y = d3.scale.linear()
			    .domain([
					(att.yMin) ? att.yMin : d3.min(data.data, function(d) { return +d.yAxis; }), 
					(att.yMax) ? att.yMax : d3.max(data.data, function(d) { return +d.yAxis; })])
			    .range([_height, 0]);
	    }

		_xAxis = d3.svg.axis()
		    .scale(_x)
		    .innerTickSize(0)
    		.outerTickSize(1)
    		.tickPadding(10)
		    .orient("bottom");

		_yAxis = d3.svg.axis()
		    .scale(_y)
		    .innerTickSize(0)
    		.outerTickSize(1)
    		.tickPadding(10)
		    .orient("left");

		chart.select(".x.axis")
			.attr("transform", "translate(" + att.margin.left + ", " + (att.margin.top + _height) + ")")
			.call(_xAxis)
			.each(function(){
				d3.select(this).selectAll('text')
					.attr("y", '1.5em')
					.attr("x", 0)
					.call(wrap, _x.rangeBand());
			});

		chart.select(".y.axis")
			.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")")
			.call(_yAxis);

		bottom.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");
		draw.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");
	}

	my.width = function(value) {
		if (!arguments.length) return att.width;
		att.width = value;
		return my;
	};

	my.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		return my;
	};

	my.stagger = function(value) {
		if (!arguments.length) return att.stagger;
		att.stagger = value;
		return my;
	};

	my.attr = function (value) {
		if (!arguments.length) return att;
		for(var keys in value){
			if(value.hasOwnProperty(keys)){
				if(att[keys] === Object(att[keys])){
					if(att[keys].constructor === Array){
						att[keys] = value[keys];
					} else {
						for(var innerKeys in att[keys]){
							if(value[keys].hasOwnProperty(innerKeys)){
								att[keys][innerKeys] = value[keys][innerKeys];
							}
						}
					}
				} else {
					att[keys] = value[keys];
				}
			}	
		}
	    return my;
	}

	return my;
}