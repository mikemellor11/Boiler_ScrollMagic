function createText(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = 0;
	var dataLast = 0;

	var att = {
		margin : {top: 0, right: 0, bottom: 0, left: 0},
		width : 35,
		height : 576,
		aspectRatio : 0.75,
		colors : ['fillA', 'fillB'],
		label : null, // string
		labelRotate : null, // left || right || null
		labelAlign : "bottom", // top || bottom || left || right
		textFormat : "{0}", // {0}value {1}percent {2}total
		textOffset : 0.2, // 0 would center both text ontop of each other
		transitionSpeed : 800,
		transitionType: 'cubic-in-out',
		delaySpeed : 1000,
		totalCount : 100,
		fontRatio : 0.12,
		decimalPlaces : 0
	};

	/* Local Scope */
	var _height,
		_width;

	chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

	var draw = chart.append('g').attr('class', 'draw');

	draw.append('text').attr('class', 'numText ' + att.colors[0])
		.attr('y', "1em")
		.attr('x', 0);

	draw.append('text').attr('class', 'infoText ' + att.colors[1])
		.attr('y', "1em")
		.attr('x', 0);

	function my(){
		$(selector).parent().css('padding-bottom', ((att.aspectRatio * 100) + '%'));

		att.height = (att.width * att.aspectRatio);

		_height = att.height - att.margin.top - att.margin.bottom;
		_width = att.width - att.margin.left - att.margin.right;

		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

		draw.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")");

		var totalHeight = 0;
		var numTextHeight = 0;

		var fontSize = parseFloat(chart.style('font-size'));

		var totalWidth = 0;
		var numTextWidth = 0;

		draw.select('.numText')
			.attr('class', 'numText ' + att.colors[0])
			.text(String.format(att.textFormat, dataLast, Math.round(((dataLast / att.totalCount) * 100)), att.totalCount))
			.each(function(){ numTextHeight = this.getBBox().height; numTextWidth = this.getBBox().width; })
			.transition()
			.delay(att.delaySpeed)
			.duration(att.transitionSpeed)
			.tween("text", function(d) {
	            var i = d3.interpolate(dataLast, data);
	            return function(t) {
	            	dataLast = parseFloat(i(t)).toFixed(att.decimalPlaces);
	                this.textContent = String.format(att.textFormat, parseFloat(i(t)).toFixed(att.decimalPlaces), Math.round(((parseFloat(i(t)).toFixed(0) / att.totalCount) * 100)), att.totalCount);
	            };
	        });

		if(att.label){
			draw.select(".infoText")
				.attr('class', 'infoText ' + att.colors[1])
				.attr('font-size', fontSize * att.fontRatio)
				.text(att.label)
				.call(wrap, (att.labelAlign === 'top' || att.labelAlign === 'bottom') ? _width : _width * 0.5)
				.attr("transform", function(){ 
					totalHeight = this.getBBox().height + numTextHeight;
					totalWidth = this.getBBox().width + numTextWidth;
					if (att.labelRotate === 'left'){
						if(att.labelAlign === 'left'){
							return "translate(" + (((_width * 0.5) + (this.getBBox().height * 0.5)) - (totalWidth * att.textOffset)) + ", " + (_height * 0.5) + ") rotate(90)";
						} else {
							return "translate(" + (((_width * 0.5) + (this.getBBox().height * 0.5)) + (totalWidth * att.textOffset)) + ", " + (_height * 0.5) + ") rotate(90)";
						}
					} else if (att.labelRotate === 'right') {
						if(att.labelAlign === 'right'){
							return "translate(" + (((_width * 0.5) - (this.getBBox().height * 0.5)) + (totalWidth * att.textOffset)) + ", " + (_height * 0.5) + ") rotate(-90)"
						} else {
							return "translate(" + (((_width * 0.5) - (this.getBBox().height * 0.5)) - (totalWidth * att.textOffset)) + ", " + (_height * 0.5) + ") rotate(-90)"
						}
					}
 
					if(att.labelAlign === 'bottom'){
						return "translate(" + (_width * 0.5) + ", " + (((_height * 0.5) - (this.getBBox().height * 0.5)) + (totalHeight * att.textOffset)) + ")";
					} else if(att.labelAlign === 'top'){
						return "translate(" + (_width * 0.5) + ", " + (((_height * 0.5) - (this.getBBox().height * 0.5)) - (totalHeight * att.textOffset)) + ")";
					} else if(att.labelAlign === 'left'){
						return "translate(" + ((_width * 0.5) - (totalWidth * att.textOffset)) + ", " + ((_height * 0.5) - (this.getBBox().height * 0.5)) + ")";
					} else {
						return "translate(" + ((_width * 0.5) + (totalWidth * att.textOffset)) + ", " + ((_height * 0.5) - (this.getBBox().height * 0.5)) + ")";
					}
				});
		}

		draw.select('.numText')
			.attr("transform", function(){ 
				if(att.labelRotate){
					if(att.labelAlign === 'left'){
						return "translate(" + ((_width * 0.5) + (totalWidth * att.textOffset)) + ", " + ((_height * 0.5) - (this.getBBox().height * 0.5)) + ")";
					} else {
						return "translate(" + ((_width * 0.5) - (totalWidth * att.textOffset)) + ", " + ((_height * 0.5) - (this.getBBox().height * 0.5)) + ")";
					}
				}

				if(att.labelAlign === 'bottom'){
					return "translate(" + (_width * 0.5) + ", " + (((_height * 0.5) - (this.getBBox().height * 0.5)) - (totalHeight * att.textOffset)) + ")";
				} else if(att.labelAlign === 'top'){
					return "translate(" + (_width * 0.5) + ", " + (((_height * 0.5) - (this.getBBox().height * 0.5)) + (totalHeight * att.textOffset)) + ")";
				} else if(att.labelAlign === 'left'){
					return "translate(" + ((_width * 0.5) + (totalWidth * att.textOffset)) + ", " + ((_height * 0.5) - (this.getBBox().height * 0.5)) + ")";
				} else {
					return "translate(" + ((_width * 0.5) - (totalWidth * att.textOffset)) + ", " + ((_height * 0.5) - (this.getBBox().height * 0.5)) + ")";
				}
			});

		return my;
	}

	my.width = function(value) {
		if (!arguments.length) return width;
		att.width = value;
		return my;
	};

	my.data = function(value) {
		if (!arguments.length) return data;
		dataLast = data;
		data = value;
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