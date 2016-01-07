function createMap(selector){
	if(selector === null || selector === undefined){
		return null;
	}

	var chart = d3.selectAll(selector);
	var data = []; 	// Required //
					// key:string - values:[] ++ key:string - values:[] ++ values:[] ++ id:string - value:num //
					
					// Optional //
					//  //

	var att = {
		margin : {top: 0, right: 0, bottom: 0, left: 0},
		width : 1024,
		height : 512,
		transitionSpeed : 8000,
		transitionType: 'cubic-in-out',
		delaySpeed : 1000,
		colors :['mapColor'],
		aspectRatio : 0.5,
		scale : 550
	};

	/* Local Scope */
	var _height,
		_width,
		_zoom,
		_path,
		_start;

	chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

	var draw = chart.append("g").attr("class", "draw");

	function my(){
		$(selector).parent().css('padding-bottom', ((att.aspectRatio * 100) + '%'));

		att.height = (att.width * att.aspectRatio);

		_height = att.height - att.margin.top - att.margin.bottom;
		_width = att.width - att.margin.left - att.margin.right;

		chart.attr("viewBox", "0 0 " + att.width + " " + att.height);

		var projection = d3.geo.miller()
			.scale(att.scale)
			.translate([_width * 0.8, _height * 1.4])
			.precision(1);

		_path = d3.geo.path()
		    .projection(projection);

		var globe = draw.selectAll("path")
		  	.data(topojson.feature(data, data.objects.countries).features);

		globe.enter().append("path")
			.attr("class", "feature")
			.attr("d", _path)
	        .attr('class', function(d, i){return att.colors[i % att.colors.length];});
	        /*.on("click", clicked);*/

        var england = {
			"type": "Feature",
			"properties": {},
			"geometry": {
			    "type": "MultiPolygon",
			    "coordinates": [
			        [
			            [
			                [
			                    -6.21763899906253,
			                    54.086942962206905
			                ],
			                [
			                    -6.645994086680616,
			                    54.06016195820254
			                ],
			                [
			                    -6.931564145092665,
			                    54.376177805453864
			                ],
			                [
			                    -7.359919232710752,
			                    54.1190801670121
			                ],
			                [
			                    -7.853176606331573,
			                    54.21549178142777
			                ],
			                [
			                    -8.12576620754308,
			                    54.41367121105995
			                ],
			                [
			                    -7.892117977933225,
			                    54.66541264870085
			                ],
			                [
			                    -7.554626090718983,
			                    54.767180463917356
			                ],
			                [
			                    -7.217134203504742,
			                    55.09390871277043
			                ],
			                [
			                    -6.477248143073496,
			                    55.23852613439391
			                ],
			                [
			                    -6.126775798658684,
			                    55.217101331190435
			                ],
			                [
			                    -5.464772481430742,
			                    54.49937042387387
			                ],
			                [
			                    -5.607557510636781,
			                    54.27440999023733
			                ],
			                [
			                    -6.21763899906253,
			                    54.086942962206905
			                ]
			            ]
			        ],
			        [
			            [
			                [
			                    -6.191678084661419,
			                    58.36119120130107
			                ],
			                [
			                    -6.425326314271302,
			                    58.02375055084627
			                ],
			                [
			                    -6.86666185908993,
			                    57.93269513723146
			                ],
			                [
			                    -7.087329631499244,
			                    58.184436574872365
			                ],
			                [
			                    -6.191678084661419,
			                    58.36119120130107
			                ]
			            ]
			        ],
			        [
			            [
			                [
			                    -3.102329270930994,
			                    58.5165210245263
			                ],
			                [
			                    -3.219153385735922,
			                    58.32369779569498
			                ],
			                [
			                    -3.9850003605682502,
			                    57.959476141235825
			                ],
			                [
			                    -3.8681762457633226,
			                    57.60061068757753
			                ],
			                [
			                    -3.4008797865436122,
			                    57.70773470359495
			                ],
			                [
			                    -2.0768731520876997,
			                    57.70237850279406
			                ],
			                [
			                    -1.7783226364750817,
			                    57.493486671560134
			                ],
			                [
			                    -2.2585995528953617,
			                    56.86145497705749
			                ],
			                [
			                    -2.5960914401096318,
			                    56.56150773220878
			                ],
			                [
			                    -2.6480132689117966,
			                    56.32047869616963
			                ],
			                [
			                    -3.18021201413427,
			                    56.07944966013048
			                ],
			                [
			                    -2.141775438090434,
			                    55.902695033701775
			                ],
			                [
			                    -1.648518064469613,
			                    55.57061058404784
			                ],
			                [
			                    -1.2850652628542605,
			                    54.772536664718245
			                ],
			                [
			                    -0.6749837744285117,
			                    54.50472662467473
			                ],
			                [
			                    -0.09086320040384521,
			                    54.1190801670121
			                ],
			                [
			                    -0.20768731520877282,
			                    54.02266855259646
			                ],
			                [
			                    0.3504723444147828,
			                    53.16032022365641
			                ],
			                [
			                    0.5581596596235556,
			                    52.9674969948251
			                ],
			                [
			                    1.0514170332443769,
			                    52.95678459322335
			                ],
			                [
			                    1.661498521670154,
			                    52.75324896279028
			                ],
			                [
			                    1.752361722073971,
			                    52.46937032034418
			                ],
			                [
			                    1.5576548640657677,
			                    52.08908006348241
			                ],
			                [
			                    1.2720848056536909,
			                    51.8426948266424
			                ],
			                [
			                    0.9605538328405601,
			                    51.81055762183718
			                ],
			                [
			                    0.6879642316290528,
			                    51.38741775856846
			                ],
			                [
			                    1.4148698348597293,
			                    51.36599295536499
			                ],
			                [
			                    1.401889377659188,
			                    51.18388212813542
			                ],
			                [
			                    0.20768731520877282,
			                    50.76074226486668
			                ],
			                [
			                    -0.7918078892334393,
			                    50.76609846566757
			                ],
			                [
			                    -1.2850652628542605,
			                    50.85715387928235
			                ],
			                [
			                    -1.5187134924641157,
			                    50.750029863264956
			                ],
			                [
			                    -2.5441696113074386,
			                    50.6161248432432
			                ],
			                [
			                    -2.998485613326608,
			                    50.71789265845973
			                ],
			                [
			                    -3.4008797865436122,
			                    50.63219344564581
			                ],
			                [
			                    -3.790293502560047,
			                    50.23047838558057
			                ],
			                [
			                    -4.179707218576482,
			                    50.39116440960666
			                ],
			                [
			                    -4.724886420999496,
			                    50.289396594390155
			                ],
			                [
			                    -5.231124251820887,
			                    50.02158655434664
			                ],
			                [
			                    -5.3349679094252735,
			                    50.24654698798318
			                ],
			                [
			                    -4.582101391793486,
			                    50.77681086726929
			                ],
			                [
			                    -4.192687675777023,
			                    51.189238328936284
			                ],
			                [
			                    -3.141270642532646,
			                    51.205306931338896
			                ],
			                [
			                    -4.387394533785255,
			                    51.74092701142587
			                ],
			                [
			                    -4.906612821807187,
			                    51.62844679460761
			                ],
			                [
			                    -5.127280594216501,
			                    51.70343360581978
			                ],
			                [
			                    -5.088339222614849,
			                    51.99802464986763
			                ],
			                [
			                    -4.387394533785255,
			                    52.196204079499836
			                ],
			                [
			                    -3.9850003605682502,
			                    52.54435713155635
			                ],
			                [
			                    -4.1148049325737475,
			                    53.21923843246597
			                ],
			                [
			                    -3.063387899329342,
			                    53.4281302636999
			                ],
			                [
			                    -2.920602870123332,
			                    53.73343370934947
			                ],
			                [
			                    -3.1672315569337286,
			                    54.12979256861385
			                ],
			                [
			                    -3.569625730150733,
			                    54.467233219068646
			                ],
			                [
			                    -3.4268407009446946,
			                    54.96535989354956
			                ],
			                [
			                    -3.959039446167168,
			                    54.77789286551911
			                ],
			                [
			                    -4.5171991057907235,
			                    54.75646806231563
			                ],
			                [
			                    -5.140261051417042,
			                    54.85823587753217
			                ],
			                [
			                    -4.672964592197303,
			                    55.50097997363653
			                ],
			                [
			                    -4.893632364606617,
			                    55.69915940326874
			                ],
			                [
			                    -5.373909281026897,
			                    55.827708222489605
			                ],
			                [
			                    -5.555635681834588,
			                    55.38849975681828
			                ],
			                [
			                    -5.763322997043332,
			                    55.39385595761914
			                ],
			                [
			                    -5.607557510636781,
			                    56.052668656126144
			                ],
			                [
			                    -5.386889738227438,
			                    56.513301925000945
			                ],
			                [
			                    -5.867166654647718,
			                    56.56150773220878
			                ],
			                [
			                    -5.555635681834588,
			                    57.23103283231751
			                ],
			                [
			                    -5.815244825845525,
			                    57.434568462750576
			                ],
			                [
			                    -5.3349679094252735,
			                    58.23799858288106
			                ],
			                [
			                    -5.010456479411545,
			                    58.264779586885396
			                ],
			                [
			                    -4.711905963798955,
			                    58.51116482372541
			                ],
			                [
			                    -3.050407442128801,
			                    58.634357442145415
			                ],
			                [
			                    -3.102329270930994,
			                    58.5165210245263
			                ]
			            ]
			        ]
			    ]
			}
			};

        clicked(england);

	    if(_start){

	        knuts = [-2.3732926000000134, 53.3045687];
			basel = [7.588576099999955, 47.55959860000001];
			phil = [-75.16522150000003, 39.9525839];
			abbo = [-1.2879528999999366, 51.67078];
			bri = [-0.13716299999998682, 50.82253000000001];
			par = [2.3522219000000177, 48.85661400000001];
			zur = [8.541694000000007, 47.3768866];
			lyo = [4.835658999999964, 45.764043];
			frank = [8.682126700000026, 50.1109221];
			amst = [4.895167899999933, 52.3702157];
			manc = [-2.2426305000000184, 53.4807593];
			milt = [-0.707300000000032, 52.0416327];

			var countries = draw.selectAll(".country").data([knuts, milt, abbo, bri, amst, par, basel, zur, lyo, frank, phil]);
			var gCountries = countries.enter().append('g').attr('class', 'country');

			gCountries.append("line")
				.attr("x1", function (d) { return projection(knuts)[0]; })
				.attr("y1", function (d) { return projection(knuts)[1]; })
				.attr("x2", function (d) { return projection(knuts)[0]; })
				.attr("y2", function (d) { return projection(knuts)[1]; })
				.attr("class", "flightLine");

			countries.select('.flightLine')
				.transition()
				.delay(function(d, i){ return (i * 500) + att.delaySpeed; })
				.duration(1000)
				.ease(att.transitionType)
				.attr("x2", function (d) { return projection(d)[0]; })
				.attr("y2", function (d) { return projection(d)[1]; });

			gCountries.append("circle")
				.attr("cx", function (d) { return projection(d)[0]; })
				.attr("cy", function (d) { return projection(d)[1]; })
				.attr("r", function(d, i){ if(i === 0){return '3.5px'} return 0;})
				.attr("class", "flightDest fillC");

			countries.select('.flightDest')
				.transition()
				.delay(function(d, i){ return ((i + 1) * 500) + att.delaySpeed; })
				.duration(1000)
				.ease(att.transitionType)
				.attr('r', "3.5px");

			setTimeout(function(){
				draw.transition()
					.ease(att.transitionType)
					.duration(att.transitionSpeed)
					.attr("transform", "");
			}, att.delaySpeed);
		}

		return my;
	}

	function clicked(d) {
		/*console.log(d);*/
		var bounds = _path.bounds(d),
		  dx = bounds[1][0] - bounds[0][0],
		  dy = bounds[1][1] - bounds[0][1],
		  x = (bounds[0][0] + bounds[1][0]) / 2,
		  y = (bounds[0][1] + bounds[1][1]) / 2,
		  scale = .9 / Math.max(dx / _width, dy / _height),
		  translate = [_width / 2 - scale * x, _height / 2 - scale * y];

		draw
		  //.style("stroke-width", 1.5 / scale + "px")
		  .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
	}

	function getCentroid(selection) {
	    // get the DOM element from a D3 selection
	    // you could also use "this" inside .each()
	    var element = selection.node(),
	        // use the native SVG interface to get the bounding box
	        bbox = element.getBBox();
	    // return the center of the bounding box
	    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
	}

	my.start = function(value){
		if (!arguments.length) return _start;
		_start = value;
		my();
		return my;
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

	my.transitionSpeed = function(value) {
		if (!arguments.length) return att.transitionSpeed;
		att.transitionSpeed = value;
		return my;
	};

	return my;
}