function SpriteSheet(file_name, tile_width, tile_height) {
	this.file_name = 'sprites/' + file_name;
	this.tile_width = tile_width;
	this.tile_height = tile_height;
	this.animations = [];

	this.image = new Image();
	
	this.image.onload = function(event) {
		this.loaded = true;
	};
	
	this.image.src = this.file_name;
}

SpriteSheet.prototype.addAnimation = function(name, frame_inits, time_per_frame, continuous) {
	if (typeof continuous === 'undefined')
		continuous = true;
	
	var frames = [];
	
	for (var i = 0; i < frame_inits.length; i++) {
		var frame_init = frame_inits[i];
		
		var x = frame_init.x * this.tile_width;
		var y = frame_init.y * this.tile_height;
		
		if (frame_init.px) x = frame_init.px;
		if (frame_init.py) y = frame_init.py;
		
		var width  = (frame_init.w) ? frame_init.w : this.tile_width;
		var height = (frame_init.h) ? frame_init.h : this.tile_height;
		
		var time = (frame_init.t) ? frame_init.t : time_per_frame;
		
		var callback = frame_init.c; 
		
		var hitbox;
		if (frame_init.hitbox) {
			hitbox = new Rectangle(frame_init.hitbox[0],frame_init.hitbox[1],frame_init.hitbox[2],frame_init.hitbox[3]);	
		}
		
		frames.push(new Frame(new Rectangle(x, y, width, height), time, hitbox, callback));
	}
	
	this.animations.push(new Animation(name, frames, continuous));
};

SpriteSheet.prototype.isLoaded = function() {
	return this.image.loaded;
};

function SpriteSheetMap() {
	this.sprite_sheets = {};
}

SpriteSheetMap.prototype.addSpriteSheet = function(name, sprite_sheet) {
	if (this.sprite_sheets[name])
		throw 'Duplicate spritesheet name:' + name;
	
	if (!sprite_sheet instanceof SpriteSheet)
		throw 'sprite_sheet is not a sprite sheet';
	
	this.sprite_sheets[name] = sprite_sheet;
	game.game_engine.preloader.registerItem(sprite_sheet);
};

SpriteSheetMap.prototype.getSpriteSheet = function(name) {
	return this.sprite_sheets[name];
};

SpriteSheetMap.prototype.getSpriteNames = function() {
	return Object.keys(this.sprite_sheets);
};

SpriteSheetMap.prototype.getCount = function() {
	return Object.keys(this.sprite_sheets).length;
};