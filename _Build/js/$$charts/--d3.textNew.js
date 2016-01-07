function createTextNew(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = 0;
	var dataLast = 0;

	var att = {
		textFormat : "{0}", // {0}value {1}percent {2}total
		transitionSpeed : 800,
		transitionType: 'cubic-in-out',
		delaySpeed : 1000,
		totalCount : 100,
		decimalPlaces : 0
	};

	function my(){
		chart.text(String.format(att.textFormat, parseFloat(dataLast).toFixed(att.decimalPlaces), Math.round(((dataLast / att.totalCount) * 100)), att.totalCount))
			.transition()
			.duration(att.transitionSpeed)
			.delay(att.delaySpeed)
			.duration(att.transitionSpeed)
			.tween("text", function(d) {
	            var i = d3.interpolate(dataLast, data);
	            return function(t) {
	            	dataLast = parseFloat(i(t)).toFixed(att.decimalPlaces);
	                this.textContent = String.format(att.textFormat, parseFloat(i(t)).toFixed(att.decimalPlaces), Math.round(((parseFloat(i(t)).toFixed(0) / att.totalCount) * 100)), att.totalCount);
	            };
	        });
        return my;
	}

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