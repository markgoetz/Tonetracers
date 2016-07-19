function Rectangle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

Rectangle.prototype.right_x = function() { return this.x + this.width; };
Rectangle.prototype.bottom_y = function() { return this.y + this.height; };
Rectangle.prototype.center_x = function() { return this.x + this.width / 2; };
Rectangle.prototype.center_y = function() { return this.y + this.height / 2; };

Rectangle.prototype.contains = function(x,y) {
	if (x > this.x && x < this.right_x() && y > this.y && y < this.bottom_y())
		return true;
	return false;
};

Rectangle.prototype.collidesWith = function(other_rect) {	
	if (this.bottom_y() < other_rect.y) return false;
	if (this.y > other_rect.bottom_y()) return false;
	if (this.right_x() < other_rect.x)  return false;
	if (this.x > other_rect.right_x())  return false;
	
	return true;
	
	
	if (this.contains(other_rect.x, other_rect.y) ||
		this.contains(other_rect.x, other_rect.bottom_y()) ||
		this.contains(other_rect.right_x(), other_rect.y) ||
		this.contains(other_rect.right_x(), other_rect.bottom_y())) {
		
		return true;
	}
	
	else if (other_rect.contains(this.x, this.y) ||
			 other_rect.contains(this.x, this.bottom_y()) ||
			 other_rect.contains(this.right_x(), this.y) ||
			 other_rect.contains(this.right_x(), this.bottom_y())) {
		return true;
	}
	
	else if (this.x < other_rect.x &&
	         this.right_x() > other_rect.right_x() &&
	         this.y > other_rect.y &&
	         this.bottom_y() < other_rect.bottom_y())
		return true;
	        
	else if (this.x > other_rect.x &&
	         this.right_x() < other_rect.right_x() &&
	         this.y < other_rect.y &&
	         this.bottom_y() > other_rect.bottom_y())
		return true;
	
	return false;
};

Rectangle.prototype.getSideOf = function(other_rect) {
	var side = new CollisionSides();
	
	if (other_rect.right_x() < this.x)
		side.setSide(CollisionSides.sides.LEFT);
	if (other_rect.x > this.right_x()) 
		side.setSide(CollisionSides.sides.RIGHT);
	if (other_rect.bottom_y() < this.y)
		side.setSide(CollisionSides.sides.TOP);
	if (other_rect.y > this.bottom_y())
		side.setSide(CollisionSides.sides.BOTTOM);
	
	return side;
};