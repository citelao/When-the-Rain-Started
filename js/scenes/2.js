// City scene

// I like that
// because it feels
// like the world
// is crying with me
function Scene_2(w, h, next_scene) {
	this.next_scene_fn = next_scene;

	this.w = w;
	this.h = h;

	// BG
	this.backgroundColor = 0x061639;

	// RAINDROP
	this.raindrop = make_raindrop(4);

	this.buildings = [];
	this.shadows = [];
	this.shadow_container = new PIXI.Container();
	this.COL_HEIGHT = Math.floor((this.h + 230 + 50) / 230);
	var num_buildings = 2 * this.COL_HEIGHT;
	for (var i = 0; i < num_buildings; i++) {
		this.buildings.push(make_building());

		var shadow = make_building_shadow();
		this.shadows.push(shadow);
		this.shadow_container.addChildAt(shadow);
	}
}

Scene_2.prototype.init = function(stage) {
	var that = this;

	var MIN_EMIT = 2000;
	this.rainer = new Emitter({
		parent: stage,
		num_particles: 5000,
		x: 0, 
		y: 0,
		width: this.w,
		height: this.h,
		emit_rate: 0.25,
		texture: this.raindrop.generateCanvasTexture(PIXI.SCALE_MODES.DEFAULT, window.devicePixelRatio)
	});

	for (var i = 0; i < this.buildings.length; i++) {
		this.buildings[i].y = (i % this.COL_HEIGHT) * 230 - 50;
		this.buildings[i].x = 20 + Math.floor(i / this.COL_HEIGHT) * 230;
		this.shadows[i].y = (i % this.COL_HEIGHT) * 230 - 50;
		this.shadows[i].x = 20 + Math.floor(i / this.COL_HEIGHT) * 230;
		stage.addChild(this.buildings[i]);
	}
	stage.addChildAt(this.shadow_container, 0);
	this.shadow_container.alpha = 0;
	
	const offset = (this.w > 500+470+400)
		? 470 + 500
		: 470 + 50;

	this.texter = new Texter({
		parent: stage,
		width: this.w,
		height: this.h,
		fontSize: 0.25,
		text: [
			{ content: "I like that.", delay: 3000, x: offset, y: 0.1 },
			{ content: "It feels like the world", delay: 1500, x: offset, y: 0.6, fontSize: 0.10 },
			{ content: "cries with me.", delay: 1500, x: offset, y: 0.7, fontSize: 0.10 },
			{ content: "(dummy advance)", delay: 4000, x: offset, y: 0.9, duration: 1 }
		],
		fontSize: 0.25,
		on_complete: function() {
			that.next_scene_fn();
		}
	});

	this.road = new PIXI.Graphics();
	this.road.beginFill(0x111111);
	this.road.drawRect(0, 0, 400, this.h);
	this.road.endFill();
	this.road.x = 500
	this.road.alpha = 0.4;
	stage.addChildAt(this.road, 0);

	this.car = make_car();
	this.shadow = make_car_shadow();
	stage.addChildAt(this.shadow, 0);
	this.car.x = 750;
	this.shadow.alpha = 0;
	this.shadow.x = this.car.x;
	this.car.y = this.h + this.car.height;
	this.shadow.y = this.car.y;
	stage.addChild(this.car);
};

Scene_2.prototype.destroy = function() {
	this.rainer.destroy();
	this.texter.destroy();

	this.road.destroy();
	this.car.destroy();
	this.car = null;

	for (var i = 0; i < this.buildings.length; i++) {
		this.buildings[i].destroy();
	}

	for (var i = 0; i < this.shadows.length; i++) {
		this.shadows[i].destroy();
	}

}

Scene_2.prototype.update = function(dt, stage) {
	this.rainer.update(dt);
	this.texter.update(dt);

	this.lightning_timer += dt;
	if(this.lightning_timer > 150) {
		this.shadow_container.alpha = 0;
		this.shadow.alpha = 0;
		this.backgroundColor = 0x061639;
	} 

	if(this.car === null) {
		return;
	}

	this.car.y = this.car.y - dt * 0.1;
	this.shadow.y = this.car.y;
}

Scene_2.prototype.click = function(e) {
	this.backgroundColor = 0xFFFFFF;
	this.shadow_container.alpha = 1;
	this.shadow.alpha = 1;

	this.lightning_timer = 0;
}