function Sprite(sprite_name) {
	this.width_scaling = 1;
	this.height_scaling = 1;
	this.sprite_name = sprite_name;
	this.callback = null;
}

Sprite.prototype.init = function(starting_animation) {
	this.sprite_sheet = game.sprite_sheet_map.getSpriteSheet(this.sprite_name);
	
	if (starting_animation) {
		for (var i = 0; i < this.sprite_sheet.animations.length; i++) {
			if (this.sprite_sheet.animations[i].name == starting_animation) {
				this.current_animation = this.sprite_sheet.animations[i];
			}
		}
	}
	else {
		this.current_animation = this.sprite_sheet.animations[0];
	}
	
	this.resetAnimation();
};

Sprite.prototype.getAnimations = function() {
	return this.sprite_sheet.animations;
};

Sprite.prototype.playAnimation = function(animation_name) {
	for (var i = 0; i < this.sprite_sheet.animations.length; i++) {
		if (this.sprite_sheet.animations[i].name == animation_name) {
			this.current_animation = this.sprite_sheet.animations[i];
			this.resetAnimation();
			return;
		}
	}
	
	throw 'The animation name ' + animation_name + ' for spritesheet ' + this.sprite_sheet.file_name + ' was not found.';
};

Sprite.prototype.resetAnimation = function() {
	this.current_frame = 0;
	this.frame_delta = 0;
	this.animation_done = false;
};

Sprite.prototype.scale = function(width_scale, height_scale) {
	if (!height_scale)
		height_scale = width_scale;
	
	this.width_scaling = width_scale;
	this.height_scaling = height_scale;
};

Sprite.prototype.display = function(x, y, context) {
	var frame = this.getCurrentFrame();
	if (!frame) return; // this is mainly useful to prevent race conditions in the debug mode, since animation and logic are disconnected.
	
	var frame_x = frame.rect.x;
	var frame_y = frame.rect.y;
	var frame_height = frame.rect.height;
	var frame_width  = frame.rect.width;
	
	var camera_x = game.game_engine.camera_x;
	var camera_y = game.game_engine.camera_y;
	
	context.drawImage(this.sprite_sheet.image,
		frame_x, frame_y, frame_width, frame_height,
		Math.round(x - camera_x), Math.round(y - camera_y), frame_width * this.width_scaling, frame_height * this.height_scaling
	);
};

Sprite.prototype.advanceAnimation = function(delta) {
	if (this.animation_done)
		return;
	
	this.frame_delta += delta;
	var interval = this.getCurrentFrame().duration;
	
	this.callback = null;
	while (this.frame_delta > interval) {
		
		this.current_frame++;
		if (this.current_frame >= this.current_animation.max_frames) {
			
			if (this.current_animation.continuous)
				this.current_frame -= this.current_animation.max_frames;
			else {
				this.current_frame = this.current_animation.max_frames - 1;
				this.animation_done = true;
			}
		}
		
		this.frame_delta -= interval;
		interval = this.getCurrentFrame().duration;
		this.callback = this.getCurrentFrame().callback;
	}
};

Sprite.prototype.getCurrentFrame = function() {
	// hack for level tiles, which don't technically have animations
	if (this.current_animation == null) 
		return new Frame();
	
	return this.current_animation.getFrame(this.current_frame);
};