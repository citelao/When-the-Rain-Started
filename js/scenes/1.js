function Scene_1(draw) {
	this.rect = null;

	this.is_running = false;

	this._spawns = [];

	this.spawn_rate = 2000;
	this.time_since_last_spawn = 0;

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

Scene_1.prototype.update = function(dt, draw) {
	if(!this.is_running) {
		return;
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

			var item = draw.plain(text.content).attr({
				x: text.x, 
				y: text.y, 
				'font-size': '18rem',
				'font-family': '"Amatic SC", Helvetica, Arial, sans-serif',
				opacity: 0
			}).addClass('no-touch').animate(duration).attr({
				opacity: 1
			});

			if(this.text_state.index === this.texts.length) {
				item.after(function() {
					// TODO switch scenes!
					draw_car(draw).x(500).y(-300).animate({
						delay: 500,
						duration: 3000
					}).y(300);
				})
			}
		}
	}

	// Spawn new drop
	this.time_since_last_spawn += dt;
	if(this.time_since_last_spawn > this.spawn_rate) {
		this.time_since_last_spawn = 0;

		if(this.spawn_rate > 0.25) {
			this.spawn_rate *= 0.8;
		}

		for (var i = 0; i < 1 / this.spawn_rate; i++) {
			this._spawn_drop(
				Math.random() * window.innerWidth,
				Math.random() * window.innerHeight, 
				true
			);
		}
	}

	// Update drops
	for (var i = 0; i < this._spawns.length; i++) {
		var spawn = this._spawns[i];

		if(!spawn.spawned) {
			spawn.el = draw.circle(10).attr({
				fill: 'none',
				stroke: '#BCBCFF',
				'stroke-width': '3',
				cx: spawn.x,
				cy: spawn.y
			});
			spawn.spawned = true;
		}

		if(spawn.dead) { return; }

		spawn.lifetime += dt;

		var DURATION = 500;
		if(spawn.lifetime > DURATION) {
			spawn.el.remove();
		}

		spawn.el.attr({
			r: spawn.lifetime * 40 / DURATION  + 10,
			opacity: 1 - spawn.lifetime / DURATION
		});
	}

}

Scene_1.prototype.click = function(e) {
	this.is_running = true;

	this._spawn_drop(e.offsetX, e.offsetY, true);
}

Scene_1.prototype._spawn_drop = function(x, y) {
	var sp = {
		x: x,
		y: y,
		spawned: false,
		dead: false,
		el: null,
		lifetime: 0
	};

	for (var i = 0; i < this._spawns.length; i++) {
		if(this._spawns[i].dead) {
			this._spawns[i] = sp;
			return this._spawns[i];
		}
	}

	this._spawns.push(sp);
}