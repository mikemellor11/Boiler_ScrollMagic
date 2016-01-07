function createPie(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var arc;
	var data = []; 	// Required //
					// data:num //
					
					// Optional //
					// flip:bool - label:string //

	var att = {
		width : 740,
		height : 740,
		transitionSpeed : 600,
		delaySpeed : 1000,
		colors : ['fillA', 'fillB', 'fillC', 'fillD', 'fillE'],
		showLabels : true,
		clockwise : true,
		harveyBall : false,
		totalCount : 100,
		startAngle : 0,
		labelMaxWidth : 120,
		labelPadding : 10,
		labelFormat : "{1}", // {0}value {1}label {2}total {3}percent
		showTooltip : false,
		innerRadius : 0.75,
		shadow: false,
		showBase: true,
		shadowInnerRadius : 1.05,
		showCenterPercent : 'text--alt',
		centerBackground : 'reverseColor--alt'
	}

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) {return d.data; });

    chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

    var bottom = chart.append("g")
    	.attr("class", "bottom");
	var group = chart.append("g")
		.attr("class", "slices");
	var labels = chart.append("g")
	    .attr("class", "labels");
	var lines = chart.append("g")
        .attr("class", "lines");

    if(att.centerBackground){
    	bottom.append("circle").attr("class", ("centerBackground " + att.centerBackground));
    }

    if(att.showCenterPercent){
    	bottom.append("text").attr("class", ("centerPercent " + att.showCenterPercent)).text("0%").attr('opacity', 0);	
    }

	var tooltip;

	if (d3.select('.tooltip')[0][0] === null) {
	    tooltip = d3.select("body")
            .append("div")
            .attr('class', 'tooltip');
	}
	tooltip = d3.select('.tooltip');

	function my(){
		$(selector).parent().css('padding-bottom', ((att.aspectRatio * 100) + '%'));
		
		var radius = (att.width * 0.5) - ((att.showLabels) ? (att.labelMaxWidth + att.labelPadding) : 0);

		arc = d3.svg.arc()
		    .outerRadius(radius)
		    .innerRadius(radius * att.innerRadius)
		    .startAngle(function(d) { return d.startAngle + (att.startAngle * (Math.PI/180)); })
            .endAngle(function(d) { return d.endAngle + (att.startAngle * (Math.PI/180)); });

        if(att.shadow){
        	arcShadow = d3.svg.arc()
			    .outerRadius((radius * att.innerRadius) * att.shadowInnerRadius)
		    	.innerRadius(radius * att.innerRadius)
			    .startAngle(function(d) { return d.startAngle + (att.startAngle * (Math.PI/180)); })
	            .endAngle(function(d) { return d.endAngle + (att.startAngle * (Math.PI/180)); });
        }

		if (att.showLabels) {
		    var outerArc = d3.svg.arc()
	            .innerRadius(radius * 0.9)
	            .outerRadius(radius * 0.9)
	            .startAngle(function(d) { return d.startAngle + (att.startAngle * (Math.PI/180)); })
            	.endAngle(function(d) { return d.endAngle + (att.startAngle * (Math.PI/180)); });
		}

		bottom.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");
		group.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");

		if (att.showLabels) {
		    labels.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");
		    lines.attr("transform", "translate(" + (att.width * 0.5) + "," + (att.height * 0.5) + ")");
		}

		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

		if(att.showBase){
			var harvs = bottom.selectAll('.harveyBall').data(function(){return (att.harveyBall) ? pie([{data: 1}]) : pie([]);});
		
			var gHarvs = harvs.enter()
				.append("g")
				.attr("class", "harveyBall");

			harvs.exit().remove();

			gHarvs.append("path").attr('class', 'harveyBase');

			gHarvs.select('.harveyBase')
				.attr('d', arc)
				.attr('class', 'fillFade');

			if(att.shadow){
				gHarvs.append("path").attr('class', 'harveyShadow').attr("opacity", 0.3);

				gHarvs.select('.harveyShadow')
					.attr('d', arcShadow)
					.attr('class', 'reverseColor');
			}
		}

		if(att.harveyBall){
			att.colors[1] = ['fillFade'];
			data.push({
				data: (att.totalCount - data[0].data)
			});
		}

		if(att.centerBackground){
			bottom.select('.centerBackground')
				.attr('stroke-width', radius * 0.05)
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', radius * att.innerRadius);
		}

		if(att.showCenterPercent){
			bottom.select('.centerPercent')
				.attr("y", "0.25em")
			    .attr("x", 0)
			    .attr('opacity', 1)
				.style('font-size', function(){return (((radius * 0.5 > 170)) ? 170 : (radius * 0.5)) + 'px'; })
				.transition()
				.delay(att.delaySpeed)
				.duration(att.transitionSpeed)
				.tween("text", function(d, i) {
		            var i = d3.interpolate(parseInt(this.textContent, 10), Math.round(((data[0].data / att.totalCount) * 100)));
		            return function(t) {
		                this.textContent = parseFloat(i(t)).toFixed(0) + "%";
		            };
		        });
		}

		var pies = group.selectAll(".arc").data(pie(data));

		var gPie = pies.enter()
			.append("g")
		  	.attr("class", "arc");

		pies.exit().remove();

		gPie.append("path")
			.each(function(d) {this._current = (att.clockwise) ? {value: d.data, startAngle:d.startAngle, endAngle:d.startAngle, padAngle:d.padAngle} : {value: d.data, startAngle:d.endAngle, endAngle:d.endAngle, padAngle:d.padAngle};})
			.attr('class', function (d, i) {
			    return "arcBase " + att.colors[(((att.clockwise) ? i : (data.length - 1) - i) % att.colors.length)];
			})
            .on("mouseover", function (d, i) {if(!att.showTooltip){return;} return tooltip.style("visibility", "visible").html('<h5>' + d.data.label + ' - <span class="clearBold">' + d.data.data + '</span></h5>'); })
            .on("mousemove", function () {if(!att.showTooltip){return;}
                return tooltip.style("top", (d3.event.pageY - tooltip.node().getBoundingClientRect().height - 15) + "px").style("left", (d3.event.pageX - (tooltip.node().getBoundingClientRect().width * 0.5)) + "px");
            })
            .on("mouseout", function () {if(!att.showTooltip){return;} return tooltip.style("visibility", "hidden"); });

		pies.select('.arcBase')
			.transition()
			.delay(function(d, i) { return (att.clockwise) ? (i * att.transitionSpeed) + att.delaySpeed : (((data.length - 1) - i) * att.transitionSpeed) + att.delaySpeed; })
			.duration(att.transitionSpeed)
			.attrTween("d", arcTween);

		if(att.shadow){
        	gPie.append("path")
				.each(function(d) {this._current = (att.clockwise) ? {value: d.data, startAngle:d.startAngle, endAngle:d.startAngle, padAngle:d.padAngle} : {value: d.data, startAngle:d.endAngle, endAngle:d.endAngle, padAngle:d.padAngle};})
				.attr("opacity", 0.3)
				.attr('class', function (d, i) {
				    return "arcShadow reverseColor";
				});

			pies.select('.arcShadow')
				.transition()
				.delay(function(d, i) { return (att.clockwise) ? (i * att.transitionSpeed) + att.delaySpeed : (((data.length - 1) - i) * att.transitionSpeed) + att.delaySpeed; })
				.duration(att.transitionSpeed)
				.attrTween("d", arcTweenShadow);
        }

		if (att.showLabels) {
		    var text = labels.selectAll("text")
		        .data(pie(data));

		    text.enter()
                .append("text")
                .attr('x', 0)
                .attr('y', '0.3em')
                .attr('opacity', function (d, i) {
                    if (d.data.data === 0) {
                        return 0;
                    }

                    if(att.harveyBall && i > 0){
                    	return 0;
                    }
                })
                .text(function (d) {
                    return parseLabel(d.data);
                })
                .call(wrap, att.labelMaxWidth);

            text.text(function (d) {
                    return parseLabel(d.data);
                })
                .call(wrap, att.labelMaxWidth);

		    function midAngle(d) {
		        return (d.startAngle + (att.startAngle * (Math.PI/180))) + (d.endAngle - d.startAngle) / 2;
		    }

		    text.transition().duration(att.transitionSpeed)
                .attrTween("transform", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = (radius + att.labelPadding) * (midAngle(d2) < Math.PI ? (d.data.flip) ? -1 : 1 : (d.data.flip) ? 1 : -1);
                        return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? (d.data.flip) ? "end" : "start" : (d.data.flip) ? "start" : "end";
                    };
                });

		    text.exit()
                .remove();

		    var polyline = lines.selectAll("polyline")
		        .data(pie(data));

		        polyline.enter()
                    .append("polyline")
                    .style('opacity', function (d, i) {
                        if (d.data.data === 0) {
                            return 0;
                        }

                        if(att.harveyBall && i > 0){
	                    	return 0;
	                    }
                    });

		        polyline.transition().duration(att.transitionSpeed)
                    .attrTween("points", function (d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? (d.data.flip) ? -1 : 1 : (d.data.flip) ? 1 : -1);
                            return [arc.centroid(d2), outerArc.centroid(d2), pos];
                        };
                    });

		        polyline.exit()
                    .remove();
		}
	}

	function arcTween(a) {
		var i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return arc(i(t));
		};
	}

	function arcTweenShadow(a) {
		var i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return arcShadow(i(t));
		};
	}

	function parseLabel(d) {
		return String.format(att.labelFormat, d.data, d.label, att.totalCount, Math.round(((d.data / att.totalCount) * 100)));
	}

	my.width = function(value) {
		if (!arguments.length) return att.width;
		att.width = value;
		att.height = value;
		return my;
	};

	my.data = function(value) {
		if (!arguments.length) return data;

		var createArray = [];
		for(var i = 0, len = value.length; i < len; i++){
			createArray.push(
				{ 
					"data": value[i].value,
					"label": value[i].label
				}
			);
		}

		data = createArray;
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