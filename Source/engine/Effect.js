function Effect(x, y, total_time) {
	this.x = x;
	this.y = y;
	this.total_time = total_time;
	this.time = 0;
	this.removed = false;
};

Effect.prototype.step = function(delta) {
	this.time += delta;
	
	if (this.time >= this.total_time) {
		game.game_state.removeEffect(this);	
	}
	else {
		this.think(delta);
	}
};

Effect.prototype.display = function(context) {};


SpriteEffect.prototype = Object.create(Effect.prototype);
SpriteEffect.parent = Effect.prototype;

function SpriteEffect(x, y, sprite_sheet, animation) {
	this.constructor(x, y);
	this.sprite = new Sprite(sprite_name);
	this.sprite.init(animation);
}

SpriteEffect.prototype.think = function(delta) {
	this.sprite.advanceAnimation(delta);
};

SpriteEffect.prototype.display = function(context) {
	this.sprite.display(this.x, this.y, context);
};
