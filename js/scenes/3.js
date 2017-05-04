function Scene_3(w, h, next_scene) {
	this.next_scene_fn = next_scene;
	this.backgroundColor = 0x061639;

	this.w = w;
	this.h = h;


	var colors = [
		0x3B5BA2,
		0x1E5226,
		0x283E6E,
		0x6E284C
	];
	var texes = [];
	for (var i = 0; i < colors.length; i++) {
		var umbrella = make_umbrella(colors[i]);
		texes.push(umbrella.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio))
	}

	this.umbrellas = new PIXI.Sprite();
	// this.umbrellas.x = 500;
	// this.umbrellas.y = 100;
	const UMBRELLAS = 400;
	for (var i = 0; i < UMBRELLAS; i++) {
		var tex = texes[Math.round(Math.random() * texes.length)];
		var clone = new PIXI.Sprite(tex);
		clone.anchor.set(0.5, 0.5);
		clone.x = Math.random() * this.w;
		clone.y = Math.random() * this.h;
		this.umbrellas.addChild(clone);
		clone.rotation = Math.random() * 2 * Math.PI;
	}

	// this.umbrellas.mask = this.umbrella;
	// this.umbrella.mask = this.umbrellas;
	// this.umbrella.anchor.set(0.5, 0.5);

	// this.umbrella.addChild(this.umbrellas);
	this.raindrop = make_raindrop(5);

	this.bob = 0;
}

Scene_3.prototype.init = function(stage, state) {
	this.openX = state.mouse.x;
	this.openY = state.mouse.y;

	var that = this;
	this.texter = new Texter({
		parent: stage,
		width: this.w,
		height: this.h,
		fontSize: 0.3,
		text: [
			{ content: "and I know", delay: 1000, x: 0.1, y: 0.1 },
			{ content: "that only I", delay: 500, x: 0.2, y: 0.4 },
			{ content: "control my mood", delay: 500, x: 0.4, y: 0.7, fontSize: 0.2 },
			{ content: "(dummy advance)", delay: 10000, x: 0.3, y: 0.9, duration: 1 },
			// { content: "(dummy advance DEBUG)", delay: 40000, x: 0.3, y: 0.9, duration: 1 }
		],
		on_complete: function() {
			that.next_scene_fn();
		}
	});

	this.rainer = new Emitter({
		parent: stage,
		num_particles: 5000,
		x: 0, 
		y: 0,
		width: this.w,
		height: this.h,
		emit_rate: 0.025,
		texture: this.raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio)
	});

	stage.addChild(this.umbrellas);
}

Scene_3.prototype.destroy = function() {
	this.texter.destroy();
	this.rainer.destroy();
	this.umbrellas.destroy();
}

Scene_3.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
	this.texter.update(dt);

	var that = this;
	var BOUNCE_AMOUNT = 0.06;
	var WALK_SPEED = 0.02;
	var BOUNCE_DURATION = 2400;

	this.bob += dt / BOUNCE_DURATION;
	this.bob = this.bob - ((this.bob % 1) | 0);
	this.umbrellas.children.forEach(function(child, index) {
		var offset = (index * 0.05);
		var percentage = (that.bob + offset) - ((that.bob + offset) | 0);
		var sin = percentage * 2 * Math.PI;
		child.scale.x = BOUNCE_AMOUNT * Math.sin(sin) + 0.9;
		child.scale.y = BOUNCE_AMOUNT * Math.sin(sin) + 0.9;

		child.x -= WALK_SPEED * Math.max(1 - percentage, 0.5) * dt;
		child.y -= WALK_SPEED * Math.max(1 - percentage, 0.5) * dt;

		if(child.x < -32 || child.y < -32) {
			child.x = (that.w + that.h + 32) * Math.random();
			child.y = (child.x > that.w + 32) 
				? Math.random() * that.h
				: that.h + 32;
		}

		var xPt = child.x - that.openX;
		var yPt = child.y - that.openY;
		var radius = Math.pow(xPt, 2) + Math.pow(yPt, 2);
		var CLOSE_RADIUS = 40000;
		if(radius < CLOSE_RADIUS) {
			var angle = Math.atan2(yPt, xPt);
			var percentage = 1 - (radius / CLOSE_RADIUS);

			var RUN_SPEED = 0.5;
			child.x += Math.cos(angle) * RUN_SPEED * percentage * dt;
			child.y += Math.sin(angle) * RUN_SPEED * percentage * dt;
		} else {
			child.alpha = 1;
		}

		// var yDistance = Math.pow(child.y - that.openY, 2);
		// var xDistance = Math.pow(child.x - that.openX, 2);
		// var OPEN_MAX = 40000;
		// if(xDistance + yDistance < OPEN_MIN) {
		// 	child.alpha = 0;
		// } else if(xDistance + yDistance < OPEN_MAX) {
		// 	var degree = (xDistance + yDistance - OPEN_MIN) / (OPEN_MAX - OPEN_MIN);
		// 	child.alpha = 1;
		// 	child.scale.x = degree;
		// 	child.scale.y = degree;
		// } else {
		// 	child.alpha = 1;
		// }
		
		// if(child.y > that.openY) {
		// 	child.alpha = 0;
		// } else if(child.y > that.openY - 60) {
		// 	var degree = (that.openY - child.y) / 60;
		// 	child.alpha = 1;
		// 	child.scale.x = degree;
		// 	child.scale.y = degree;
		// } else {
		// 	child.alpha = 1;
		// }
	});
}

Scene_3.prototype.click = function(e) {
	// this.is_running = true;

	// this.rainer.emitAtLocation(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
}

Scene_3.prototype.move = function(e) {
	this.openY = e.data.originalEvent.offsetY;
	this.openX = e.data.originalEvent.offsetX;
}