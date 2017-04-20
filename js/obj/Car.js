function draw_car(draw) {
	var n = draw.nested();

	n.rect(70, 120).attr({
		fill: "#3B82D2"
	});
	n.rect(70, 60).attr({
		y: 40,
		fill: "#1C4F89"
	});

	return n;
}