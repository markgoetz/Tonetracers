BonusGate.prototype = Object.create(Actor.prototype);
BonusGate.parent = Actor.prototype;

BonusGate.WIDTH  = 30;
BonusGate.HEIGHT = 30;

BonusGate.HITBOX_GAP = .1;

function BonusGate(x, y) {
	this.constructor(
		new Rectangle(
			BonusGate.HITBOX_GAP,
			BonusGate.HITBOX_GAP,
			BonusGate.WIDTH  - BonusGate.HITBOX_GAP * 2,
			BonusGate.HEIGHT - BonusGate.HITBOX_GAP * 2 
		),
		 'bonusgate'
	);
	
	this.camera_target = false;
	this.setCamera(1);
	this.start_x = x;
	this.start_y = y;
}

BonusGate.prototype.init = function() {
	BonusGate.parent.init.call(this);
	this.reset();
};

BonusGate.prototype.reset = function() {
	this.x = this.start_x;
	this.y = this.start_y;
};

BonusGate.prototype.setCamera = function(camera_number) { this.camera_number = camera_number; };
BonusGate.prototype.getCamera = function() { return this.camera_number; };
