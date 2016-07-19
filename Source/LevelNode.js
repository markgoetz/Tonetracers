function LevelNode(x, y, attributes) {
	this.x = x;
	this.y = y;
	this.attributes = attributes;
}

LevelNode.prototype.isSpin = function() {
	return this.attributes['spin'];
};
