function Level(object_initializer, geometry_initializer, background_image_name) {
	this.object_initializer = object_initializer;
	this.geometry_initializer = geometry_initializer;
	this.background_image_name = background_image_name;
}

Level.prototype.renderBackground = function(context, x, y) {
	if (!x) x = 0;
	if (!y) y = 0;
	
	var window = game.getWindow();
	
	this.background_image.display(window.x + x, window.y + y, window.width, window.height, context);
};

Level.prototype.renderGeometry = function(context, x, y) {
	if (!x) x = 0;
	if (!y) y = 0;
	
	var window = game.getWindow();
	
	this.geometry.display(window.x + x, window.y + y, context);
};

Level.prototype.init = function() {
	this.initBackground();
	this.initObjects(this.object_initializer);	
	this.initGeometry(this.geometry_initializer);	
};

Level.prototype.initBackground = function() {
	this.background_image = game.background_image_map.getBackgroundImage(this.background_image_name);
};

Level.prototype.initObjects = function() {	
	throw ('initObjects not defined!');
};

Level.prototype.initGeometry = function() {
	throw ('initGeometry not defined!');
};

Level.prototype.geometryCheck = function(actor) {
	this.geometry.collisionCheck(actor);
};