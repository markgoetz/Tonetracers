function Frame(rect, duration, hitbox, callback) {
	this.rect = rect;
	this.duration = duration;
	this.hitbox = hitbox;
	this.callback = callback;
}

Frame.prototype.getHitbox = function() {
	return this.hitbox;
};
