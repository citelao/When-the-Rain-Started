function Scene_3(stage, w, h) {
	this.backgroundColor = 0x061639;

	this.w = w;
	this.h = h;
	// this.w = 500;
	// this.h = 200;

	// Generate an umbrella shape
	// lazy: http://www.mathopenref.com/coordpolycalc.html
	var umbrella_pts = [
		[ 44,2 ],
		[ 20,2 ],
		[ 2,20 ],
		[ 2,44 ],
		[ 20,62 ],
		[ 44,62 ],
		[ 62,44 ],
		[ 62,20 ]
	];
	var umbrella = new PIXI.Graphics();
	umbrella.beginFill(0x111111);
	umbrella.moveTo(umbrella_pts[0][0], umbrella_pts[0][1]);
	for (var i = 0; i < umbrella_pts.length; i++) {
		var second = i === umbrella_pts.length - 1
			? umbrella_pts[0]
			: umbrella_pts[i + 1];
		var first = umbrella_pts[i];

		var mid = [
			(second[0] + first[0]) / 2,
			(second[1] + first[1]) / 2,
		];
		var WEIGHT = 0.5;
		var int = [
			(1 - WEIGHT) * mid[0] + WEIGHT * 32,
			(1 - WEIGHT) * mid[1] + WEIGHT * 32,
		];
		umbrella.bezierCurveTo(first[0], first[1], int[0], int[1], second[0], second[1]);
	}
	umbrella.closePath();
	umbrella.endFill();
	var tex = umbrella.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio);

	this.umbrellas = new PIXI.Sprite();
	// this.umbrellas.x = 500;
	// this.umbrellas.y = 100;
	const UMBRELLAS = 400;
	for (var i = 0; i < UMBRELLAS; i++) {
		var clone = new PIXI.Sprite(tex);
		clone.anchor.set(0.5, 0.5);
		clone.x = Math.random() * this.w;
		clone.y = Math.random() * this.h;
		this.umbrellas.addChild(clone);
		clone.rotation = Math.random();
	}

	var text = new PIXI.Text(
		"and I know",
	  	{fontFamily: 'Amatic SC', fontSize: 300, fill: "#526287", padding: 40}
	);
	var only = new PIXI.Text(
		"that only I",
	  	{fontFamily: 'Amatic SC', fontSize: 300, fill: "#526287", padding: 40}
	);
	var control = new PIXI.Text(
		"control my mood",
	  	{fontFamily: 'Amatic SC', fontSize: 200, fill: "#526287", padding: 40}
	);
	only.y = 300;
	control.y = 600;
	// text.mask = this.umbrellas;
	this.text = new PIXI.Container();
	this.text.addChild(text);
	this.text.addChild(only);
	this.text.addChild(control);

	this.text.x = 400;
	this.text.y = 40;
	stage.addChild(this.text);
	// this.umbrellas.mask = this.umbrella;
	// this.umbrella.mask = this.umbrellas;
	// this.umbrella.anchor.set(0.5, 0.5);

	// this.umbrella.addChild(this.umbrellas);
	this.raindrop = new PIXI.Graphics();
	this.raindrop.lineStyle(2, 0x0033FF, 1);
	this.raindrop.drawCircle(5, 5, 10);

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

	this.bob = 0;
}

Scene_3.prototype.update = function(dt, stage) {
	this.rainer.update(dt);

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

		if(child.y > that.openY) {
			child.alpha = 0;
		} else if(child.y > that.openY - 60) {
			var degree = (that.openY - child.y) / 60;
			child.alpha = 1;
			child.scale.x = degree;
			child.scale.y = degree;
		} else {
			child.alpha = 1;
		}
	});
}

Scene_3.prototype.click = function(e) {
	// this.is_running = true;

	// this.rainer.emitAtLocation(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
}

Scene_3.prototype.move = function(e) {
	this.openY = e.data.originalEvent.offsetY;
}