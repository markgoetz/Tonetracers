Glitch.prototype = Object.create(Actor.prototype);
Glitch.parent = Actor.prototype;

Glitch.WIDTH  = 30;
Glitch.HEIGHT = 60;

Glitch.GLITCH_COUNT  = 12;
Glitch.GLITCH_CHANCE = .5;

Glitch.HITBOX_GAP = .1;

function Glitch(x, y) {
	this.constructor(
		new Rectangle(
			Glitch.HITBOX_GAP,
			Glitch.HITBOX_GAP,
			Glitch.WIDTH - Glitch.HITBOX_GAP * 2,
			Glitch.HEIGHT - Glitch.HITBOX_GAP * 2 
		),
		 'player'
	);

	this.cutscene_glitch = false;
	this.start_x = x;
	this.start_y = y;
}

Glitch.prototype.init = function() {
	Glitch.parent.init.call(this);
	this.reset();
};

Glitch.prototype.reset = function() {
	this.x = this.start_x;
	this.y = this.start_y;
};

Glitch.prototype.winCutsceneTransition = function() {
	this.setTimer(WinPhase.getGlitchTime(), 'cutsceneGlitch');
};

Glitch.prototype.cutsceneGlitch = function() {
	this.cutscene_glitch = true;
	this.setTimer(WinPhase.MOVE_DELAY, 'cutsceneMove');
};

Glitch.prototype.cutsceneMove = function() {
	this.y_velocity = WinPhase.PLAYER_VELOCITY;
};

Glitch.prototype.isWinCutsceneOver = function() {
	if (this.y > game.WINDOW_HEIGHT) return true;
	return false;
};

Glitch.prototype.predisplay = function() {
	this.updateAnimation();
};

Glitch.prototype.updateAnimation = function() {
	var animation_name;
	
	if (this.cutscene_glitch)
		animation_name = 'glitch';
	else
		animation_name = 'normal';
	
	if (this.sprite.current_animation.name != animation_name)
		this.sprite.playAnimation(animation_name);
};


Glitch.prototype.postdisplay = function(context) {
	var level = game.game_state.level_progress;
	
	var glitches = Glitch.GLITCH_COUNT;
	var glitch_chance = Glitch.GLITCH_CHANCE;
	
	for (var i = 0; i < glitches; i++) {
		if (Math.random() < glitch_chance) {
			context.fillStyle = PlayerDiedEffect.COLORS[Math.floor(Math.random() * PlayerDiedEffect.COLORS.length)];
			var x = 5 * Math.floor(Math.random() * Player.WIDTH  / 5); 
			var y = 5 * Math.floor(Math.random() * Player.HEIGHT / 5); 

			context.fillRect(
				this.x + x - game.game_engine.camera_x,
				this.y + y - game.game_engine.camera_y,
				5,
				5
			);
		}
	}
};