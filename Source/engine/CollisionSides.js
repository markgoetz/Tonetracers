CollisionSides.sides = {
	TOP: -2,
	LEFT: -1,
	RIGHT: 1,
	BOTTOM: 2
};

function CollisionSides() {
	this.collisions = {
		1: false,
		"-1": false,
		2: false,
		"-2": false
	};
}

CollisionSides.prototype.setSide = function(direction) {
	this.collisions[direction] = true;
};

CollisionSides.prototype.getSide = function(direction) {
	return this.collisions[direction];	
};

CollisionSides.prototype.removeSide = function(direction) {
	this.collisions[direction] = false;
};

CollisionSides.prototype.isEmpty = function() {
	for (var i in this.collisions) {
		if (this.collisions[i] == true)
			return false;
	}
	return true;
};

CollisionSides.prototype.getSides = function() {
	var sides = [];
	for (var i in this.collisions) {
		if (this.collisions[i] == true)
			sides.push(i);
	}
	return sides;
};
