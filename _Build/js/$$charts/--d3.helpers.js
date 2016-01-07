function p(x,y){
	return x+" "+y+" ";
}

function roundedRect(x, y, w, h, r1, r2, r3, r4){
	var strPath = "M"+p(x+r1,y); //A
	strPath+="L"+p(x+w-r2,y)+"Q"+p(x+w,y)+p(x+w,y+r2); //B
	strPath+="L"+p(x+w,y+h-r3)+"Q"+p(x+w,y+h)+p(x+w-r3,y+h); //C
	strPath+="L"+p(x+r4,y+h)+"Q"+p(x,y+h)+p(x,y+h-r4); //D
	strPath+="L"+p(x,y+r1)+"Q"+p(x,y)+p(x+r1,y); //A
	strPath+="Z";

	return strPath;
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0;//parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1){
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function getOrdinal(n) {
  if((parseFloat(n) == parseInt(n)) && !isNaN(n)){
      var s=["th","st","nd","rd"],
      v=n%100;
      return n+(s[(v-20)%10]||s[v]||s[0]);
  }
  return n;     
}

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return String(format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    }));
  };
}