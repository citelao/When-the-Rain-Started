var draw = SVG("drawing");

var n = draw.nested();

function generate_filters(drawable, frames) {
	var filters = [];
	for(var i = 0; i < frames; i++) {
		drawable.filter(function(add) {
			var dp = add.turbulence(0.01, 6, i, "noStitch", "fractalNoise");
			var turb = dp.displacementMap(turb, 4, "R", "G").in(add.source);
		});
		filters[i] = drawable.filterer;
		drawable.unfilter();
	}
	return filters;
}

var FRAMES = 8;
var jitter_filters = generate_filters(n, FRAMES);

var last = 0;
var frame = 0;
function animate_jitter(time) {
	if(time - last < 1 / 24.1 * 1000) {
		return;
	}

	frame = (frame + 1) % 8;
	n.attr({
		filter: "url(#" + jitter_filters[frame].node.id + ")"
	});

	window.requestAnimationFrame(animate_jitter);
}
window.requestAnimationFrame(animate_jitter);


for(var street = 0; street < 2; street++) {
	var offset = street * 700 + 50;
	for (var j = 1; j >= 0; j--) {
		for (var i = 5; i >= 0; i--) {
			var b = draw_building(n);
			b.attr({
				x: offset + 220 * j,
				y: -50 + 220 * i
			});
		}
	}
}

var car = draw_car(n);
car.attr({
	x: 650,
	y: 900
});

car.animate(3000).move(650, -300).loop();
