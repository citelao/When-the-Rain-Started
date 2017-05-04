function make_raindrop(radius) {
	var raindrop = new PIXI.Graphics();
	raindrop.lineStyle(4, 0x0033FF, 1);
	raindrop.drawCircle(radius, radius, radius * 2);

	return raindrop;
}

function make_umbrella(color) {
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
	umbrella.beginFill(color);
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

	for (var i = 0; i < umbrella_pts.length; i++) {
		umbrella.moveTo(32, 32);
		umbrella.lineStyle(3, 0x111111, 0.2);
		umbrella.lineTo(umbrella_pts[i][0], umbrella_pts[i][1]);
		umbrella.lineStyle(0, 0x111111, 1);
	}

	return umbrella;
}

function make_building() {
	var BUILDING_HEIGHT = 200;
	var BUILDING_WIDTH = 200;
	var FENCE_WIDTH = 10;

	var building = new PIXI.Graphics();
	building.beginFill(0x382412);
	building.drawRect(0, 0, BUILDING_WIDTH, BUILDING_HEIGHT);
	building.beginFill(0x69411D);
	building.drawRect(FENCE_WIDTH, FENCE_WIDTH, 
		BUILDING_WIDTH - 2 * FENCE_WIDTH, 
		BUILDING_HEIGHT - 2 * FENCE_WIDTH);

	var RAD_PROB = 0.3;
	var CHIMNEY_PROB = 0.5;
	var accoutrement = Math.random();
	if(accoutrement < CHIMNEY_PROB) {
		// DRAW CHIMNEY
		var y = 20 + Math.random() * (BUILDING_HEIGHT - 4 * FENCE_WIDTH - 60 - 50);
		var x = 20;
		building.beginFill(0x2c1b0c);
		building.drawRect(x, y, 40, 40);
	}
	// else if(accoutrement < CHIMNEY_PROB + RAD_PROB) {
	// 	// DRAW RADIATOR
	// 	var y = 20 + Math.random() * (BUILDING_HEIGHT - 4 * FENCE_WIDTH - 60 - 50);
	// 	var x = 20;
	// 	building.beginFill(0x2c1b0c);
	// 	building.drawCircle(x + 20, y, 20);
	// }

	if(Math.random() > 0.3) {
		building.beginFill(0xa6672e);
		building.drawRect(BUILDING_WIDTH - 2 * FENCE_WIDTH - 40, 40,
			40, 80);
	}

	return building;
}