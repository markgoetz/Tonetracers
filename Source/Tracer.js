Tracer.prototype = Object.create(Actor.prototype);
Tracer.parent = Actor.prototype;

Tracer.VELOCITY = 600;

Tracer.WIDTH = 30;
Tracer.HEIGHT = 60;

Tracer.DEATH_TIME = 2.6;
Tracer.INVINCIBILITY_TIME = 1.7;

Tracer.HITBOX_GAP = .1;

function Tracer(tracer_id) {
	this.constructor(
		new Rectangle(
			Tracer.HITBOX_GAP,
			Tracer.HITBOX_GAP,
			Tracer.WIDTH - Tracer.HITBOX_GAP * 2,
			Tracer.HEIGHT - Tracer.HITBOX_GAP * 2 
		),
		 'tracer'
	);
	
	this.camera_target = true;
	this.tracer_id = tracer_id;
	this.cutscene = true;
	this.deployed = false;
}

Tracer.prototype.init = function() {
	Tracer.parent.init.call(this);
	this.reset();
};

Tracer.prototype.reset = function() {
	this.alive = true; // this is necessary so that the camera follows it.
	this.x = (game.game_state.current_level.getWidth() - Tracer.WIDTH) / 2;
	
	if (this.cutscene) {
		this.y = game.game_state.getCamera(this).y - Tracer.HEIGHT;
	}
	else {
		this.y = game.game_state.current_level.getHeight() + TraceriderLevel.PLAYER_START_SPACE;
		this.getNode();
	}
};

Tracer.prototype.getNode = function() {
	this.stopAll();
	this.node = game.game_state.current_level.getNode(this.y, this.tracer_id);
	
	if (this.node == null) return;

	// figure out if the tracer needs to go left or right.
	var direction = 0;
	if (this.node.x < this.x)
		direction = -1;
	else if (this.node.x > this.x) 
		direction = 1;
		
	// If this is a SPIN node, move smoothly to the node.  Otherwise, go there as fast as possible.
	var velocity;
	
	if (this.node.isSpin()) {
		// velocity = pixels per second.  Pixels is the difference between node.x and this.x, seconds is (pixels / pixels per second)
		var time = (this.y - this.node.y) / game.game_state.current_level.getVelocity();
		velocity = Math.abs(this.node.x - this.x) / time;  // use absolute value because I'm multiplying by direction later on.
	}
	else {
		velocity = Tracer.VELOCITY;
	}
	
	this.x_velocity = direction * velocity;
};

Tracer.prototype.think = function() {
	if (this.cutscene) {
		if (this.y >= (game.game_state.current_level.getHeight() + 0 + TraceriderLevel.PLAYER_START_SPACE)) {
			this.y = (game.game_state.current_level.getHeight() + 0 + TraceriderLevel.PLAYER_START_SPACE);
			this.y_velocity = 0;
		}
	}
	else {
		if (!this.node) return;
	
		if (this.y < this.node.y)
			this.getNode();
			
		if (!this.node) return;
			
		// If you've passed the node horizontally, stop and reset your position.
		if ((this.x >= this.node.x && this.x_velocity > 0) ||
		    (this.x <= this.node.x && this.x_velocity < 0)) {
		    	
			this.x = this.node.x;
			this.x_velocity = 0;
			
		}	
	}
};

Tracer.prototype.premove = function(delta) {
	if (this.cutscene) return;
	this.y -= game.game_state.current_level.getVelocity() * delta;
};

Tracer.prototype.predisplay = function(context) {
	this.updateAnimation();
};

Tracer.prototype.updateAnimation = function() {
	var animation_name;
	
	if (this.cutscene) {
		if (this.y < (game.game_state.current_level.getHeight() + 0 + TraceriderLevel.PLAYER_START_SPACE))
			animation_name = 'introspin';
		else if (!this.deployed)
			animation_name = 'introdeploy';	
		else
			animation_name = 'normal';
	}
	else {
		if (this.x_velocity < 0) {
			if (this.node && this.node.isSpin()) {
				animation_name = 'spinleft';
			}
			else {
				animation_name = 'moveleft';
			}
		}
		else if (this.x_velocity > 0) {
			if (this.node && this.node.isSpin()) {
				animation_name = 'spinright';
			}
			else {
				animation_name = 'moveright';
			}
		}
		else {
			animation_name = 'normal';
		}
	}
	
	if (this.sprite.current_animation.name != animation_name)
		this.sprite.playAnimation(animation_name);
};

Tracer.prototype.onAnimationDone = function(animation_name) {
	if (animation_name == 'introdeploy')
		this.deployed = true;
};

Tracer.prototype.setCamera = function(camera_number) { this.camera = camera_number; };
Tracer.prototype.getCamera = function() { return this.camera; };

Tracer.prototype.cutsceneEnd = function() {
	this.cutscene = false;
	this.getNode();
};

Tracer.prototype.introCutsceneActivate = function() {
	this.y_velocity = IntroPhase.TRACER_VELOCITY;
};

Tracer.prototype.isCutsceneDone = function() { return this.deployed; };

Tracer.prototype.introTurnOnEffect = function() {
	game.sound_map.getSound('blip').play();
};
