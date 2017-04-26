function draw_radiator(draw) {
	var n = draw.nested();

	n.rect(80, 60).attr({
		fill: "#4b2e14"
	});

	n.circle(40).attr({
		fill: "#2c1b0c",
		cx: 50,
		cy: 30
	});
	n.rect(20, 40).attr({
		fill: "#2c1b0c",
		x: 5,
		y: 10
	})

	return n;
}

function draw_building(draw) {
	var BUILDING_HEIGHT = 200;
	var BUILDING_WIDTH = 200;
	var FENCE_WIDTH = 10;

	var n = draw.nested();

	// outline
	n.rect(BUILDING_WIDTH, BUILDING_WIDTH).attr({
		fill: "#382412",
		// stroke: "#000",
		// "stroke-width": "5" 
	});
	n.rect(BUILDING_WIDTH - 2 * FENCE_WIDTH, BUILDING_HEIGHT - 2 *FENCE_WIDTH).attr({
		fill: "#69411D",
		// stroke: "#000",
		// "stroke-width": "5",
		x: 10,
		y: 10
	});

	// radiator
	var RAD_PROB = 0.3;
	var CHIMNEY_PROB = 0.5;
	var accoutrement = Math.random();
	if(accoutrement < RAD_PROB) {
		var r = draw_radiator(n);
		r.attr({
			x: 20,
			y: 20 + Math.random() * (BUILDING_HEIGHT - 4 * FENCE_WIDTH - 60)
		});
	} else if(accoutrement < CHIMNEY_PROB + RAD_PROB) {
		var r = n.rect(40, 40);
		var y = 20 + Math.random() * (BUILDING_HEIGHT - 4 * FENCE_WIDTH - 60 - 50);
		r.attr({
			fill: "#2c1b0c",
			x: 20,
			y: y
		});
		var r = n.rect(40, 40);
		r.attr({
			fill: "#2c1b0c",
			x: 20,
			y: y + 50
		});
	}

	if(Math.random() > 0.3) {
		var r = n.rect(40, 80);
		r.attr({
			fill: "#a6672e",
			x: BUILDING_WIDTH - 2 * FENCE_WIDTH - 40,
			y: 40
		})
	}

	return n;
}
