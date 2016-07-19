Player.prototype = Object.create(Actor.prototype);
Player.parent = Actor.prototype;

Player.MAX_VELOCITY = 90;
Player.ACCELERATION = 300;
Player.DECELERATION = 700;

Player.WIDTH = 30;
Player.HEIGHT = 60;
Player.HITBOX_WIDTH = 10;
Player.HITBOX_HEIGHT = 40;

Player.DEATH_TIME = 2.2;
Player.INVINCIBILITY_TIME = 1.7;
Player.SPEEDUP_TIME = .5;
Player.SPEEDUP_FACTOR = 4;

Player.HITBOX_GAP = .1;

Player.GLITCH_CHANCES = [.05,.1,.2,.6];
Player.GLITCH_COUNTS  = [1,2,5,15];

function Player() {
	var vertical_hitbox_gap   = Player.HEIGHT - Player.HITBOX_HEIGHT;
	var horizontal_hitbox_gap = Player.WIDTH  - Player.HITBOX_WIDTH;
	
	this.constructor(
		new Rectangle(
			horizontal_hitbox_gap / 2,
			vertical_hitbox_gap / 2,
			Player.HITBOX_WIDTH,
			Player.HITBOX_HEIGHT
		),
		 'player'
	);
	
	this.camera_target = true;
	this.cutscene = 'intro';
	this.deployed = false;
	this.cutscene_glitch = false;
}

Player.prototype.init = function() {
	Player.parent.init.call(this);
	this.reset();
};

Player.prototype.reset = function() {
	this.stopAll();
	this.slowing = [false,false];
	this.glitching = false;
	this.alive = true;
	this.invincibility_time = 0;
	this.speedup_time = 0;
	this.x = (game.game_state.current_level.getWidth() - Player.WIDTH) / 2;
	
	if (this.cutscene) {
		this.y = game.game_state.getCamera(this).y - Player.HEIGHT;
	}
	else {
		this.y = game.game_state.current_level.getHeight() + TraceriderLevel.PLAYER_START_SPACE;
	}
};

Player.prototype.move = function(direction) {
	if (!this.alive) return;
	
	if (direction == 'right') {
		this.x_acceleration = Player.ACCELERATION;
		this.slowing[0] = false;
	}
	else if (direction == 'left') {
		this.x_acceleration = -Player.ACCELERATION;;
		this.slowing[0] = false;
	}
	
	if (direction == 'down') {
		this.y_acceleration = Player.ACCELERATION;;
		this.slowing[1] = false;
	}
	else if (direction == 'up') {
		this.y_acceleration = -Player.ACCELERATION;;
		this.slowing[1] = false;
	}	
};

Player.prototype.slowHorizontal = function() {
	this.slowing[0] = true;
	
	if (this.x_velocity > 0) {
		this.x_acceleration = -Player.DECELERATION;
	}
	else {
		this.x_acceleration = Player.DECELERATION;
	}
};

Player.prototype.slowVertical = function() {
	this.slowing[1] = true;
	
	if (this.y_velocity > 0) {
		this.y_acceleration = -Player.DECELERATION;
	}
	else {
		this.y_acceleration = Player.DECELERATION;
	}
};

Player.prototype.glitchOn = function() {
	if (!this.alive) return;
	
	this.glitching = true;
};

Player.prototype.glitchOff = function() {
	if (!this.alive) return;
	this.glitching = false;
};

Player.prototype.preaccelerate = function(delta) {
	if (this.cutscene) return;
	
	if (this.x_velocity > Player.MAX_VELOCITY) {
		this.x_velocity = Player.MAX_VELOCITY;
		this.x_acceleration = 0;
	}
	if (this.x_velocity < -Player.MAX_VELOCITY) {
		this.x_velocity = -Player.MAX_VELOCITY;
		this.x_acceleration = 0;
	}	
	
	if (this.y_velocity > Player.MAX_VELOCITY) {
		this.y_velocity = Player.MAX_VELOCITY;
		this.y_acceleration = 0;
	}
	if (this.y_velocity < -Player.MAX_VELOCITY) {
		this.y_velocity = -Player.MAX_VELOCITY;
		this.y_acceleration = 0;
	}		
};

