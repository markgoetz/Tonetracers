TraceriderUIContainer.prototype = Object.create(UIElementContainer.prototype);
TraceriderUIContainer.parent = UIElementContainer.prototype;

TraceriderUIContainer.HEIGHT = 60;

TraceriderUIContainer.BACKGROUND_COLOR = '#001f1a';
TraceriderUIContainer.FONT_COLOR = '#ffe785';

function TraceriderUIContainer() {
	this.constructor(new Rectangle(0, 0, game.WINDOW_WIDTH, TraceriderUIContainer.HEIGHT));
	this.addUIElement(new TraceriderDeathCounter(), 100, 15);
	this.addUIElement(new VolumeDisplay(), (game.WINDOW_WIDTH - 21 * VolumeDisplay.BAR_WIDTH) / 2, 0);
};

TraceriderUIContainer.prototype.displayBackground = function(context) {
	context.fillStyle = TraceriderUIContainer.BACKGROUND_COLOR;
	context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
	
	context.fillStyle = TraceriderUIContainer.FONT_COLOR;
	context.font = '30px ' + Tracerider.FONT_NAME;
	context.textAlign = 'left';
	context.textBaseline = 'top';
	context.fillText('fails:', 15, 15);
};

TraceriderUIContainer.prototype.showVolume = function() {
	this.elements[0].turnOn();
};