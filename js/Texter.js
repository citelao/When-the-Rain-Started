function Texter(o) {
	this.x = o.x || 0;
	this.y = o.y || 0;
	this.width = o.width;
	this.height = o.height;
	this.text = o.text;
	this.fontSize = o.fontSize || 60;

	this.center = o.center || false;

	this._parent = o.parent;
	this._on_complete = o.on_complete || function() {};

	// STATE
	this.state = {
		current_index: 0,
		elapsed: 0,
		fade_ins: [],
	};

	this.container = new PIXI.Container();
	this.container.x = this.x;
	this.container.y = this.y;
	this._parent.addChild(this.container);
}

Texter.prototype.destroy = function() {
	this.container.destroy();
}

Texter.prototype.update = function(dt) {
	this.state.elapsed += dt;

	// Make text fade in
	for (var i = 0; i < this.state.fade_ins.length; i++) {
		var fade_state = this.state.fade_ins[i];
		var fade_config = this.text[fade_state.index];
		fade_state.elapsed += dt;

		var fade_duration = fade_config.duration || 500;
		var completion = Math.min(1, fade_state.elapsed / fade_duration);
		fade_state.sprite.alpha = completion;

		if(fade_state.elapsed >= fade_duration) {
			this.state.fade_ins.splice(i, 1);


			if(fade_state.index === this.text.length - 1) {
				this._on_complete();
			}
		}
	}

	// Make text sprites
	if(this.state.current_index >= this.text.length) {
		return;
	}

	var current_text = this.text[this.state.current_index];
	if(current_text.delay <= this.state.elapsed) {
		var font_size = current_text.fontSize || this.fontSize;
		var message = new PIXI.Text(
			current_text.content,
		  	{
		  		fontFamily: 'Amatic SC', 
		  		fontSize: font_size <= 1 
		  			? this.height * font_size
		  			: font_size, 
		  		fill: "#526287", 
		  		padding: 40
		  	}
		);
		message.alpha = 0;

		if(this.center) {
			message.anchor.set(0.5, 0.5);
		}

		var x = current_text.x <= 1
			? current_text.x * this.width
			: current_text.x;
		var y = current_text.y <= 1
			? current_text.y * this.height
			: current_text.y;

		message.x = x;
		message.y = y;
		this.container.addChild(message);

		this.state.fade_ins.push({ index: this.state.current_index, sprite: message, elapsed: 0 });
		this.state.current_index += 1;
		this.state.elapsed = 0;	
	}
}