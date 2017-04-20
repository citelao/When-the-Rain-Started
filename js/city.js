var draw = SVG("drawing");

var jitter_filter = null;

for(var street = 0; street < 2; street++) {
	var offset = street * 700 + 50;
	for (var j = 1; j >= 0; j--) {
		for (var i = 5; i >= 0; i--) {
			var b = draw_building(draw);
			b.attr({
				x: offset + 220 * j,
				y: -50 + 220 * i
			});

			var dp;

			if(!jitter_filter) {
				b.filter(function(add) {
					dp = add.turbulence(0.02, 3);
					var turb = dp.displacementMap(turb, 4	, "R", "G").in(add.source);
				});
				jitter_filter = b.filterer;
			} else {
				b.filter(jitter_filter);
			}

			dp.animate(1/24*1000*8).attr({"seed": 8}).loop();
		}
	}
}

var car = draw_car(draw);
car.attr({
	x: 650,
	y: 800
}).filter(jitter_filter);

car.animate(3000).move(650, -300).loop();
