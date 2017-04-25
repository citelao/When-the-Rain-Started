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

var draw = SVG("drawing");
var n = draw.nested();

var FRAMES = 8;
var JITTER_FILTERS = generate_filters(n, FRAMES);

var SCENES = [
	new Scene_1(n)
];

// STATE
var current_scene = false;

function set_scene(index) {
	current_scene = index;
	// draw.click(null);
	draw.click(SCENES[current_scene].click.bind(SCENES[current_scene]));
}
set_scene(0);

// ANIMATE!
var last = 0; // STATE
var frame = 0; // STATE
function animate(time) {
	var dt = time - last;
	// 24 FPS b/c we're a movie
	if(dt < 1 / 24.1 * 1000) {
		window.requestAnimationFrame(animate);
		return;
	}

	// Update the scene
	SCENES[current_scene].update(dt, n);



	// Change the jitter
	frame = (frame + 1) % FRAMES;
	n.attr({
		filter: "url(#" + JITTER_FILTERS[frame].node.id + ")"
	});

	last = time;
	window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);