function Emitter(num_particles, x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.particles = [];

	this.particle_xs = [];
	this.particle_ys = [];

	this.particle_lifes = [];
	this.particle_lifetimes = [];

	for (var i = 0; i < num_particles; i++) {
		this.reset_particle(i);	
	}
}

Emitter.prototype.reset_particle = function(i) {
	this.particle_xs[i] = Math.random() * this.width + this.x;
	this.particle_ys[i] = Math.random() * this.height + this.y;
	this.particle_lifes[i] = 0; 
	this.particle_lifetimes[i] = Math.random() * 10 + 1000;
}

Emitter.prototype.update = function(delta) {
	for (var i = 0; i < this.particle_xs.length; i++) {
		this.particle_lifes[i] += delta;

		if(this.particle_lifes[i] > this.particle_lifetimes[i]) {
			this.reset_particle(i);
		}

		this.particles[i].animate(10).attr({
			x: this.particle_xs[i],
			y: this.particle_ys[i]
		});
	}

}

Emitter.prototype.draw = function(draw, draw_func) {
	for (var i = 0; i < this.particle_xs.length; i++) {
		this.particles[i] = draw_func(draw).attr({
			x: this.particle_xs[i],
			y: this.particle_ys[i]
		});
	}
}