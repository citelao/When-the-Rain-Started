function Scene_1(stage, w, h) {
	var that = this;

	this.is_running = false;

	// BG
	this.backgroundColor = 0xFFFFFF;

	// RAINDROP
	this.raindrop = new PIXI.Graphics();
	this.raindrop.lineStyle(4, 0x0033FF, 1);
	this.raindrop.drawCircle(25, 25, 50);

	var MIN_EMIT = 2000;
	this.rainer = new Emitter({
		parent: stage,
		num_particles: 5000,
		x: 0, 
		y: 0,
		width: w,
		height: h,
		emit_rate: 2000,
		texture: this.raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio),
		on_emit: function() {
			var MAX_EMIT = 0.5;
			if(that.rainer.emit_rate > MAX_EMIT) {
				that.rainer.emit_rate *= 0.85;
			}
		}
	});

	this.text_state = {
		index: 0,
		elapsed: 0
	};
	this.texts = [
		{ content: "sometimes", delay: 6000, x: 50, y: 100 },
		{ content: "it rains", delay: 4000, x: 50, y: 350 },
		{ content: "when I'm sad", delay: 3000, x: 50, y: 600 }
	];

	this.elapsed = 0;
}

Scene_1.prototype.update = function(dt, stage) {
	if(!this.is_running) {
		return;
	}

	this.rainer.update(dt);

	// BG color
	var DELAY = 7000;
	var DURATION = 3000;
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
			  	{fontFamily: 'Amatic SC', fontSize: 300, fill: "#fff", padding: 20}
			);

			message.position.set(text.x, text.y);
			message.zOrder = -5;
			stage.addChild(message);

			if(this.text_state.index === this.texts.length) {
				// item.after(function() {
				// 	// TODO switch scenes!
				// 	draw_car(draw).x(500).y(-300).animate({
				// 		delay: 500,
				// 		duration: 3000
				// 	}).y(300);
				// })
			}
		}
	}
}

Scene_1.prototype.click = function(e) {
	this.is_running = true;

	this.rainer.emitAtLocation(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
}