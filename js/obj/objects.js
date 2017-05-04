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