// Universe

// But sometimes
// It feels like
// I only control a few raindrops
// And the whole universe is crying
function Scene_5(w, h, next_scene) {
	this.next_scene_fn = next_scene;

	this.hint_timer = 0;
	this.w = w;
	this.h = h;

	// BG
	this.backgroundColor = 0x061639;

	// RAINDROP
	this.raindrop = make_raindrop(1);

	this.text_state = {
		index: 0,
		elapsed: 0
	};

	this.elapsed = 0;
}

Scene_5.prototype.init = function(stage) {
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

	this.messages = [];

	var message = new PIXI.Text(
		"and\nthe whole universe\nis crying",
	  	{fontFamily: 'Amatic SC', fontSize: 200, fill: "#526287", padding: 40}
	);

	message.position.set(100, 100);
	stage.addChildAt(message, 0);
	this.messages.push(message);
};

Scene_5.prototype.destroy = function() {
	this.rainer.destroy();
	this.messages.forEach(function(msg) {
		msg.destroy();
	})
}

Scene_5.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
}

Scene_5.prototype.click = function(e) {
}