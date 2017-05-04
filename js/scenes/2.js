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
	this.raindrop = make_raindrop(4);

	this.buildings = [];
	this.COL_HEIGHT = Math.floor((this.h + 230 + 50) / 230);
	var num_buildings = 2 * this.COL_HEIGHT;
	for (var i = 0; i < num_buildings; i++) {
		this.buildings.push(make_building());
	}
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

	for (var i = 0; i < this.buildings.length; i++) {
		this.buildings[i].y = (i % this.COL_HEIGHT) * 230 - 50;
		this.buildings[i].x = 20 + Math.floor(i / this.COL_HEIGHT) * 230;
		stage.addChild(this.buildings[i]);
	}
	
	this.texter = new Texter({
		parent: stage,
		width: this.w,
		height: this.h,
		fontSize: 0.25,
		text: [
			{ content: "I like that", delay: 3000, x: 470, y: 0.1 },
			{ content: "because it feels", delay: 1500, x: 470, y: 0.3 },
			{ content: "like the world", delay: 1500, x: 470, y: 0.5 },
			{ content: "cries with me", delay: 1500, x: 470, y: 0.7 },
			{ content: "(dummy advance)", delay: 4000, x: 470, y: 0.9, duration: 1 }
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

	for (var i = 0; i < this.buildings.length; i++) {
		this.buildings[i].destroy();
	}
}

Scene_2.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
	this.texter.update(dt);
}

Scene_2.prototype.click = function(e) {
}