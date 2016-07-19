VolumeDisplay.prototype = Object.create(UIElement.prototype);
VolumeDisplay.parent = UIElement.prototype;

VolumeDisplay.RGB = '0,255,0';
VolumeDisplay.VISIBLE = .8;
VolumeDisplay.FADEOUT = .7;
VolumeDisplay.HEIGHT = 32;
VolumeDisplay.BAR_WIDTH = 16;

function VolumeDisplay() {
	UIElement.call(this);
	this.fade_delay = 0;
}

VolumeDisplay.prototype.step = function(delta) {
	if (this.fade_delay > 0) {
		this.fade_delay -= delta;
		
		if (this.fade_delay < 0) this.fade_delay = 0; 
	}
};

VolumeDisplay.prototype.display = function(context) {
	if (this.fade_delay == 0) return;
	
	var alpha;
	
	if (this.fade_delay > VolumeDisplay.FADEOUT)
		alpha = 1;
	else
		alpha = (this.fade_delay * VolumeDisplay.FADEOUT);
	
	var volume = game.game_engine.getVolume();
	
	var x = 0;
	var rgba_color = 'rgba(' + VolumeDisplay.RGB + ',' + alpha + ')';
	context.fillStyle = rgba_color;

	for (var i = 0; i < volume; i++) {
		context.fillRect(this.x + x, this.y, VolumeDisplay.BAR_WIDTH, VolumeDisplay.HEIGHT);
		x += VolumeDisplay.BAR_WIDTH * 2;
	}
};

VolumeDisplay.prototype.turnOn = function() {
	this.fade_delay = VolumeDisplay.VISIBLE + VolumeDisplay.FADEOUT;
};
