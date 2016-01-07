function createBar(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = []; 	// Required //
					// key:string - values:[] ++ key:string - values:[] ++ values:[] ++ id:string - value:num //
					
					// Optional //
					//  //

	var att = {
		margin : {top: 10, right: 10, bottom: 40, left: 10},
		padding : {right: 0.02, left: 0.02},
		width : 768,
		height : 432,
		barGap : 0.1,
		groupGap : 0.02,
		sectionGap : 0.1,
		transitionSpeed : 800,
		transitionType: 'cubic-in-out',
		delaySpeed : 1000,
		stagger : 30,
		cornerRadius : 0.05,
		foreignObjects : false,
		colors :['fillA', 'fillB'],
		aspectRatio : 0.4,
		spacePadding : 0.6,
		yMin : null,
		yMax : null,
		displaySection: false,
		displayGroup : false,
		displayBar : false,
		displayTrunk : true,
		yLabel : "",
        xLabel : "",
        sectionOrder : null,
        groupOrder : null,
        barOrder : null,
        shadow: true,
        dataLevels: 3,
        showYAxis: false,
        showXAxis: true
	};

	/* Local Scope */
	var _height,
		_width;

	chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

	if(att.foreignObjects){
		chart.append("svg:foreignObject")
			.attr("class", "yLabel")
		    .append("xhtml:div");

		chart.append("svg:foreignObject")
			.attr("class", "xLabel")
		    .append("xhtml:div");
	} else {
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
	}

	chart.append("g")
		.attr("class", "y axis");

	chart.append("g")
		.attr("class", "x axis")
		.append("line");

	var draw = chart.append("g")
		.attr("class", "draw");

	var top = chart.append("g")
		.attr("class", "top");

	function my(){
		$(selector).parent().css('padding-bottom', ((att.aspectRatio * 100) + '%'));
		
		att.height = (att.width * att.aspectRatio);
		var fontSize = parseFloat(chart.style('font-size'));

		var _padding = {
			right: att.padding.right * att.width,
			left: att.padding.left * att.width
		};

		_height = att.height - att.margin.top - att.margin.bottom;
		_width = att.width - att.margin.left - att.margin.right;

		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

		var axisSpace = 0;
		var sectionSpace = 0;
		var groupSpace = 0;
		var spacePadding = att.spacePadding * fontSize;
		var _barGap;
		var _groupGap;
		var _sectionGap;

	    var calcMax = (!att.yMax) ? d3.max(data, function(d){
	    		return d3.max(d.values, function(d) {
	    			return d3.max(d.values, function(d) {
		    			return d3.max(d.values, function(d) {
			    			return +d.value; 
			    		});
		    		}); 
	    		});
	    	}) : +att.yMax;

	    var calcMin = (!att.yMin) ? d3.min(data, function(d){
	    		return d3.min(d.values, function(d) {
	    			return d3.min(d.values, function(d) {
		    			return d3.min(d.values, function(d) {
			    			return +d.value; 
			    		});
		    		}); 
	    		});
	    	}) : +att.yMin;

    	if(calcMin > 0){
	    	calcMin = 0;
	    }

		var maxBars = d3.max(data, function(d){
	    		return d3.max(d.values, function(d) {
	    			return d.values.length;
	    		});
	    	});

		var maxGroup = d3.max(data, function(d){
	    		return d.values.length
	    	});

		_sectionGap = att.sectionGap * _width;

		var sectionWidth = ((_width - _padding.left - _padding.right - (_sectionGap * (data.length - 1))) / data.length);

		_groupGap = att.groupGap * sectionWidth;

		var groupWidth = ((sectionWidth - (_groupGap * (maxGroup - 1))) / maxGroup);

		_barGap = att.barGap * groupWidth;

		var barWidth = ((groupWidth - (_barGap * (maxBars - 1))) / maxBars);

		var y = d3.scale.linear()
		    .domain([calcMin, calcMax])
		    .range([_height, 0]);

	    if(att.showYAxis){
	    	var yAxis = d3.svg.axis()
			    .scale(y)
			    .innerTickSize(-_width)
	    		.outerTickSize(0)
			    .ticks(5)
			    .tickPadding(10)
			    .orient("left");
	    }

	    if(att.foreignObjects) {
	    	chart.select(".xLabel")
			    .attr("width", _width)
			    .select('div')
		        .html(att.xLabel)
		        .each(function(){
		        	if(att.xLabel){
		        		axisSpace = this.clientHeight + spacePadding;
		        	}
		        	d3.select(this.parentNode).attr("height", axisSpace)
		        	d3.select(this.parentNode).attr("transform", "translate(" + (att.margin.left) + ", " + (_height + att.margin.top + att.margin.bottom - this.clientHeight) + ")")
		        });

	    	chart.select(".yLabel")
				.attr("transform", "translate(0, " + (att.margin.top + _height) + ") rotate(-90)")
			    .attr("width", _height)
			    .select('div')
		        .html(att.yLabel)
		        .each(function(){
		        	d3.select(this.parentNode).attr("height", this.clientHeight)
		        });
	    } else {
	    	chart.select(".xLabel")
				.select('text')
				.text(att.xLabel)
				.call(wrap, _width)
				.attr("transform", function(){ return "translate(" + (att.margin.left + (_width * 0.5)) + ", " + (_height + att.margin.top + att.margin.bottom - this.getBBox().height) + ")"; })
				.each(function(){
					if(att.xLabel){
						axisSpace = this.getBBox().height + spacePadding;
					}
				});

	    	chart.select(".yLabel").attr("transform", "translate(0, " + (att.margin.top + (_height * 0.5)) + ") rotate(-90)")
				.select('text')
				.text(att.yLabel)
				.call(wrap, _height);
	    }

	    if(att.showXAxis){
			chart.select(".x.axis line")
			    .attr("x1", (att.margin.left - 1))
			    .attr("x2", (att.margin.left + _width + 1))
			    .attr("y1", (_height + att.margin.top))
			    .attr("y2", (_height + att.margin.top));
		}

	    if(att.showYAxis){
			chart.select(".y.axis")
				.attr("transform", "translate(" + att.margin.left + ", " + att.margin.top + ")")
				.transition()
				.ease(att.transitionType)
		    	.duration(att.transitionSpeed)
				.call(yAxis)
				.selectAll("text");
		}

		// SECTIONS //

		// DATA //
		var sections = draw.selectAll(".sections").data(data, function(d, i){return d.key;});

	    // APPENDS //
	    var g_Section = sections.enter().append("g")
			.attr('class', 'sections')
			.attr("transform", function(d, i) { return "translate(" + ((getSectionIndex(i) * (sectionWidth + _sectionGap)) + (att.margin.left + _padding.left)) + ", " + att.margin.top + ")"; });

		if(att.foreignObjects) {
			g_Section.append("svg:foreignObject")
				.attr("opacity", 0)
			    .attr("width", sectionWidth)
			    .attr("class", "sectionLabel")
			    .append("xhtml:div")
	            .html(function(d) {return d.key;})
	            .each(function(){
	            	if(sectionSpace < this.clientHeight && att.displaySection){
	            		sectionSpace = this.clientHeight + spacePadding;
	            	}
		        	d3.select(this.parentNode).attr("height", this.clientHeight)
		        	d3.select(this.parentNode).attr("transform", "translate(0, " + (_height + att.margin.bottom - this.clientHeight - axisSpace) + ")")
		        });
		} else {
			g_Section.append("g")
				.attr("class", "sectionLabel")
				.attr("opacity", 0)
				.append("text")
				.attr('y', "0.75em")
				.attr('x', 0)
				.text(function(d) {return d.key;})
				.call(wrap, sectionWidth)
				.attr("transform", function(){ return "translate(" + (sectionWidth * 0.5) + ", " + (_height + att.margin.bottom - axisSpace - this.getBBox().height) + ")"; })
				.each(function(){
					if(sectionSpace < this.getBBox().height && att.displaySection){
	            		sectionSpace = this.getBBox().height + spacePadding;
	            	}
				});
		}

        g_Section.append("line")
        	.attr("class", "average")
		    .attr("stroke-dasharray", "10, 5")
		    .attr("x1", (-_sectionGap * 0.5))
		    .attr("x2", (-_sectionGap * 0.5))
		    .attr("y1", function(){
		    	return _height;
		    })
		    .attr("y2", function(){
		    	return att.margin.top;
		    })
		    .style("opacity", 0);

		// SELECTS //
		sections.transition()
			.ease(att.transitionType)
			.duration(att.transitionSpeed)
			.style("opacity", 1)
			.attr("transform", function(d, i) {return "translate(" + ((getSectionIndex(i) * (sectionWidth + _sectionGap)) + (att.margin.left + _padding.left)) + ", " + att.margin.top + ")"; });

		sections.select('.sectionLabel')
			.transition()
			.ease(att.transitionType)
			.duration(att.transitionSpeed)	
			.attr('opacity', function(){if(att.displaySection){return 1;} return 0;});

		sections.select('.average')
			.transition()
			.ease(att.transitionType)
			.duration(att.transitionSpeed)
			.style("opacity", function(d, i){
		    	if(getSectionIndex(i) === 0) {return 0;}
		    	return 1;
		    });

		sections.exit()
			.transition()
			.ease(att.transitionType)
			.duration(att.transitionSpeed)
    		.style("opacity", 0)
    		.remove();

		sections.each(function(sectionData, sectionIndex) {
				// GROUPS //

				// DATA //
				var groups = d3.select(this).selectAll('.groups').data(function(d, i){return d.values;}, function(d, i){return d.key;});

			    // APPENDS //
			    var g_Groups = groups.enter().append("g")
					.attr('class', 'groups')
					/*.attr('font-size', function(){return ((groupWidth * 0.10 > 30)) ? 30 : (groupWidth * 0.10); })*/
					.style("opacity", 0)
					.attr("transform", function(d, i) { return "translate(" + ((getGroupIndex(i) * (groupWidth + _groupGap))) + ", 0)"; });

				if(att.foreignObjects) {
					g_Groups.append("svg:foreignObject")
						.attr("opacity", 0)
					    .attr("width", groupWidth)
					    .attr("class", "groupLabel")
					    .append("xhtml:div")
			            .html(function(d) {return d.key;})
			            .each(function(){
			            	if(groupSpace < this.clientHeight && att.displayGroup){
			            		groupSpace = this.clientHeight + spacePadding;
			            	}
				        	d3.select(this.parentNode).attr("height", this.clientHeight)
				        	d3.select(this.parentNode).attr("transform", "translate(0, " + (_height + att.margin.bottom - this.clientHeight - axisSpace - sectionSpace) + ")")
				        });
				} else {
					g_Groups.append("g")
						.attr("class", "groupLabel")
						.attr("opacity", 0)
						.append("text")
						.attr('y', "0.75em")
						.attr('x', 0)
						.text(function(d) {return d.key;})
						.call(wrap, groupWidth)
						.attr("transform", function(){ return "translate(" + (groupWidth * 0.5) + ", " + (_height + att.margin.bottom - axisSpace - sectionSpace - this.getBBox().height) + ")"; })
						.each(function(){
			            	if(groupSpace < this.getBBox().height && att.displayGroup){
			            		groupSpace = this.getBBox().height + spacePadding;
			            	}
						});
				}

		        // SELECTS //
		        groups.transition()
		        .ease(att.transitionType)
					.duration(att.transitionSpeed)
					/*.attr('font-size', function(){return ((groupWidth * 0.10 > 30)) ? 30 : (groupWidth * 0.10); })*/
					.style("opacity", 1)
		        	.attr("transform", function(d, i) { return "translate(" + ((getGroupIndex(i) * (groupWidth + _groupGap))) + ", 0)"; });

				groups.select('.groupLabel')
					.transition()
					.ease(att.transitionType)
					.duration(att.transitionSpeed)
					.attr('opacity', function(){if(att.displayGroup){return 1;} return 0;});

		        groups.exit()
					.transition()
					.ease(att.transitionType)
			    	.duration(att.transitionSpeed)
			    	.style("opacity", 0)
			    	.remove();

				groups.each(function(groupData, groupIndex) {
						// BARS //

						var calcMaxGroup = d3.max(groupData.values, function(d) {
			    			return d3.max(d.values, function(d) {
				    			return +d.value; 
				    		}); 
			    		});

						// DATA //
						var bars = d3.select(this).selectAll('.bars').data(function(d, i){return d.values;}, function(d, i){return d.values[0].id;});

					    // APPENDS //
					    var gBars = bars.enter().append("g")
							.attr('class', 'bars')
							.attr("transform", function(d, i) { return "translate(" + ((getBarIndex(i) * (barWidth + _barGap))) + ", 0)"; });

						// SELECTS //
						bars.transition()
						.ease(att.transitionType)
							.duration(att.transitionSpeed)
							.style("opacity", 1)
				        	.attr("transform", function(d, i) { return "translate(" + ((getBarIndex(i) * (barWidth + _barGap))) + ", 0)"; });

				        bars.exit()
							.transition()
							.ease(att.transitionType)
							.duration(att.transitionSpeed)
				    		.style("opacity", 0)
				    		.remove();

						bars.each(function(barData, barIndex) {
								// TRUNKS //
								var trunks = d3.select(this).selectAll('.trunks').data(function(d, i){return d.values;}, function(d, i){return d.id})

						    	trunks.transition()
						    	.ease(att.transitionType)
							    	.duration(att.transitionSpeed)
							    	/*.attr('font-size', function(){return ((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2); })*/
							    	.style("opacity", 1);

							    trunks.exit()
									.transition()
									.ease(att.transitionType)
									.duration(att.transitionSpeed)
						    		.style("opacity", 0)
						    		.remove();

								var g_Trunks = trunks.enter().insert("g", "g")
									.attr('class', 'trunks')
									/*.attr('font-size', function(){return ((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2); })*/;

										// BODY //
										g_Trunks.append("path")
											.attr("class", function(d, i){return "body " + att.colors[(barIndex % att.colors.length)];})
											.attr("d", function(d, i) {
										      	return roundedRect(0, y(0), barWidth, 0, 0, 0, 0, 0); // x y width height att.cornerRadius .. .. ..
										    });

										trunks.select('.body')
											.attr("class", function(d, i){return "body " + att.colors[(barIndex % att.colors.length)];})
											.transition()
											.ease(att.transitionType)
											.delay(function(d, i) {return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
											.duration(att.transitionSpeed)
											.attr("d", function(d, i) {
												var base = +d.value;
												var cR = barWidth * att.cornerRadius;
												var barHeight = Math.abs(y(0) - y(base));
												if(barHeight < cR) cR = barHeight;
										      	return (base < 0) ? roundedRect(0, y(0), barWidth, barHeight, 0, 0, cR, cR) : roundedRect(0, y(base), barWidth, barHeight, cR, cR, 0, 0);
										    });

										// SHADOW //
										if(att.shadow){
											g_Trunks.append("path")
												.attr("class", function(d, i){return "shadow " + att.colors[(barIndex % att.colors.length)];})
												.attr("opacity", 0.6)
												.attr("d", function(d, i) {
											      	return roundedRect(barWidth, _height, barWidth * 0.08, 0, 0, 0, 0, 0);
											    });

											trunks.select('.shadow')
												.attr("class", function(d, i){return "shadow " + att.colors[(barIndex % att.colors.length)];})
												.transition()
												.ease(att.transitionType)
												.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
												.duration(att.transitionSpeed)
												.attr("d", function(d, i) {
													var base = +d.value;
													var cR = (( _height - y(base)) < (barWidth * att.cornerRadius)) ? ( _height - y(base)) : barWidth * att.cornerRadius;
													var offsetY = (cR > ((_height - y(base)) * 0.04)) ? cR : ((_height - y(base)) * 0.04);
											      	return roundedRect(barWidth, y(base) + offsetY, barWidth * 0.08, _height - y(base) - offsetY, 0, cR, 0, 0);
											    });
										}

										if(att.foreignObjects) {
										    // BAR LABEL //
											g_Trunks.append("svg:foreignObject")
												.attr("opacity", 0)
											    .attr("width", barWidth)
											    .attr("class", "barLabel")
											    .append("xhtml:div")
									            .html(function(d) {return d.label;})
									            .each(function(){
										        	d3.select(this.parentNode).attr("height", this.clientHeight)
										        	d3.select(this.parentNode).attr("transform", "translate(0, " + (_height + att.margin.bottom - this.clientHeight - axisSpace - sectionSpace - groupSpace) + ")")
										        });
									    } else {
									    	g_Trunks.append("g")
									    		.append("text")
												.attr("class", "barLabel")
												.attr("opacity", 0)
												.attr('y', "0.75em")
												.attr('x', 0)
												.text(function(d) {return d.label;})
												.call(wrap, barWidth)
												.attr("transform", function(){ return "translate(" + (barWidth * 0.5) + ", " + (_height + att.margin.bottom - axisSpace - sectionSpace - groupSpace - this.getBBox().height) + ")"; });

												trunks.select('.barLabel')
													.transition()
													.ease(att.transitionType)
													.duration(att.transitionSpeed)
													.attr('opacity', function(){if(att.displayBar){return 1;} return 0;})
													/*.attr("transform", function(){ return "translate(" + (barWidth * 0.5) + ", " + (_height + att.margin.bottom - axisSpace - sectionSpace - groupSpace - this.getBBox().height) + ")"; });*/
													.attr("transform", function(){ return "translate(" + (barWidth * 0.5) + ", " + (_height - this.getBBox().height) + ")"; }); // PROJECT
									    }

									    // NUMBER LABEL // REGULAR POSITION
									    g_Trunks.append("text")
										    .attr("y", function(d, i){ return ((+d.value > 0) ? "1em": "-0.25em"); })
										    .attr("x", 0)
										    .attr("transform", function(d, i){ return "translate(" + (barWidth * 0.5) + ", " + y(0) + ")"; })
										    .attr("class", "numberLabel reverseColor")
										    .attr("opacity", 0)
										    .style('font-size', function(){return (((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2)) + 'px'; })
										    .text(0);

										trunks.select('.numberLabel')
											.transition()
											.ease(att.transitionType)
											.delay(function(d, i) { return ((((sectionData.values.length > 1) ? groupIndex : barIndex) * 5) * att.stagger) + att.delaySpeed; })
											.duration(att.transitionSpeed)
											.attr("y", function(d, i){ return ((+d.value > 0) ? "1em": "-0.25em"); })
											.style('font-size', function(){return (((barWidth * 0.2 > 30)) ? 30 : (barWidth * 0.2)) + 'px'; })
											.attr("transform", function(d, i){ return "translate(" + (barWidth * 0.5) + ", " + y(+d.value) + ")"; })
										    .attr('opacity', function(d){
										    	var base = +d.value;
												if(att.displayTrunk && this.getBBox().height < Math.abs(y(0) - y(base))){return 1;} return 0;})
										    .tween("text", function(d, i) {
									            var i = d3.interpolate(this.textContent, +d.value);
									            return function(t) {
									                this.textContent = parseFloat(i(t)).toFixed(0);
									            };
									        });
						});
				});
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

		if(att.dataLevels === 0){
			var createArray = [];
			for(var i = 0, len = value.length; i < len; i++){
				createArray.push(
					{
			            "values": [
			            	value[i]
			            ]
			        }
				);
			}

			data = [
		        {
		            "key": "Level 1",
		            "values": [
		                {
		                    "key": "Level 2",
		                    "values": createArray
		                }
		            ]
		        }
		    ];
		} else if(att.dataLevels === 1){
			data = [
		        {
		            "key": "Level 1",
		            "values": [
		                {
		                    "key": "Level 2",
		                    "values": value
		                }
		            ]
		        }
		    ];
		} else if(att.dataLevels === 2){
			data = [
		        {
		            "key": "Level 1",
		            "values": value
		        }
		    ];
		} else {
			data = value;
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

	function getSectionIndex(i){
		return ((att.sectionOrder) ? att.sectionOrder[i] : i);
	}

	function getGroupIndex(i){
		return ((att.groupOrder) ? att.groupOrder[i] : i);
	}

	function getBarIndex(i){
		return ((att.barOrder) ? att.barOrder[i] : i);
	}

	return my;
}