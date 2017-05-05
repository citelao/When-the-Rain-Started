// Universe

// But sometimes
// It feels like
// I only control a few raindrops
// And the whole universe is crying
function Scene_5(w, h, next_scene) {
	this.next_scene_fn = next_scene;

	this.w = w;
	this.h = h;

	// BG
	this.backgroundColor = 0x061639;

	// RAINDROP
	this.raindrop = make_raindrop(1);
	this.large_raindrop = make_raindrop(30);

	// STARS
	this.replaced = 0;
	this.elapsed = 0;
	this.star = make_raindrop(1, 0xFFFF11);
	this.star_tex = this.star.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio);
}

Scene_5.prototype.init = function(stage) {
	this.texter = new Texter({
		parent: stage,
		width: this.w,
		height: this.h,
		fontSize: 0.2,
		text: [
			{ content: "and", delay: 1000, x: 0.1, y: 0.1, fontSize: 0.1 },
			{ content: "the", delay: 500, x: 0.1, y: 0.2 },
			{ content: "whole universe", delay: 400, x: 0.22, y: 0.2, fontSize: 0.3 },
			{ content: "is crying.", delay: 2000, x: 0.1, y: 0.42 },
			{ content: "(end)", delay: 20000, x: 0.1, y: 0.8, fontSize: 0.05 }
		]
	});

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

	var that = this;
	this.rainer_2 = new Emitter({
		parent: stage,
		num_particles: 5000,
		init: false,
		x: 0, 
		y: 0,
		width: this.w,
		height: this.h,
		emit_rate: 2000,
		texture: this.large_raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio),
		on_emit: function(is_manual) {
			if(is_manual) {
				return;
			}

			var MAX_EMIT = 0.5;
			if(that.rainer_2.emit_rate > MAX_EMIT) {
				that.rainer_2.emit_rate *= 0.85;
			}
		}
	});
};

Scene_5.prototype.destroy = function() {
	this.rainer.destroy();
	this.rainer_2.destroy();
	this.texter.destroy();
}

Scene_5.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
	this.texter.update(dt);

	this.elapsed += dt;

	var desired_replace = 0;
	if(this.elapsed < 4000) {
		// noop
	} else if(this.elapsed < 6000) {
		desired_replace = 1;
	} else {
		desired_replace = 5 * Math.floor(this.elapsed / 4000);
	}

	var to_replace = Math.min(desired_replace, this.rainer.sprites.length - this.replaced);
	if(to_replace >= 1) {
		for (var i = this.replaced; i < this.replaced + to_replace; i++) {
			this.rainer.sprites[i].texture = this.star_tex;
		}
		this.replaced += to_replace;
	}

	if(this.elapsed > 8000) {
		this.rainer_2.update(dt);
	}
}

Scene_5.prototype.click = function(e) {
}