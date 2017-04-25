function Scene_1(draw) {
	this.rect = null;

	this.is_running = false;

	this.manual_spawns = [];

	this.spawn_rate = 3000;
	this.time_since_last_spawn = 0;
	this.auto_spawns = [];
}

Scene_1.prototype.update = function(dt) {
	if(!this.is_running) {
		return;
	}

	// Spawn new drop
	this.time_since_last_spawn += dt;
	if(this.time_since_last_spawn > this.spawn_rate) {
		this.time_since_last_spawn = 0;

		if(this.spawn_rate > 0.25) {
			this.spawn_rate *= 0.8;
		}

		for (var i = 0; i < 1 / this.spawn_rate; i++) {
			this._spawn_drop(Math.random() * window.innerWidth,
				Math.random() * window.innerHeight, 
				true);
		}
	}

	// Update drops
	for (var i = 0; i < this.manual_spawns.length; i++) {
		var spawn = this.manual_spawns[i];
		if(!spawn.spawned) { return; }
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

Scene_1.prototype._spawn_drop = function(x, y, is_manual) {
	var sp = {
		x: x,
		y: y,
		spawned: false,
		dead: false,
		el: null,
		lifetime: 0
	};

	if(is_manual) {
		for (var i = 0; i < this.manual_spawns.length; i++) {
			if(this.manual_spawns[i].dead) {
				this.manual_spawns[i] = sp;
				return this.manual_spawns[i];
			}
		}

		this.manual_spawns.push(sp);
	} else {
		for (var i = 0; i < this.auto_spawns.length; i++) {
			if(this.auto_spawns[i].dead) {
				this.auto_spawns[i] = sp;
				return this.auto_spawns[i];
			}
		}
		this.auto_spawns.push(sp);
	}
}

Scene_1.prototype._draw_drop = function() {
	
}

Scene_1.prototype.draw = function(draw) {
	if(!this.is_running) {
		return;
	}

	for (var i = 0; i < this.manual_spawns.length; i++) {
		var spawn = this.manual_spawns[i];
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
	}

	for (var i = 0; i < this.auto_spawns.length; i++) {
		var spawn = this.auto_spawns[i];
		if(!spawn.spawned) {
			// spawn.el = 	draw_raindrop(draw, spawn.x, spawn.y)
			spawn.spawned = true;
		}
	}
}