Player.prototype.premove = function(delta) {
	if (this.alive && !this.cutscene) {
		var velocity = game.game_state.current_level.getVelocity();
		if (this.isSpedUp() > 0)
			velocity *= Player.SPEEDUP_FACTOR;
		
		this.y -= velocity * delta;
	}
	
	if (this.slowing[0] == true) {
		if (this.x_velocity < 0 && this.x_acceleration < 0) {
			this.x_velocity = 0;
			this.x_acceleration = 0;
		}
		else if (this.x_velocity > 0 && this.x_acceleration > 0) {
			this.x_velocity = 0;
			this.x_acceleration = 0;
		}
	}
	
	if (this.slowing[1] == true) {
		if (this.y_velocity < 0 && this.y_acceleration < 0) {
			this.y_velocity = 0;
			this.y_acceleration = 0;
		}
		else if (this.y_velocity > 0 && this.y_acceleration > 0) {
			this.y_velocity = 0;
			this.y_acceleration = 0;
		}
	}
};

Player.prototype.think = function(delta) {
	if (this.cutscene == 'intro') {
		if (this.y >= game.game_state.current_level.getHeight() + TraceriderLevel.PLAYER_START_SPACE) {
			this.y = game.game_state.current_level.getHeight() + TraceriderLevel.PLAYER_START_SPACE;
			this.y_velocity = 0;
		}
	}
	
	else if (this.cutscene == 'win') {
		if (this.y >= WinPhase.PLAYER_STOP_Y && this.cutscene_glitch == false) {
			this.y = WinPhase.PLAYER_STOP_Y;
			this.y_velocity = 0;
		}
	}
	
	else {
		if (this.invincibility_time > 0)
			this.invincibility_time -= delta;
			
		if (this.speedup_time > 0)
			this.speedup_time -= delta;
			
		if (!game.game_state.isJail()) {
			if (this.x < 0) {
				this.x = 0;
			}
			if (this.getHitbox().right_x() > Tracerider.SPLITSCREEN_WINDOW.width) {
				this.x = Tracerider.SPLITSCREEN_WINDOW.width - Player.WIDTH;	
			}
		}
	}
};

Player.prototype.oncollide = function(other_actor, sides) {
	if (this.cutscene) return;
	
	if (other_actor instanceof LevelTile) {
		if (this.isInvincible()) return;
		
		// inverted tile
		else if (other_actor.attributes['glitch'] && this.glitching) {
			this.die();
		}
		
		// normal tile
		else if (other_actor.attributes['solid'] && !this.glitching) {
			this.die();
		}
		
		else if (other_actor.attributes['stops_players'] && !this.glitching) {
			this.collideStop(other_actor, sides, Player.HITBOX_GAP);
		}
	}
	
	if (other_actor instanceof Barrier && !this.isInvincible()) {
		this.die();
	}
	
	if (other_actor instanceof Debugger && other_actor.state == Debugger.STATES.LOCKED) {
		
		var x_buffer = other_actor.x + ((Debugger.WIDTH  - Player.WIDTH)  / 2) - this.x;
		var y_buffer = other_actor.y + ((Debugger.HEIGHT - Player.HEIGHT) / 2) - this.y;
		
		if (Math.abs(x_buffer) < Debugger.CATCH_BUFFER && Math.abs(y_buffer) < Debugger.CATCH_BUFFER) {
			other_actor.caughtPlayer();
			game.game_state.playerCaught();
		} 
	}
	
	if (other_actor instanceof BonusGate && !this.glitching) {
		game.game_state.removeActor(other_actor);
		this.speedUp();
	}
};

