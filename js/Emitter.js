function Emitter(o) {
	this.x = o.x;
	this.y = o.y;
	this.width = o.width;
	this.height = o.height;
	this.num_particles = o.num_particles;
	this.texture = o.texture;

	this.particles = [];
	this.sprites = [];

	this.container = new PIXI.Container();
	o.parent.addChild(this.container);

	for (var i = 0; i < this.num_particles; i++) {
		this.particles[i] = this.reset_particle();

		this.sprites[i] = new PIXI.Sprite(this.texture);
		this.sprites[i].anchor.set(0.5, 0.5);
		this.container.addChild(this.sprites[i]);
	}
}

Emitter.prototype.reset_particle = function() {
	return {
		x: Math.random() * this.width + this.x,
		y: Math.random() * this.height + this.y,
		age: 0,
		lifetime: Math.random() * 400 + 500
	};
}

Emitter.prototype.update = function(delta) {
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		var sprite = this.sprites[i];

		particle.age += delta;
		var ease = particle.age / particle.lifetime;

		sprite.x = particle.x;
		sprite.y = particle.y;

		sprite.scale.x = ease * 1;
		sprite.scale.y = ease * 1;
		sprite.alpha = 1 - ease;

		if(particle.age > particle.lifetime) {
			this.particles[i] = this.reset_particle();	
		}
	}

}