function Scene_1(w, h, next_scene) {
	this.next_scene_fn = next_scene;

	this.is_running = false;
	this.hint_timer = 0;
	this.w = w;
	this.h = h;

	// BG
	this.backgroundColor = 0xFFFFFF;

	// RAINDROP
	this.raindrop = new PIXI.Graphics();
	this.raindrop.lineStyle(4, 0x0033FF, 1);
	this.raindrop.drawCircle(25, 25, 50);

	this.text_state = {
		index: 0,
		elapsed: 0
	};
	this.texts = [
		{ content: "sometimes", delay: 11000, x: 50, y: 100 },
		{ content: "it rains", delay: 1500, x: 50, y: 350 },
		{ content: "when I'm sad", delay: 1500, x: 50, y: 600 },
		{ content: "(dummy advance)", delay: 8000, x: 50, y: 600 }
	];

	this.elapsed = 0;
}

Scene_1.prototype.init = function(stage) {
	var that = this;

	var MIN_EMIT = 2000;
	this.rainer = new Emitter({
		parent: stage,
		num_particles: 5000,
		x: 0, 
		y: 0,
		width: this.w,
		height: this.h,
		emit_rate: 1700,
		texture: this.raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio),
		on_emit: function(is_manual) {
			if(is_manual) {
				return;
			}

			var MAX_EMIT = 0.5;
			if(that.rainer.emit_rate > MAX_EMIT) {
				that.rainer.emit_rate *= 0.85;
			}
		}
	});

	this.messages = [];
};

Scene_1.prototype.destroy = function() {
	this.rainer.destroy();
	if(this.hint_message) {
		this.hint_message.destroy();
	}
	this.messages.forEach(function(msg) {
		msg.destroy();
	})
}

Scene_1.prototype.update = function(dt, stage) {
	if(!this.is_running) {
		if(this.hint_timer > 7000 && !this.hint_message) {
			this.hint_message = new PIXI.Text(
				"(click)",
			  	{fontFamily: 'Amatic SC', fontSize: 60, fill: "#526287", padding: 40}
			);

			this.hint_message.anchor.set(0.5, 0.5);
			this.hint_message.position.set(this.w / 2 - this.hint_message.width / 2, this.h / 2 - this.hint_message.height / 2);
			stage.addChild(this.hint_message);
		} 

		this.hint_timer += dt;
		return;
	}

	if(this.hint_message) {
		this.hint_message.destroy();
		this.hint_message = null;
	}

	this.rainer.update(dt);

	// BG color
	var DELAY = 10000;
	var DURATION = 6000;
	if(this.elapsed < DURATION + DELAY + 100) {
		this.elapsed += dt;
		var ease = Math.max(0, Math.min((this.elapsed - DELAY) / DURATION, 1));
		var red = ((1 - ease) * 0xFF0000 + ease * 0x060000) & 0xFF0000;
		var green = ((1 - ease) * 0xFF00 + ease * 0x1600) & 0xFF00;
		var blue = ((1 - ease) * 0xFF + ease * 0x39) & 0xFF;
		this.backgroundColor = red + green + blue;
	}

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
			  	{fontFamily: 'Amatic SC', fontSize: 300, fill: "#526287", padding: 40}
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

Scene_1.prototype.click = function(e) {
	this.is_running = true;
	this.rainer.emitAtLocation(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
}