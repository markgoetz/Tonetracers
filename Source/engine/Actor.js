function Actor(hitbox, sprite_name) {
	this.x = this.prev_x = 0;
	this.y = this.prev_y = 0;
	
	this.hitbox = hitbox;
	this.sprite = new Sprite(sprite_name); 
	this.x_velocity = 0;
	this.y_velocity = 0;
	
	this.prev_frame = null;
	
	this.timer = null;
	this.timer_callback = null;
};

Actor.prototype.init = function(x, y, animation_name) {
	this.x = this.prev_x = x;
	this.y = this.prev_y = y;
	this.sprite.init(animation_name);
	this.prev_frame = this.sprite.getCurrentFrame();
};

Actor.prototype.reset = function() {};

Actor.prototype.step = function(delta) {
	this.prethink(delta);
	
	this.prev_x = this.x;
	this.prev_y = this.y;
	this.prev_frame = this.sprite.getCurrentFrame();
	
	this.preaccelerate(delta);
	
	if (this.x_acceleration) {
		this.x_velocity += (this.x_acceleration * delta);
	}
	
	if (this.y_acceleration) {
		this.y_velocity += (this.y_acceleration * delta);
	}
	
	this.premove(delta);
	
	this.x += (this.x_velocity * delta);
	this.y += (this.y_velocity * delta);
	this.sprite.advanceAnimation(delta);
	
	if (this.sprite.animation_done)
		this.onAnimationDone(this.sprite.current_animation.name);
		
	if (this.sprite.callback) {
		this[this.sprite.callback].call(this);
	}
	
	if (this.timer > 0) {
		this.timer -= delta;
		
		if (this.timer <= 0) {
			this.timer_callback.call(this);
		}
	}
	
	this.think(delta);
};

Actor.prototype.setTimer = function(time, callback) {
	this.timer = time;
	
	if (!this[callback])
		throw 'No method found: ' + callback;
	
	this.timer_callback = this[callback];
};

Actor.prototype.clearTimer = function() {
	this.timer = 0;
	this.timer_callback = null;
};

Actor.prototype.think = function(delta) {};
Actor.prototype.prethink = function(delta) {};

Actor.prototype._getInternalHitbox = function() {
	var frame_hitbox = this.sprite.getCurrentFrame().getHitbox();
	return (frame_hitbox == null) ? this.hitbox : frame_hitbox;	
};

Actor.prototype.getHitbox = function() {
	var hitbox = this._getInternalHitbox();
	return new Rectangle(this.x + hitbox.x, this.y + hitbox.y, hitbox.width, hitbox.height);
};

Actor.prototype.getPreviousHitbox = function() {
	var frame_hitbox = this.prev_frame.getHitbox();
	var hitbox = (frame_hitbox == null) ? this.hitbox : frame_hitbox;
	
	return new Rectangle(this.prev_x + hitbox.x, this.prev_y + hitbox.y, hitbox.width, hitbox.height);
};

Actor.prototype.collisionTest = function(other_actor) {
	if (this.getHitbox().collidesWith(other_actor.getHitbox())) {
		var this_side  = this.getPreviousHitbox().getSideOf(other_actor.getPreviousHitbox());
		var other_side = other_actor.getPreviousHitbox().getSideOf(this.getPreviousHitbox());
		
		this.oncollide(other_actor, this_side);
		other_actor.oncollide(this, other_side);
	}
};

Actor.prototype.stopAll = function() {
	this.x_velocity = 0;
	this.y_velocity = 0;
	this.x_acceleration = 0;
	this.y_acceleration = 0;
};

Actor.prototype.stopHorizontal = function() {
	this.x_velocity = 0;
	this.x_acceleration = 0;
};

Actor.prototype.stopVertical = function() {
	this.y_velocity = 0;
	this.y_acceleration = 0;
};

Actor.prototype.setVelocityByAngle = function(velocity, angle) {
	this.x_velocity = Math.cos(angle) * velocity;
	this.y_velocity = Math.sin(angle) * velocity;
};

Actor.prototype.setVelocityByVector = function(velocity, vector_x, vector_y) {
	var vector_magnitude =  Math.sqrt(vector_x * vector_x + vector_y * vector_y);
			
	this.x_velocity = velocity * vector_x / vector_magnitude;
	this.y_velocity = velocity * vector_y / vector_magnitude;
};


