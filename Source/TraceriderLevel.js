TraceriderLevel.prototype = Object.create(Level.prototype);
TraceriderLevel.parent = Level.prototype;

TraceriderLevel.TILE_SIZE = 30;
TraceriderLevel.PLAYER_START_SPACE = 600;
TraceriderLevel.PARALLAX = .5;

function TraceriderLevel(folder_name) {
	this.constructor();
	this.folder_name = folder_name;
	this.load();
}

TraceriderLevel.prototype.initObjects = function() {
	this.palette = this.object_initializer.palette;
	this.background_image_name = this.object_initializer.palette;
	this.initBackground();
	this.background_image.setParallax(0, TraceriderLevel.PARALLAX);
	
	this.width = this.object_initializer.width;
	
	game.game_state.setCameraVelocity(this.object_initializer.velocity);	
};

TraceriderLevel.prototype.initGeometry = function() {
	this.geometry = new TileGeometry(TraceriderLevel.TILE_SIZE, this.geometry_initializer, this.palette);
	this.initNodes();
};

TraceriderLevel.prototype.initNodes = function() {
	this.nodes = [];
	var barrier_count = 0;
	
	for (var j = 0; j < this.geometry.tiles_high; j++) {
		for (var i = 0; i < this.geometry.tiles_wide; i++) {
			
			var tile = this.geometry.getTileAt(i, j);
			if (tile == null) continue;
			
			if (tile.attributes['node1'] || tile.attributes['node2']) {
				this.nodes.push(new LevelNode(i * TraceriderLevel.TILE_SIZE, j * TraceriderLevel.TILE_SIZE, tile.attributes));
			}
			
			if (tile.attributes['barrier']) {
				game.game_state.addBarrier(i * TraceriderLevel.TILE_SIZE, j * TraceriderLevel.TILE_SIZE, barrier_count);
				barrier_count++;
				if (barrier_count == Barrier.FRAMES)
					barrier_count = 0;
			}
			else {
				barrier_count = 0;
			}
			
			if (tile.attributes['bonusgate']) {
				game.game_state.addBonusGate(i * TraceriderLevel.TILE_SIZE, j * TraceriderLevel.TILE_SIZE);
			}
		}
	}
};

// Retrieve the next waypoint for a Tracer. 
// Return the node with the highest y that is lower than this y.
TraceriderLevel.prototype.getNode = function(y, id) {
	var current_node = null;
	
	for (var i = 0; i < this.nodes.length; i++) {
		var node = this.nodes[i];
		
		if (node.y > y)
			continue;
			
		if (current_node != null && node.y < current_node.y)
			continue;
		
		if (id == 0 && node.attributes['node1'])
			current_node = node;
		if (id == 1 && node.attributes['node2'])
			current_node = node;
	}
	
	return current_node;
};

TraceriderLevel.prototype.load = function() {
	var geometry_xhr = new XMLHttpRequest();
	geometry_xhr.open("GET", "levels/" + this.folder_name + "/geometry.csv", true);
	geometry_xhr.level = this;
	geometry_xhr.responseType = 'text';
	geometry_xhr.onload = function() {
		this.level.geometry_initializer = this.responseText;
	};
	geometry_xhr.send();

	var objects_xhr = new XMLHttpRequest();
	objects_xhr.open("GET", "levels/" + this.folder_name + "/objects.txt", true);
	objects_xhr.level = this;
	objects_xhr.responseType = 'text';
	objects_xhr.onload = function() {
		this.level.object_initializer = eval('(' + this.response + ')');
	};
	objects_xhr.send();
};

TraceriderLevel.prototype.isLoaded = function() {
	return (this.object_initializer && this.geometry_initializer);
};

TraceriderLevel.prototype.getHeight = function() {
	return TraceriderLevel.TILE_SIZE * this.geometry.tiles_high;
};

TraceriderLevel.prototype.getWidth = function() {
	return TraceriderLevel.TILE_SIZE * this.geometry.tiles_wide;
};

TraceriderLevel.prototype.getVelocity = function() {
	if (this.object_initializer.velocity) return this.object_initializer.velocity;
	return 0;
};

TraceriderLevel.prototype.isJail = function() {
	if (this.object_initializer.is_jail) return this.object_initializer.is_jail;
	return false;
};

TraceriderLevel.prototype.getDebuggerCount = function() {
	if (this.object_initializer.debuggers) return this.object_initializer.debuggers;
	return 0;
};

TraceriderLevel.prototype.getMessage = function() {
	if (!this.object_initializer.message) return false;
	return this.object_initializer.message;
};

TraceriderLevel.prototype.getSongName = function() {
	if (!this.object_initializer.song) return false;
	return this.object_initializer.song;
};
