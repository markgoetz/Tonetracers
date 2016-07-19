Debugger.prototype = Object.create(Actor.prototype);
Debugger.parent = Actor.prototype;

Debugger.WIDTH = 60;
Debugger.HEIGHT = 60;
Debugger.HITBOX_GAP = .1;
Debugger.VELOCITY = 100;
Debugger.LOCK_TIME = .66;
Debugger.CATCH_BUFFER = 2;

Debugger.STATES = {
	PATROLLING: 1,
	HOMING:     2,
	LOCKED:     3,
	RESETTING:  4,
	CAUGHT:     5
};


function Debugger() {
	this.constructor(
		new Rectangle(
			Debugger.HITBOX_GAP,
			Debugger.HITBOX_GAP,
			Debugger.WIDTH - Debugger.HITBOX_GAP * 2,
			Debugger.HEIGHT - Debugger.HITBOX_GAP * 2 
		),
		 'debugger'
	);
}

Debugger.prototype.init = function() {
	Debugger.parent.init.call(this);
	this.state = Debugger.STATES.PATROLLING;
	this.setDirection('down');
	this.horiz_direction = 'right';
	this.vert_direction = 'up';
	this.target_x = 0;
	this.target_y = 0;
	this.x = 0; this.y = game.game_state.getCameraTop();
	this.lock_time = 0;
};

Debugger.prototype.think = function(delta) {
	var player = game.game_state.getPlayer();
	
	if (player.alive) {
		this.y -= game.game_state.current_level.getVelocity() * delta;
	}
	
	switch (this.state) {
		case (Debugger.STATES.PATROLLING):
			if (this.direction == 'down') {
				if (this.y + Debugger.HEIGHT > game.game_state.getCameraBottom()) {
					this.y = game.game_state.getCameraBottom() - Debugger.HEIGHT;
					this.setDirection(this.horiz_direction);
					this.vert_direction = 'up';
				}
			}
			if (this.direction == 'up') {
				if (this.y < game.game_state.getCameraTop()) {
					this.y = game.game_state.getCameraTop();
					this.setDirection(this.horiz_direction);
					this.vert_direction = 'down';
				}
			}
			else if (this.direction == 'left') {
				if (Math.ceil(this.x / Debugger.WIDTH) < Math.ceil(this.prev_x / Debugger.WIDTH)) {
					this.x = Math.ceil(this.x / Debugger.WIDTH) * Debugger.WIDTH;
					
					if (this.x == 0)
						this.horiz_direction = 'right';
					
					this.setDirection(this.vert_direction);
				}
			}
			else if (this.direction == 'right') {
				if (Math.floor(this.x / Debugger.WIDTH) > Math.floor(this.prev_x / Debugger.WIDTH)) {
					this.x = Math.floor(this.x / Debugger.WIDTH) * Debugger.WIDTH;
					
					if (this.x == Tracerider.SPLITSCREEN_WINDOW.width - Debugger.WIDTH)
						this.horiz_direction = 'left';
					
					this.setDirection(this.vert_direction);
				}
			}
		
			if (player.glitching && player.alive) {
				this.state = Debugger.STATES.HOMING;
			}
			
			this.lock_time -= delta;
			if (this.lock_time < 0) this.lock_time = 0;
			
			break;
			
			
		
		case (Debugger.STATES.HOMING):
			this.setVelocityByVector(Debugger.VELOCITY, player.x - this.x - (Debugger.WIDTH - Player.WIDTH) / 2, player.y - this.y - (Debugger.HEIGHT - Player.HEIGHT) / 2);	
			if (!player.glitching || !player.alive) {
				this.resetPatrol();
			}
			else {
				this.lock_time += delta;
				
				if (this.lock_time > Debugger.LOCK_TIME)
					this.state = Debugger.STATES.LOCKED;
			}
			break;
			
		
		case (Debugger.STATES.LOCKED):
			this.setVelocityByVector(Debugger.VELOCITY, player.x - this.x - (Debugger.WIDTH - Player.WIDTH) / 2, player.y - this.y - (Debugger.HEIGHT - Player.HEIGHT) / 2);	
			if (!player.glitching || !player.alive) {
				this.resetPatrol();
			}
			break;
		
		case (Debugger.STATES.RESETTING):
			if ((this.x_velocity > 0 && this.x > this.target_x) || (this.x_velocity < 0 && this.x < this.target_x)) {
				
				this.x = this.target_x;
				this.y = this.target_y;
				
				this.state = Debugger.STATES.PATROLLING;
				this.setDirection(this.direction); // TO-DO: clarify which direction.
			}
			
			this.lock_time -= delta;
			if (this.lock_time < 0) this.lock_time = 0;
		
			break;
		case (Debugger.STATES.CAUGHT):
			this.x = player.x - (Debugger.WIDTH - Player.WIDTH) / 2;
			this.y = player.y - (Debugger.HEIGHT - Player.HEIGHT) / 2;

	}
};

Debugger.prototype.resetPatrol = function() {
	this.target_x = Math.round(this.x / Debugger.WIDTH)  * Debugger.WIDTH;
	this.target_y = Math.round(this.y / Debugger.HEIGHT) * Debugger.HEIGHT;
	
	this.setVelocityByVector(Debugger.VELOCITY, this.target_x - this.x, this.target_y - this.y);	
	
	this.state = Debugger.STATES.RESETTING;
};

Debugger.prototype.setDirection = function(direction) {
	this.direction = direction;
	if (direction == 'down') {
		this.x_velocity = 0;
		this.y_velocity = Debugger.VELOCITY;
	}
	else if (direction == 'up') {
		this.x_velocity = 0;
		this.y_velocity = -Debugger.VELOCITY;
	}
	else if (direction == 'left') {
		this.x_velocity = -Debugger.VELOCITY;
		this.y_velocity = 0;
	}
	else if (direction == 'right') {
		this.x_velocity = Debugger.VELOCITY;
		this.y_velocity = 0;
	}
};

Debugger.prototype.predisplay = function(context) {
	this.updateAnimation();
};

Debugger.prototype.updateAnimation = function() {
	var animation_name;
	if (this.state == Debugger.STATES.CAUGHT) {
		animation_name = 'caught';
	}
	else if (this.state == Debugger.STATES.LOCKED) {
		animation_name = 'locked';
	}
	else if (this.state == Debugger.STATES.HOMING) {
		animation_name = 'homing';
	}
	else {
		animation_name = 'normal';
	}
	
	if (this.sprite.current_animation.name != animation_name)
		this.sprite.playAnimation(animation_name);
};

Debugger.prototype.caughtPlayer = function() {
	this.state = Debugger.STATES.CAUGHT;
};

Debugger.prototype.coordinatesForPlayer = function() {
	
};

Debugger.prototype.setCamera = function(camera_number) { this.camera = camera_number; };
Debugger.prototype.getCamera = function() { return this.camera; };