Player.prototype.speedUp = function() {
	this.speedup_time = Player.SPEEDUP_TIME;
	game.sound_map.getSound('speedup').play();
};

Player.prototype.isSpedUp = function() {
	if (this.speedup_time > 0) return true;
	return false;
};

Player.prototype.die = function() {
	game.sound_map.getSound('died').play();
	game.game_state.addDeath();
	this.stopAll();
	this.alive = false;
	this.setTimer(Player.DEATH_TIME, 'reanimate');
};

Player.prototype.reanimate = function() {
	this.alive = true;
	game.sound_map.getSound('restart').play();
	this.invincibility_time = Player.INVINCIBILITY_TIME;
};

Player.prototype.isInvincible = function() {
	return (!this.alive || this.invincibility_time > 0);
};

Player.prototype.predisplay = function() {
	this.updateAnimation();
};

Player.prototype.updateAnimation = function() {
	var animation_name;
	
	if (this.cutscene == 'intro') {
		if (this.y < (game.game_state.current_level.getHeight() + 0 + TraceriderLevel.PLAYER_START_SPACE))
			animation_name = 'introspin';
		else if (!this.deployed)
			animation_name = 'introdeploy';	
		else
			animation_name = 'normal';
	}
	
	else if (this.cutscene == 'win') {
		if (this.cutscene_glitch)
			animation_name = 'glitch';
		else
			animation_name = 'normal';
	}
	
	else {
		if (this.alive == false) {
			animation_name = 'dead';
		}
		else if (this.isInvincible()) {
			animation_name = 'invincible';
		}
		else if (this.glitching == true) {
			animation_name = 'glitch';
		}
		else {
			animation_name = 'normal';
		}
		
		if (this.x_velocity < 0 && !this.slowing[0])
			animation_name = animation_name + 'left';
		else if (this.x_velocity > 0 && !this.slowing[0])
			animation_name = animation_name + 'right';
	}
	
	if (this.sprite.current_animation.name != animation_name)
		this.sprite.playAnimation(animation_name);
};

Player.prototype.onAnimationDone = function(animation_name) {
	if (animation_name == 'introdeploy') {
		this.deployed = true;
	}
};

Player.prototype.introExplode = function() {
	game.sound_map.getSound('died').play();
	game.game_state.addExplosion(this.x + (Player.WIDTH / 2), this.y + (Player.HEIGHT / 2));
};

Player.prototype.setCamera = function(camera_number) { this.camera = camera_number; };
Player.prototype.getCamera = function() { return this.camera; };

Player.prototype.cutsceneEnd = function() { this.cutscene = false; };

Player.prototype.introCutsceneActivate = function() {
	this.y_velocity = IntroPhase.TRACER_VELOCITY;
};

Player.prototype.isCutsceneDone = function() { return this.deployed; };

Player.prototype.setWinCutscene = function() {
	this.cutscene = 'win';
	this.y = -Player.HEIGHT;
	this.x = game.WINDOW_WIDTH / 2;
	this.stopAll();
	this.y_velocity = WinPhase.PLAYER_VELOCITY;
};

Player.prototype.winCutsceneTransition = function() {
	this.setTimer(WinPhase.getGlitchTime(), 'cutsceneGlitch');
};

Player.prototype.cutsceneGlitch = function() {
	this.cutscene_glitch = true;
	this.setTimer(WinPhase.MOVE_DELAY, 'cutsceneMove');
};

Player.prototype.cutsceneMove = function() {
	this.y_velocity = WinPhase.PLAYER_VELOCITY;
};

Player.prototype.isWinCutsceneOver = function() {
	if (this.y > game.WINDOW_HEIGHT) return true;
	return false;
};

Player.prototype.postdisplay = function(context) {
	var level = game.game_state.level_progress;
	
	var glitches = Player.GLITCH_COUNTS[level];
	var glitch_chance = Player.GLITCH_CHANCES[level];
	
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
