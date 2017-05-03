function Emitter(o) {
	this.x = o.x;
	this.y = o.y;
	this.width = o.width;
	this.height = o.height;
	this.num_particles = o.num_particles;
	this.texture = o.texture;
	this.emit_rate = o.emit_rate;
	this._parent = o.parent;

	this._on_emit = o.on_emit || function() {};

	this.particles = [];
	this.sprites = [];
	this._last_emit = 0;

	this.container = new PIXI.Container();
	this._parent.addChild(this.container);
}

Emitter.prototype.destroy = function() {
	this._parent.removeChild(this.container);
	this.container.destroy();
}

Emitter.prototype.emitAtLocation = function(x, y) {
	var locs = this._getSpawnLocs(1);

	if(locs.length === 0) {
		console.error("NO SPAWN");
		return;
	}

	this._emit(locs[0], true);
	this.particles[locs[0]].x = x;
	this.particles[locs[0]].y = y;

	// console.log(locs[0], this.particles[locs[0]])
}

Emitter.prototype._getSpawnLocs = function(to_emit, deads) {
	if(!deads) {
		var deads = [];
		this.particles.forEach(function(p, i) {
			if(p.dead) {
				deads.push(i);
			}
		})
	}

	var locs = deads.slice(0, to_emit);
	if(to_emit > deads.length) {
		var birthed = Math.min(to_emit - deads.length, this.num_particles - this.particles.length);
		for (var i = 0; i < birthed; i++) {
			locs.push(i + this.particles.length);
		}
	}

	return locs;
}

Emitter.prototype._emit = function(i, is_manual) {
	this.particles[i] = this._reset_particle();

	if(!this.sprites[i]) {
		this.sprites[i] = new PIXI.Sprite(this.texture);
		this.sprites[i].anchor.set(0.5, 0.5);
		this.sprites[i].alpha = 0;
		this.container.addChild(this.sprites[i]);
	}

	this._on_emit(is_manual);
}

Emitter.prototype._reset_particle = function() {
	return {
		x: Math.random() * this.width + this.x,
		y: Math.random() * this.height + this.y,
		age: 0,
		lifetime: Math.random() * 400 + 500,
		dead: false
	};
}

Emitter.prototype.update = function(delta) {
	var deads = [];
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		var sprite = this.sprites[i];

		particle.age += delta;
		var ease = particle.age / particle.lifetime;

		if(particle.age > particle.lifetime) {
			particle.dead = true;
		}

		if(particle.dead) {
			sprite.alpha = 0;
			deads.push(i);
			continue;
		}

		sprite.x = particle.x;
		sprite.y = particle.y;

		sprite.scale.x = ease * 1;
		sprite.scale.y = ease * 1;
		sprite.alpha = 1 - ease;
	}

	if(this._last_emit > this.emit_rate) {
		var to_emit = Math.floor(this._last_emit / this.emit_rate);

		var spawn_indeces = this._getSpawnLocs(to_emit, deads);
		

		for (var i = 0; i < spawn_indeces.length; i++) {
			this._emit(spawn_indeces[i], false);
		}
		this._last_emit = 0;
	} else {
		this._last_emit += delta;
	}
}