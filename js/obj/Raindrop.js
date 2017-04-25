function draw_raindrop(draw, x, y) {
	var nest = draw.nested();
	// var nest = draw;

	nest.circle(10).attr({
		fill: 'none',
		stroke: '#BCBCFF',
		'stroke-width': '4',
		cx: x,
		cy: y
	}).animate(500).radius(50).attr({
		opacity: 0
	});

	// var delay = 120;
	// nest.circle(10).attr({
	// 	fill: 'none',
	// 	stroke: '#BCBCFF',
	// 	'stroke-width': '4',
	// 	cx: x,
	// 	cy: y,
	// 	opacity: 0
	// }).animate({ 
	// 	duration: delay, 
	// 	ease: step_ease
	// }).attr({
	// 	opacity: 1
	// }).after(function() {
	// 	this.animate({ duration: 500 }).radius(50).attr({
	// 		opacity: 0
	// 	});
	// })

	return nest;
}