function BackgroundImage(file_name) {
	this.file_name = 'backgrounds/' + file_name;
	this.image = new Image();
	
	this.image.onload = function(event) {
		this.loaded = true;
	};
	
	this.image.src = this.file_name;
	this.x_parallax = 0;
	this.y_parallax = 0;
}

BackgroundImage.prototype.setParallax = function(x, y) {
	if (y == null) y = x;
	
	this.x_parallax = x;
	this.y_parallax = y;
};

BackgroundImage.prototype.display = function(x, y, width, height, context) {
	var image_width  = this.image.width;
	var image_height = this.image.height;
	
	var camera_rect = new Rectangle(this.x_parallax * game.game_engine.camera_x, this.y_parallax * game.game_engine.camera_y, width, height);
	
	var start_x = Math.floor(camera_rect.x / image_width)  * image_width;
	var start_y = Math.floor(camera_rect.y / image_height) * image_height;
	var end_x   = Math.ceil(camera_rect.right_x()  / image_width)  * image_width;
	var end_y   = Math.ceil(camera_rect.bottom_y() / image_height) * image_height;
	
	for (var slice_x = start_x; slice_x < end_x; slice_x += image_width) {
		var slice_width = Math.min(image_width, camera_rect.right_x() - slice_x);
			
		for (var slice_y = start_y; slice_y < end_y; slice_y += image_height) {
			var slice_height = Math.min(image_height, camera_rect.bottom_y() - slice_y);
				
			context.drawImage(this.image,
				0, 0, slice_width, slice_height,
				x + slice_x - camera_rect.x, y + slice_y - camera_rect.y, slice_width, slice_height
			);
		}
	}
};

BackgroundImage.prototype.isLoaded = function() {
	return this.image.loaded;
};





function BackgroundImageMap() {
	this.backgrounds = {};
}

BackgroundImageMap.prototype.addBackgroundImage = function(name, background_image) {
	if (this.backgrounds[name])
		throw 'Duplicate background name:' + name;
	
	if (!background_image instanceof BackgroundImage)
		throw 'background_image is not a background image';
	
	game.game_engine.preloader.registerItem(background_image);
	this.backgrounds[name] = background_image;
};

BackgroundImageMap.prototype.getBackgroundImage = function(name) {
	return this.backgrounds[name];
};

BackgroundImageMap.prototype.getCount = function() {
	return Object.keys(this.backgrounds).length;
};