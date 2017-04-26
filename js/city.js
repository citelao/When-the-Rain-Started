var draw = SVG("drawing");

var n = draw.nested();

function generate_filters(drawable, frames) {
	var filters = [];
	for(var i = 0; i < frames; i++) {
		drawable.filter(function(add) {
			var dp = add.turbulence(0.01, 6, i, "noStitch", "fractalNoise");
			var turb = dp.displacementMap(turb, 6, "R", "G").in(add.source);
		});
		filters[i] = drawable.filterer;
		drawable.unfilter();
	}
	return filters;
}

var FRAMES = 8;
var jitter_filters = generate_filters(n, FRAMES);

for(var street = 0; street < 2; street++) {
	var offset = street * 700 + 50;
	for (var j = 1; j >= 0; j--) {
		for (var i = 5; i >= 0; i--) {
			var nest = n.nested();

			var a = nest.polygon("0,200 100,300 300,300 300,100 200,0")
				.fill("#111");
			nest.attr({
				x: offset + 220 * j,
				y: -50 + 220 * i
			});
		}
	}
}

for(var street = 0; street < 2; street++) {
	var offset = street * 700 + 50;
	for (var j = 1; j >= 0; j--) {
		for (var i = 5; i >= 0; i--) {
			var nest = n.nested();


			var b = draw_building(nest);
			nest.attr({
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

// var em = new Emitter(400, 0, 0, 1200, 1200);
// em.draw(n, function(d) {
// 	return d.rect(10,10);
// });

// ANIMATE!
var last = 0;
var frame = 0;
function animate_jitter(time) {
	if(time - last < 1 / 24.1 * 1000) {
		window.requestAnimationFrame(animate_jitter);
		return;
	}

	frame = (frame + 1) % FRAMES;
	n.attr({
		filter: "url(#" + jitter_filters[frame].node.id + ")"
	});

	// em.update(time - last);

	last = time;
	window.requestAnimationFrame(animate_jitter);
}
window.requestAnimationFrame(animate_jitter);