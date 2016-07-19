function UIElementContainer(rect) {
	this.rect = rect;
	this.elements = [];
}

UIElementContainer.prototype.addUIElement = function(ui_element, x, y) {
	if (!ui_element instanceof UIElement)
		throw 'Did not pass in a UIElement';
	
	ui_element.setPosition(this.rect.x + x, this.rect.y + y);
	this.elements.push(ui_element);
};

UIElementContainer.prototype.display = function(context) {
	this.displayBackground(context);
	
	for (var i = 0; i < this.elements.length; i++) {
		var ui_element = this.elements[i];
		
		ui_element.display(context);
	}
};

UIElementContainer.prototype.step = function(delta) {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].step(delta);
	}	
};

UIElementContainer.prototype.displayBackground = function(context) {
	game.game_engine.getContext().clearRect(this.rect_x, this.rect_y, this.rect.width, this.rect.height);
};