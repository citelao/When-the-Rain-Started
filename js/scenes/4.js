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
	this.raindrop = new PIXI.Graphics();
	this.raindrop.lineStyle(4, 0x0033FF, 1);
	this.raindrop.drawCircle(15, 15, 30);

	this.text_state = {
		index: 0,
		elapsed: 0
	};

// But sometimes
// It feels like
// I only control a few raindrops
// And the whole universe is crying
	this.texts = [
		{ content: "but sometimes", delay: 1000, x: 50, y: 100 },
		{ content: "it feels like", delay: 1500, x: 50, y: 250 },
		{ content: "I only control", delay: 1500, x: 50, y: 400 },
		{ content: "a few raindrops", delay: 1500, x: 50, y: 550 },
		{ content: "(dummy advance)", delay: 4000, x: 50, y: 600 }
	];

	this.elapsed = 0;
}

Scene_4.prototype.init = function(stage) {
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
};

Scene_4.prototype.destroy = function() {
	this.rainer.destroy();
	this.messages.forEach(function(msg) {
		msg.destroy();
	})
}

Scene_4.prototype.update = function(dt, stage) {
	this.rainer.update(dt);

	// Draw the words onscreen
	if(this.text_state.index < this.texts.length) {
		this.text_state.elapsed += dt;
		if(this.text_state.elapsed > this.texts[this.text_state.index].delay) {
			var text = this.texts[this.text_state.index];

			this.text_state.index += 1;
			this.text_state.elapsed = 0;

			// show text
			var duration = text.duration || 1200;

			var message = new PIXI.Text(
				text.content,
			  	{fontFamily: 'Amatic SC', fontSize: 200, fill: "#526287", padding: 40}
			);

			message.position.set(text.x, text.y);
			stage.addChildAt(message, 0);
			this.messages.push(message);

			if(this.text_state.index === this.texts.length) {
				this.next_scene_fn();
			}
		}
	}
}

Scene_4.prototype.click = function(e) {
}