function TraceriderCamera(target, x) {
	this.y = 0;
	this.velocity = 0;
	this.target = target;
	this.x = x;
};

TraceriderCamera.SPACE_AHEAD = 420;

TraceriderCamera.prototype.think = function(delta) {
	if (this.target.alive && !this.target.cutscene) {
		var velocity = this.velocity;
		
		if (this.target instanceof Player && this.target.isSpedUp())
			velocity *= Player.SPEEDUP_FACTOR;
		
		this.y -= velocity * delta;
	
		game.game_engine.setCamera(-this.x, this.y);
	}
};

TraceriderCamera.prototype.reset = function() {
	if (this.target.cutscene) {
		this.y = game.game_state.current_level.getHeight() + TraceriderLevel.PLAYER_START_SPACE - TraceriderCamera.SPACE_AHEAD;
	}
	else {
		this.y = this.target.y - TraceriderCamera.SPACE_AHEAD - TraceriderUIContainer.HEIGHT;
	}
	
	game.game_engine.setCamera(-this.x, this.y);
};

TraceriderCamera.prototype.setVelocity = function(velocity) {
	this.velocity = velocity;
};
