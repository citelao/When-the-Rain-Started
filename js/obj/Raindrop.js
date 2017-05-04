function make_raindrop(radius) {
	var raindrop = new PIXI.Graphics();
	raindrop.lineStyle(4, 0x0033FF, 1);
	raindrop.drawCircle(radius, radius, radius * 2);

	return raindrop;
}