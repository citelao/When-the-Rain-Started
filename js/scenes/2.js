// City scene

// I like that
// because it feels
// like the world
// is crying with me
function Scene_2(w, h, next_scene) {
	this.next_scene_fn = next_scene;

	this.w = w;
	this.h = h;

	// BG
	this.backgroundColor = 0x061639;

	// RAINDROP
	this.raindrop = new PIXI.Graphics();
	this.raindrop.lineStyle(4, 0x0033FF, 1);
	this.raindrop.drawCircle(15, 15, 30);
}

Scene_2.prototype.init = function(stage) {
	var that = this;

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

	
	this.texter = new Texter({
		parent: stage,
		width: this.w,
		height: this.h,
		text: [
			{ content: "I like that", delay: 3000, x: 50, y: 100 },
			{ content: "because it feels", delay: 1500, x: 50, y: 250 },
			{ content: "like the world", delay: 1500, x: 50, y: 400 },
			{ content: "is crying with me", delay: 1500, x: 50, y: 550 },
			{ content: "(dummy advance)", delay: 4000, x: 50, y: 600, duration: 1 }
		],
		fontSize: 0.25,
		on_complete: function() {
			that.next_scene_fn();
		}
	});
};

Scene_2.prototype.destroy = function() {
	this.rainer.destroy();
	this.texter.destroy();
}

Scene_2.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
	this.texter.update(dt);
}

Scene_2.prototype.click = function(e) {
}