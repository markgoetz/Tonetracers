function UIElement() {}

UIElement.prototype.getValue = function() {
	throw 'getValue not defined.  It should return the value for the UIElement to display.';
};

UIElement.prototype.display = function(context) {
	this.predisplay(context);
	this.draw(context);
	this.postdisplay(context);
};

UIElement.prototype.draw = function(context) {
	throw 'display not defined.';
};

UIElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

UIElement.prototype.step = function(delta) {
	
};

UIElement.prototype.predisplay = function(context) {};
UIElement.prototype.postdisplay = function(context) {};




SpriteRepeaterUIElement.prototype = Object.create(UIElement.prototype);
SpriteRepeaterUIElement.parent = UIElement.prototype;

function SpriteRepeaterUIElement(sprite_name, padding) {
	this.padding = padding;
	this.sprite = new Sprite(sprite_name);
	this.sprite.init();
	this.sprite_width  = this.sprite.sprite_sheet.tile_width;
	this.sprite_height = this.sprite.sprite_sheet.tile_height;
}

SpriteRepeaterUIElement.prototype.draw = function(context)  {
	var sprite_x = this.x;

	var value = this.getValue();
	for (var i = 0; i < value; i++) {
		this.sprite.display(sprite_x, this.y, context);
		sprite_x += this.sprite_width + this.padding;
	}
};

SpriteRepeaterUIElement.prototype.step = function(delta) {
	this.sprite.advanceAnimation(delta);
};


MeterUIElement.prototype = Object.create(UIElement.prototype);
MeterUIElement.parent = UIElement.prototype;

function MeterUIElement(width, height, color, border_color) {
	this.width = width;
	this.height = height;
	this.color = color;
	this.border_color = border_color;
};

MeterUIElement.prototype.draw = function(context) {
	var value = this.getValue();
	
	value = Math.max(0, Math.min(value, 1));
	
	context.lineWidth = 1;
	context.strokeStyle = this.border_color;
	context.strokeRect(this.x, this.y, this.width, this.height);
	
	context.fillStyle = this.color;
	context.fillRect(this.x + 1, this.y + 1, this.getValue() * (this.width - 2), this.height - 2);
};


TextUIElement.prototype = Object.create(UIElement.prototype);
TextUIElement.parent = UIElement.prototype;

function TextUIElement(font, color) {
	this.font = font;
	this.color = color;
}

// TO-DO: include things like color changes, text align changes, etc.
TextUIElement.prototype.draw = function(context) {
	context.fillStyle = this.color;
	context.textAlign = 'right';
	context.font = this.font;
	context.textBaseline = 'top';
	context.fillText(this.getValue(), this.x, this.y);
};