function Scene_1(stage) {
	var that = this;

	this.is_running = false;

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
		width: renderer.view.width,
		height: renderer.view.width,
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
		{ content: "sometimes", delay: 6000, x: 50, y: 300 },
		{ content: "it rains", delay: 3000, x: 50, y: 550 },
		{ content: "when I'm sad", delay: 2000, x: 50, y: 800 }
	];
}


Scene_1.prototype.update = function(dt) {
	if(!this.is_running) {
		return;
	}

	this.rainer.update(dt);

	// Draw the words onscreen
	// if(this.text_state.index < this.texts.length) {
	// 	this.text_state.elapsed += dt;
	// 	if(this.text_state.elapsed > this.texts[this.text_state.index].delay) {
	// 		var text = this.texts[this.text_state.index];

	// 		this.text_state.index += 1;
	// 		this.text_state.elapsed = 0;

	// 		// show text
	// 		var duration = text.duration || 1200;

	// 		var item = draw.plain(text.content).attr({
	// 			x: text.x, 
	// 			y: text.y, 
	// 			'font-size': '18rem',
	// 			'font-family': '"Amatic SC", Helvetica, Arial, sans-serif',
	// 			opacity: 0
	// 		}).addClass('no-touch').animate(duration).attr({
	// 			opacity: 1
	// 		});

	// 		if(this.text_state.index === this.texts.length) {
	// 			item.after(function() {
	// 				// TODO switch scenes!
	// 				draw_car(draw).x(500).y(-300).animate({
	// 					delay: 500,
	// 					duration: 3000
	// 				}).y(300);
	// 			})
	// 		}
	// 	}
	// }
}

Scene_1.prototype.click = function(e) {
	this.is_running = true;

	this.rainer.emitAtLocation(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
}