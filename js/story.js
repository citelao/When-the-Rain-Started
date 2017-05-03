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

	// renderer.autoResize = true;
	renderer.resize(window.innerWidth, window.innerHeight);
	renderer.backgroundColor = 0xFFFFFF;

	var h = renderer.view.height / window.devicePixelRatio;
	var w = renderer.view.width / window.devicePixelRatio;

	var stage = new PIXI.Container();

	// STATE & FILTER
	var shaderCode = document.getElementById("shader").innerHTML;
	var state = {
		current_scene_index: -1,
		current_scene: null,
		jitter_shader: new PIXI.Filter('', shaderCode, { 
			time: {
				type: "f",
				value: 0.0
			},
			dimensions: {
				type: "vec2",
				value: [w, h]
			}
		})
	};
	function next_scene() {
		var last_index = state.current_scene_index;
		state.current_scene_index += 1;
		state.current_scene = SCENES[state.current_scene_index];

		state.current_scene.init(stage);
		if(last_index >= 0) {
			SCENES[last_index].destroy();
		}
	}
	var SCENES = [
		new Scene_1(w, h, next_scene),
		new Scene_2(w, h, next_scene),
		new Scene_3(w, h, next_scene),
		new Scene_4(w, h, next_scene),
		new Scene_5(w, h, next_scene)
	]
	next_scene();

	stage.filters = [state.jitter_shader];

	renderer.plugins.interaction.on('mouseup', function(e){
		state.is_scene_pending = false;
	    state.current_scene.click(e);
	});

	renderer.plugins.interaction.on('mousemove', function(e) { 
		if(state.current_scene.move) {
			state.current_scene.move(e);
		}
	});

	// ANIMATE!
	var last = 0; // STATE
	function animate(time) {
		var dt = time - last;

		// Change the jitter @ 24FPS
		if(dt < 1 / 24.1 * 1000) {
			window.requestAnimationFrame(animate);
			return;
		}

		state.current_scene.update(dt, stage);
		var num_frames = dt / (1/24.1 * 1000);
		state.jitter_shader.uniforms.time += num_frames;

		renderer.render(stage);

		renderer.backgroundColor = state.current_scene.backgroundColor;

		last = time;
		window.requestAnimationFrame(animate);
	}
	window.requestAnimationFrame(animate);

}