Actor.prototype.oncollide = function(other_actor, side) {
	// event triggered whenever this actor collides with another actor that we care about.
	// inherit this function in subclasses.
};

Actor.prototype.collideStop = function(other_actor, side, gap) {
	if (side.getSide(CollisionSides.sides.LEFT)) {
		if (this.x_velocity < 0) this.stopHorizontal();
		this.x = other_actor.getHitbox().right_x() - this._getInternalHitbox().x + gap;
	}
	else if (side.getSide(CollisionSides.sides.RIGHT)) {
		if (this.x_velocity > 0) this.stopHorizontal();
		this.x = other_actor.getHitbox().x - this._getInternalHitbox().right_x() - gap;
	}
	
	if (side.getSide(CollisionSides.sides.TOP)) {
		if (this.y_velocity < 0) this.stopVertical();
		this.y = other_actor.getHitbox().bottom_y() - this._getInternalHitbox().y + gap;
	}
	else if (side.getSide(CollisionSides.sides.BOTTOM)) {
		if (this.y_velocity > 0) this.stopVertical();
		this.y = other_actor.getHitbox().y - this._getInternalHitbox().bottom_y() - gap;
	}
};

Actor.prototype.collideBounce = function(other_actor, side, elasticity) {
	if (!elasticity) elasticity = 1;
	
	var other_hitbox = other_actor.getHitbox();
	
	if (side.getSide(CollisionSides.sides.TOP)) {
		this.y = other_hitbox.bottom_y() - this.hitbox.y + .01;
		if (this.y_velocity < 0) this.y_velocity = -this.y_velocity * elasticity;
	}
	else if (side.getSide(CollisionSides.sides.BOTTOM)) {
		this.y = other_hitbox.y - this.hitbox.bottom_y() - .01;
		if (this.y_velocity > 0) this.y_velocity = -this.y_velocity * elasticity;
	}
	
	if (side.getSide(CollisionSides.sides.LEFT)) {
		this.x = other_hitbox.right_x() - this.hitbox.x + .01;
		if (this.x_velocity < 0) this.x_velocity = -this.x_velocity * elasticity;
	}
	else if (side.getSide(CollisionSides.sides.RIGHT)) {
		this.x = other_hitbox.x - this.hitbox.right_x() - .01;
		if (this.x_velocity > 0) this.x_velocity = -this.x_velocity * elasticity;
	}
};

// utility function for if a collision happens on two sides on the same frame, and you want to know which side happened first.
// Returns a number between 0 and 1, where 0 is the previous frame and 1 is this frame.
// THIS DOES NOT ACCOUNT FOR CHANGING HITBOX SIZES.
Actor.prototype.getCollisionSubframeTime = function(other_actor, is_vertical) {
	var current_coordinate, previous_coordinate;
	var other_current_coordinate, other_previous_coordinate;
	if (is_vertical) {
		current_coordinate  = this.getHitbox().y;
		previous_coordinate = this.getPreviousHitbox().y;
		other_current_coordinate  = other_actor.getHitbox().y;
		other_previous_coordinate = other_actor.getHitbox().y;
	}
	else {
		current_coordinate  = this.getHitbox().x;
		previous_coordinate = this.getPreviousHitbox().x;
		other_current_coordinate  = other_actor.getHitbox().x;
		other_previous_coordinate = other_actor.getHitbox().x;
	}
	
	// solve for t, where previous + t * (current - previous) equals each other
	// Caution: ALGEBRA!
	if (current_coordinate - previous_coordinate == other_current_coordinate - other_previous_coordinate)
		return NaN;
		
	return (other_previous_coordinate - previous_coordinate) / (current_coordinate - previous_coordinate + other_previous_coordinate - other_current_coordinate); 
};

Actor.prototype.getX = function() { return this.x; };
Actor.prototype.getY = function() { return this.y; };

Actor.prototype.display = function(context) {
	this.predisplay(context);
	this.sprite.display(this.getX(), this.getY(), context);
	this.postdisplay(context);
};

Actor.prototype.predisplay = function(context) {};
Actor.prototype.postdisplay = function(context) {};

Actor.prototype.preaccelerate = function() {};
Actor.prototype.premove = function() {};

Actor.prototype.onAnimationDone = function(name) {};
