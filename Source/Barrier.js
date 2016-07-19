Barrier.prototype = Object.create(Actor.prototype);
Barrier.parent = Actor.prototype;

Barrier.WIDTH  = 30;
Barrier.HEIGHT = 30;
Barrier.FRAMES = 6;

Barrier.HITBOX_GAP = .1;

function Barrier(x, y, animation_number) {
	this.constructor(
		new Rectangle(
			Barrier.HITBOX_GAP,
			Barrier.HITBOX_GAP,
			Barrier.WIDTH  - Barrier.HITBOX_GAP * 2,
			Barrier.HEIGHT - Barrier.HITBOX_GAP * 2 
		),
		 'barrier'
	);
	
	this.camera_target = false;
	this.camera_number = -1;
	this.start_x = x;
	this.start_y = y;
	this.animation_number = animation_number;
}

Barrier.prototype.init = function() {
	Barrier.parent.init.call(this);
	this.reset();
};

Barrier.prototype.reset = function() {
	this.x = this.start_x;
	this.y = this.start_y;
	this.sprite.current_frame = this.animation_number;
};

Barrier.prototype.setCamera = function(camera_number) { this.camera_number = camera_number; };
Barrier.prototype.getCamera = function() { return this.camera_number; };

