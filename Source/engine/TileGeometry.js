function TileGeometry(tile_size, string, tile_set_name) {
	this.tile_size = tile_size;
	this.tiles_wide = 0;
	this.tiles_high = 0;
	this._processString(string);
	this.tile_set = game.tile_map.getTileSet(tile_set_name);
}

TileGeometry.SHAPES = {
	SQUARE: 0,
	DIAGONAL_TL: 1,
	DIAGONAL_TR: 2,
	DIAGONAL_BL: 3,
	DIAGONAL_BR: 4
};

TileGeometry.prototype._processString = function (string) {
	var rows = string.split(/\r/);
	this._geometry = [];
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i].split(',');
		
		if (row.length > this.tiles_wide) this.tiles_wide = row.length;
		
		this._geometry.push(row);
	}
	
	this.tiles_high = this._geometry.length;
};

TileGeometry.prototype.checkPixel = function(x, y) {
	if (x < 0 || y < 0)
		return null;
	
	var tile_y = Math.floor(y / this.tile_size);
	if (tile_y >= this._geometry.length)
		return null;
	
	var tile_x = Math.floor(x / this.tile_size);
	if (tile_x >= this._geometry[tile_y].length)
		return null;
	
	var tile = this.getTileAt(tile_x, tile_y);
	
	if (tile == null) return null;
	
	if (tile.shape == TileGeometry.SHAPES.SQUARE) return tile;
	
	if (tile.shape == TileGeometry.SHAPES.DIAGONAL_TL || 
		tile.shape == TileGeometry.SHAPES.DIAGONAL_TR || 
		tile.shape == TileGeometry.SHAPES.DIAGONAL_BL || 
		tile.shape == TileGeometry.SHAPES.DIAGONAL_BR)
		return this.checkDiagonalTile(tile, x, y);
};
	
TileGeometry.prototype.checkDiagonalTile = function(tile, x, y) {
	// calculate the "anchor point" for the tile based on its shape.
	// if the Manhattan distance between the pixel and the anchor point is less than the tile size, there's a collision. 
	var tile_anchor_x, tile_anchor_y;
	
	var tile_y = Math.floor(y / this.tile_size);
	var tile_x = Math.floor(x / this.tile_size);
	
	if (tile.shape == TileGeometry.SHAPES.DIAGONAL_BL || tile.shape == TileGeometry.SHAPES.DIAGONAL_TL) {
		tile_anchor_x = tile_x * this.tile_size;
	}
	else {
		tile_anchor_x = (tile_x + 1) * this.tile_size;
	}
	
	if (tile.shape == TileGeometry.SHAPES.DIAGONAL_TL || tile.shape == TileGeometry.SHAPES.DIAGONAL_TR) {
		tile_anchor_y = tile_y * this.tile_size;
	}
	else {
		tile_anchor_y = (tile_y + 1) * this.tile_size;
	}
	
	if (Math.abs(x - tile_anchor_x) + Math.abs(y - tile_anchor_y) < this.tile_size)
		return tile;
		
	return null;
};

TileGeometry.prototype.collisionCheck = function(actor) {
	var hitbox = actor.getHitbox();
	var prev_hitbox = actor.getPreviousHitbox();
	var context = game.game_engine.getGraphicsContext();
	
	var collided_tiles = [];
	
	for (var loop_x = hitbox.x; loop_x <= hitbox.right_x() + this.tile_size; loop_x += 5) { // this.tile_size) {
		for (var loop_y = hitbox.y; loop_y <= hitbox.bottom_y() + this.tile_size; loop_y += 5) { //this.tile_size) {
			var check_x = loop_x;
			var check_y = loop_y;
			
			if (check_x > hitbox.right_x())  check_x = hitbox.right_x();
			if (check_y > hitbox.bottom_y()) check_y = hitbox.bottom_y();
						
			if (tile = this.checkPixel(check_x, check_y)) {
				var tile_found = false;
				
				// make sure this tile isn't already in the collision array
				for (var i = 0; i < collided_tiles.length; i++) {
					if (collided_tiles[i].x == tile.x && collided_tiles[i].y == tile.y)
						tile_found = true;
				}
				
				if (!tile_found)
					collided_tiles.push(tile);
			}
		}
	}
	
	for (var i = 0; i < collided_tiles.length; i++) {
		var tile = collided_tiles[i];
		var sides = prev_hitbox.getSideOf(tile.getHitbox());
		
		if (sides.getSide(CollisionSides.sides.TOP) && this.checkPixel(tile.x, tile.y + this.tile_size))
			sides.removeSide(CollisionSides.sides.TOP);
		if (sides.getSide(CollisionSides.sides.BOTTOM) && this.checkPixel(tile.x, tile.y - this.tile_size))
			sides.removeSide(CollisionSides.sides.BOTTOM);
		if (sides.getSide(CollisionSides.sides.LEFT) && this.checkPixel(tile.x + this.tile_size, tile.y))
			sides.removeSide(CollisionSides.sides.LEFT);
		if (sides.getSide(CollisionSides.sides.RIGHT) && this.checkPixel(tile.x - this.tile_size, tile.y))
			sides.removeSide(CollisionSides.sides.RIGHT);								
		
		actor.oncollide(tile, sides);
	}
};

TileGeometry.prototype.getTileAt = function(tile_x, tile_y) {
	if (tile_y < 0 || tile_x < 0) return null;
	if (tile_y >= this._geometry.length) return null;
	if (tile_x >= this._geometry[tile_y].length) return null;
	
	var tile_id = this._geometry[tile_y][tile_x];
	
	if (tile_id == ' ' || tile_id == '') return null;
	
	return new LevelTile(tile_x * this.tile_size, tile_y * this.tile_size, this.tile_size, tile_id, this.tile_set);
};

TileGeometry.prototype.display = function(x, y, context) {	
	for (var i = 0; i < this._geometry.length; i++) {
		var row = this._geometry[i];
		for (var j = 0; j < row.length; j++) {
			var tile_id = row[j];
			
			if (tile_id != ' ' && tile_id != '')
				this.tile_set.display(x + j * this.tile_size, y + i * this.tile_size, tile_id, context);
		}
	}
};

TileGeometry.prototype.getTileSize = function() {
	return this.tile_size;
};

LevelTile.prototype = Object.create(Actor.prototype);
LevelTile.parent = Actor.prototype;
function LevelTile(x, y, tile_size, id, tile_set) {
	this.constructor(new Rectangle(0, 0, tile_size, tile_size), null);
	this.init(x, y, 'null');
	this.id = id;
	var tile_type = tile_set.getTileType(id);
	
	if (tile_type != null) {
		this.attributes = tile_type.attributes;
		this.shape = tile_type.shape;
	}
}

LevelTile.prototype.init = function(x, y) {
	this.x = x;
	this.y = y;
};
