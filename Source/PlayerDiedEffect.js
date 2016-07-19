PlayerDiedEffect.prototype = Object.create(Effect.prototype);
PlayerDiedEffect.parent = Effect.prototype;

PlayerDiedEffect.TIME = .5;
PlayerDiedEffect.VELOCITY = 90;
PlayerDiedEffect.SIZE = 7;
PlayerDiedEffect.COLORS = ['#02957c', '#cd369c', '#ffe685'];

function PlayerDiedEffect(x, y, angle) {
	this.constructor(x, y, PlayerDiedEffect.TIME);
	this.x = x;
	this.y = y;
	this.size = PlayerDiedEffect.SIZE;
	this.color = PlayerDiedEffect.COLORS[Math.floor(Math.random() * PlayerDiedEffect.COLORS.length)];
	this.x_velocity = PlayerDiedEffect.VELOCITY * Math.cos(angle);
	this.y_velocity = PlayerDiedEffect.VELOCITY * Math.sin(angle);
}

PlayerDiedEffect.prototype.think = function(delta) {
	this.size -= (PlayerDiedEffect.SIZE * delta / PlayerDiedEffect.TIME);
	this.x += this.x_velocity * delta;
	this.y += this.y_velocity * delta;
};

PlayerDiedEffect.prototype.display = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.x - game.game_engine.camera_x, this.y - game.game_engine.camera_y, this.size, this.size);
};
