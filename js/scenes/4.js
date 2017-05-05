// Universe

// But sometimes
// It feels like
// I only control a few raindrops
// And the whole universe is crying
function Scene_4(w, h, next_scene) {
	this.next_scene_fn = next_scene;

	this.hint_timer = 0;
	this.w = w;
	this.h = h;

	// BG
	this.backgroundColor = 0x061639;

	// RAINDROP
	this.raindrop = make_raindrop(5);

	this.elapsed = 0;
}

Scene_4.prototype.init = function(stage) {
	var that = this;
	
	this.texter = new Texter({
		parent: stage,
		width: this.w,
		height: this.h,
		fontSize: 0.2,
		text: [
			{ content: "but", delay: 1000, x: 0.1, y: 0.1 },
			{ content: "but, sometimes,", delay: 2000, x: 0.1, y: 0.1 },
			{ content: "it", delay: 3000, x: 0.05, y: 0.3, duration: 300 },
			{ content: "feels", delay: 400, x: 0.1, y: 0.4, duration: 300 },
			{ content: "like", delay: 400, x: 0.23, y: 0.3, duration: 300 },
			{ content: "I", delay: 400, x: 0.35, y: 0.4, duration: 300 },
			{ content: "on", delay: 400, x: 0.4, y: 0.3, duration: 300 },
			{ content: "only", delay: 400, x: 0.4, y: 0.3, duration: 300 },
			{ content: "control a few raindrops", delay: 400, x: 50, y: 550 },
			{ content: "(dummy advance)", delay: 4000, x: 50, y: 600, duration: 1 },
			// { content: "(dummy advance DEBUG)", delay: 40000, x: 0.3, y: 0.9, duration: 1 }
		],
		on_complete: function() {
			that.next_scene_fn();
		}
	});

	var MIN_EMIT = 2000;
	this.rainer = new Emitter({
		parent: stage,
		num_particles: 5000,
		x: 0, 
		y: 0,
		width: this.w,
		height: this.h,
		emit_rate: 0.25,
		texture: this.raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio)
	});
};

Scene_4.prototype.destroy = function() {
	this.rainer.destroy();
	this.texter.destroy();
}

Scene_4.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
	this.texter.update(dt);
}

Scene_4.prototype.click = function(e) {
}