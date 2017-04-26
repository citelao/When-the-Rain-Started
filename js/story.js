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
renderer.backgroundColor = 0xFFFFFF;

var stage = new PIXI.Container();

var scene_1 = new Scene_1(stage);

renderer.plugins.interaction.on('mouseup', function(e){
    scene_1.click(e);
});


// ANIMATE!
var last = 0; // STATE
var frame = 0; // STATE
function animate(time) {
	var dt = time - last;

	// Change the jitter @ 24FPS
	if(dt < 1 / 24.1 * 1000) {
		window.requestAnimationFrame(animate);
		return;
	}

	scene_1.update(dt);	

	renderer.render(stage);

	var ease = Math.max(0, Math.min((time - 13000) / 8000, 1));
	var red = ((1 - ease) * 0xFF0000 + ease * 0x060000) & 0xFF0000;
	var green = ((1 - ease) * 0xFF00 + ease * 0x1600) & 0xFF00;
	var blue = ((1 - ease) * 0xFF + ease * 0x39) & 0xFF;
	renderer.backgroundColor = red + green + blue;

	frame = (frame + 1) % FRAMES;
	renderer.view.style.filter = "url(#" + JITTER_FILTERS[frame].node.id + ")";

	last = time;
	window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);