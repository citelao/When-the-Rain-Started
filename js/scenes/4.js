// Universe

// But sometimes
// It feels like
// I only control a few raindrops
// And the whole universe is crying
function Scene_4(w, h, next_scene) {
	this.next_scene_fn = next_scene;

	this.scale_factor = 4;
	this.w = w * this.scale_factor;
	this.h = h * this.scale_factor;

	// BG
	this.backgroundColor = 0x061639;

	// RAINDROP
	this.raindrop = make_raindrop(this.scale_factor);

	this.elapsed = 0;
}

Scene_4.prototype.init = function(stage) {
	var that = this;

	this.container = new PIXI.Container();

	this.texter = new Texter({
		parent: this.container,
		width: this.w,
		height: this.h,
		fontSize: 0.2,
		center: true,
		text: [
			{ content: "but", delay: 1000, x: 0.5, y: 0.5, fontSize: 0.1 },
			{ content: "sometimes,", delay: 2000, x: 0.5, y: 0.6, fontSize: 0.1 },
			{ content: "it", delay: 4000, x: 0.3, y: 0.35, duration: 300 },
			{ content: "feels", delay: 400, x: 0.5, y: 0.35, duration: 300 },
			{ content: "like", delay: 1500, x: 0.7, y: 0.35, duration: 300 },
			{ content: "i", delay: 400, x: 0.3, y: 0.55, duration: 300 },
			{ content: "only", delay: 400, x: 0.7, y: 0.55, duration: 300 },
			{ content: "control", delay: 400, x: 0.3, y: 0.8, duration: 300 },
			{ content: "a", delay: 400, x: 0.5, y: 0.8, duration: 300 },
			{ content: "few", delay: 400, x: 0.6, y: 0.8, duration: 300 },
			{ content: "rain", delay: 400, x: 0.7, y: 0.75, duration: 300, fontSize: 0.1 },
			{ content: "drops", delay: 400, x: 0.7, y: 0.82, duration: 300, fontSize: 0.1 },
			{ content: "(dummy advance)", delay: 2000, x: 50, y: 600, duration: 1 },
			// { content: "(dummy advance DEBUG)", delay: 40000, x: 0.3, y: 0.9, duration: 1 }
		],
		on_complete: function() {
			that.next_scene_fn();
		}
	});

	var MIN_EMIT = 2000;
	this.rainer = new Emitter({
		parent: this.container,
		num_particles: 5000,
		x: 0, 
		y: 0,
		width: this.w,
		height: this.h,
		emit_rate: 0.25,
		texture: this.raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio)
	});

	stage.addChild(this.container);
	this.container.pivot.x = this.w / 2;
	this.container.pivot.y = this.h / 2;
	this.center_x = this.container.x = this.w / this.scale_factor / 2;
	this.center_y = this.container.y = this.h / this.scale_factor / 2;

};

Scene_4.prototype.destroy = function() {
	this.rainer.destroy();
	this.texter.destroy();
}

Scene_4.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
	this.texter.update(dt);

	var SCALE_RATE = 0.995;
	if(this.container.scale.x >= 1 / this.scale_factor) {
		this.container.scale.x *= Math.pow(SCALE_RATE, dt / 50);
		this.container.scale.y *= Math.pow(SCALE_RATE, dt / 50);
	}
}

Scene_4.prototype.move = function(e) {
	var sx = e.data.originalEvent.offsetX / this.w * this.scale_factor;
	var sy = e.data.originalEvent.offsetY / this.h * this.scale_factor;
	
	var MOVE = 40;
	var dx = (sx - 0.5) * MOVE;
	var dy = (sy - 0.5) * MOVE;
	this.container.x = this.center_x - dx;
	this.container.y = this.center_y - dy;
}