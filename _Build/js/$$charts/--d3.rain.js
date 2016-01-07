function createRain(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = [];

	var att = {
		margin : {top: 0, right: 0, bottom: 40, left: 0},
		padding : {right: 0, left: 0},
		width : 768,
		height : 432,
		transitionSpeed : 600,
		transitionType: 'cubic-in-out',
		delaySpeed : 0,
		stagger : 50,
		colors :[],
		aspectRatio : 0.5
	};

	/* Local Scope */
	var _height,
		_width;

	chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

	var bottom = chart.append("g")
		.attr("class", "bottom");

	var draw = chart.append("g")
		.attr("class", "draw");

	function my(){
		$(selector).parent().css('padding-bottom', ((att.aspectRatio * 100) + '%'));

		att.height = (att.width * att.aspectRatio);

		var _padding = {
			right: att.padding.right * att.width,
			left: att.padding.left * att.width
		};

		_height = att.height - att.margin.top - att.margin.bottom;
		_width = att.width - att.margin.left - att.margin.right;

		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

		bottom.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");
		draw.attr("transform", "translate(" + att.margin.left + "," + att.margin.top + ")");

		var x = d3.scale.ordinal()
		    .domain(data.map(function(d){ return d.date;} ))
		    .rangeBands([0, _width], 0, 0);

	    var y = d3.scale.linear()
		    .domain([0, 31])
		    .range([0, _height]);

		var drips = draw.selectAll(".drips").data(data);

		var gDrips = drips.enter()
			.append("g")
		  	.attr("class", "drips")
		  	.attr("transform", function(d){ return "translate(" + (x(d.date) + (x.rangeBand() * 0.5)) + ", 0)"; });

	  	gDrips.append("line")
		  	.attr("class", "drip")
			.attr("x1", 0)
		    .attr("x2", 0)
		    .attr("y1", 0)
		    .attr("y2", 0)
		    .attr('opacity', 0);

		drips.select('.drip')
			.transition()
			.ease(att.transitionType)
			.delay(function(d, i) {return (i * att.stagger) + att.delaySpeed; })
			.duration(att.transitionSpeed)
		    .attr("y2", function(d){ return y(d.value); })
		    .attr('opacity', 1);

	    gDrips.append("text")
			.text(function(d){ return d.date; })
			.attr("transform", function(d){ return "translate(0, 0)"; })
			.attr('opacity', 0);

		drips.select('text')
			.text(function(d){ return d.date; })
			.transition()
			.ease(att.transitionType)
			.delay(function(d, i) {return (i * att.stagger) + att.delaySpeed; })
			.duration(att.transitionSpeed)
			.attr("transform", function(d){ return "translate(0, " + (y(d.value) + this.getBBox().height) + ")"; })
			.attr('opacity', 1);

	    drips.exit().remove();
	}

	my.width = function(value) {
		if (!arguments.length) return width;
		att.width = value;
		return my;
	};

	my.data = function(value) {
		if (!arguments.length) return data;
		for(var i = 0; i < value[0].length; i++){
		   	data.push({
		   		date:value[0][i],
		   		value:value[1][i]
			});
		}
		return my;
	};

	my.stagger = function(value) {
		if (!arguments.length) return att.stagger;
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
	}

	return my;
}