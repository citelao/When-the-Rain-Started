////
// Generate SVG jitter filters
////
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
var draw = SVG('filters');
var nest = draw.nested();

var FRAMES = 8;
var JITTER_FILTERS = generate_filters(nest, FRAMES);


////
// Start PIXI
////
var type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas";
}

PIXI.utils.sayHello(type);

var app = new PIXI.Application();
var renderer = PIXI.autoDetectRenderer(256, 256, {
	resolution: window.devicePixelRatio
});

document.body.appendChild(renderer.view);

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.view.style["margin-left"] = "-20px";
renderer.view.style["margin-top"] = "-20px";
renderer.view.style["margin-bottom"] = "-20px";
renderer.view.style["margin-right"] = "-20px";
// renderer.autoResize = true;
renderer.resize(window.innerWidth + 40, window.innerHeight + 40);

// ANIMATE!
var last = 0; // STATE
var frame = 0; // STATE

var stage = new PIXI.Container();

// RAINDROP
var raindrop = new PIXI.Graphics();
raindrop.lineStyle(4, 0x0033FF, 1);
raindrop.drawCircle(0, 0, 50);

var rainer = new Emitter({
	parent: stage,
	num_particles: 5000,
	x: 0, 
	y: 0,
	width: renderer.view.width,
	height: renderer.view.width,
	texture: raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio)
});

function animate(time) {
	var dt = time - last;

	rainer.update(dt);

	renderer.render(stage);


	// Change the jitter @ 24FPS
	if(dt < 1 / 24.1 * 1000) {
		window.requestAnimationFrame(animate);
		return;
	}
	frame = (frame + 1) % FRAMES;
	renderer.view.style.filter = "url(#" + JITTER_FILTERS[frame].node.id + ")";

	last = time;
	window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);