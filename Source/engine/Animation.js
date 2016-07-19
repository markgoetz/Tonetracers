function Animation(name, frames, continuous) {
	this.name = name;
	this.frames = frames;
	this.max_frames = frames.length;
	this.continuous = continuous;
}

Animation.prototype.getFrame = function(frame) {
	return this.frames[frame];
};
