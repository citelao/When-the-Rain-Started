function Emitter(o) {
	this.x = o.x;
	this.y = o.y;
	this.width = o.width;
	this.height = o.height;
	this.num_particles = o.num_particles;
	this.texture = o.texture;
	this.emit_rate = 500;

	this.particles = [];
	this.sprites = [];
	this._last_emit = 0;

	this.container = new PIXI.Container();
	o.parent.addChild(this.container);
}

Emitter.prototype._emit = function(i) {
	this.particles[i] = this.reset_particle();
	this.sprites[i] = new PIXI.Sprite(this.texture);
	this.sprites[i].anchor.set(0.5, 0.5);
	this.container.addChild(this.sprites[i]);
}

Emitter.prototype.reset_particle = function() {
	return {
		x: Math.random() * this.width + this.x,
		y: Math.random() * this.height + this.y,
		age: 0,
		lifetime: Math.random() * 400 + 500,
		dead: false
	};
}

Emitter.prototype.update = function(delta) {
	if(this.particles.length < this.num_particles) {
		if(this._last_emit > this.emit_rate) {
			this._emit(this.particles.length);
			this._last_emit = 0;
		} else {
			this._last_emit += delta;
		}
	}

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
			if(this._last_emit > this.emit_rate) {
				this.particles[i] = this.reset_particle();
				this._last_emit = 0;
			} else {
				this._last_emit += delta;
			}
			continue;
		}

		sprite.x = particle.x;
		sprite.y = particle.y;

		sprite.scale.x = ease * 1;
		sprite.scale.y = ease * 1;
		sprite.alpha = 1 - ease;
	}

}