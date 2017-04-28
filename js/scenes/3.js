function Scene_3(stage, w, h) {
	this.backgroundColor = 0x061639;

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
	umbrella.beginFill(0x0033FF);
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

	this.umbrellas = new PIXI.Container();
	const UMBRELLAS = 60;
	for (var i = 0; i < UMBRELLAS; i++) {
		var clone = new PIXI.Sprite(tex);
		clone.anchor.set(0.5, 0.5);
		clone.x = Math.random() * 1500;
		clone.y = Math.random() * 800;
		this.umbrellas.addChild(clone);
	}
	// var text = new PIXI.Text(
	// 	"33333333",
	//   	{fontFamily: 'Amatic SC', fontSize: 300, fill: "#fff", padding: 20}
	// );
	// text.mask = umbrella;
	// this.umbrella = text;
	// this.umbrella.x = 0;
	// this.umbrella.y = 0;

	// stage.addChild(this.umbrella);
	stage.addChild(this.umbrellas);

	this.bob = 0;
}

Scene_3.prototype.update = function(dt, stage) {
	// Test
	var that = this;
	var BOUNCE_DURATION = 600;
	var BOUNCE_AMOUNT = 0.1;

	this.bob += dt / BOUNCE_DURATION;
	this.bob = this.bob - ((this.bob % 1) | 0);
	this.umbrellas.children.forEach(function(child, index) {
		var offset = index * 0.05;
		child.scale.x = BOUNCE_AMOUNT * Math.sin((that.bob + offset) * 2 * Math.PI) + 0.9;
		child.scale.y = BOUNCE_AMOUNT * Math.sin((that.bob + offset) * 2 * Math.PI) + 0.9;
	});
}

Scene_3.prototype.click = function(e) {
	this.is_running = true;

	this.rainer.emitAtLocation(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
}