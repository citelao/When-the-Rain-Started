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
// Load fonts
////
WebFont.load({
	google: {
	  families: ['Amatic SC']
	},
	active: begin
});

////
// Start PIXI
////
function begin() {
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
	// renderer.view.style["margin-left"] = "-20px";
	// renderer.view.style["margin-top"] = "-20px";
	// renderer.view.style["margin-bottom"] = "-20px";
	// renderer.view.style["margin-right"] = "-20px";
	// renderer.autoResize = true;
	renderer.resize(window.innerWidth, window.innerHeight);
	renderer.backgroundColor = 0xFFFFFF;

	var stage = new PIXI.Container();

	var SCENES = [
		// new Scene_1(stage, renderer.view.width, renderer.view.height),
		// TODO 2
		new Scene_3(stage, renderer.view.width, renderer.view.height)
	]
	var current_scene = SCENES[0];

	renderer.plugins.interaction.on('mouseup', function(e){
	    current_scene.click(e);
	});

	renderer.plugins.interaction.on('mousemove', function(e) { 
		if(current_scene.move) {
			current_scene.move(e);
		}
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

		current_scene.update(dt, stage);

		renderer.render(stage);

		renderer.backgroundColor = current_scene.backgroundColor;

		frame = (frame + 1) % FRAMES;
		// renderer.view.style.filter = "url(#" + JITTER_FILTERS[frame].node.id + ")";

		last = time;
		window.requestAnimationFrame(animate);
	}
	window.requestAnimationFrame(animate);
}