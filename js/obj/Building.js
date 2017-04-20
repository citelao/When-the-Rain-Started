function draw_radiator(draw) {
	var n = draw.nested();

	n.rect(80, 60).attr({
		fill: "none",
		stroke: "#000",
		"stroke-width": "5" 
	});

	n.circle(40).attr({
		fill: "none",
		stroke: "#000",
		"stroke-width": "5",
		cx: 50,
		cy: 30
	});
	n.rect(20, 40).attr({
		x: 5,
		y: 10
	})

	return n;
}

function draw_building(draw) {
	var n = draw.nested();

	// outline
	n.rect(200,200).attr({
		fill: "#382412",
		// stroke: "#000",
		// "stroke-width": "5" 
	});
	n.rect(180,180).attr({
		fill: "#69411D",
		// stroke: "#000",
		// "stroke-width": "5",
		x: 10,
		y: 10
	});

	// radiator
	var r = draw_radiator(n);
	r.attr({
		x: 20,
		y: 20
	});


	return n;
}
