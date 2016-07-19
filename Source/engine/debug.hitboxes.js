// Step 1 - create elements and canvas
// Step 2 - create tabs for sprite and tilemap viewers
// Step 3 - add controls.

var _debug;
if (!_debug) _debug = {};

_debug.draw_hitboxes = false;
_debug.hitbox_color = '#0000ff';
_debug.createContainer = function() {
	if (document.getElementById('DEBUG_CONTAINER')) return;
	
	this.container = document.createElement('div');
	this.container.id = 'DEBUG_CONTAINER';
	document.getElementsByTagName('body').item(0).insertBefore(this.container, document.getElementById('GAME_CANVAS'));
	
	this.menu_container = document.createElement('span');
	this.menu_container.style.display = 'inline-block';
	this.menu_container.style.verticalAlign = 'top';
	this.container.appendChild(this.menu_container);
};

_debug.createHitboxSelector = function() {
		var hitbox_container = document.createElement('div');
		var hitbox_checkbox = document.createElement('input');
		hitbox_checkbox.type = 'checkbox';
		hitbox_checkbox.onchange = function() { _debug.toggleHitboxDisplay(); };

		var hitbox_input = document.createElement('input');
		hitbox_input.type = 'text';
		hitbox_input.value = this.hitbox_color;
		hitbox_input.size = "6";
		hitbox_input.id = "DEBUG_hitbox_color";
		hitbox_input.onchange = function() { _debug.setHitboxColor(); };
		
		hitbox_container.appendChild(hitbox_checkbox);
		hitbox_container.appendChild(document.createTextNode('Show hitboxes\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
		hitbox_container.appendChild(document.createTextNode('Color:'));
		hitbox_container.appendChild(hitbox_input);
		this.container.appendChild(hitbox_container);
};
_debug.toggleHitboxDisplay = function() {
		this.draw_hitboxes = !this.draw_hitboxes;
};
_debug.setHitboxColor = function() {
	this.hitbox_color = document.getElementById('DEBUG_hitbox_color').value;
};

_debug.createContainer();
_debug.createHitboxSelector();

// re-implement the getDelta function in debug mode so that it is constant and not affected by time spent in break mode
GameEngine.prototype.getDelta = function() {
	return 1/this.frame_rate;
};


// re-implement Actor.display to draw hitboxes on top of the sprites, if needed.
// Use _debug_display so if display ever gets rewritten, this doesn't also have to be rewritten.
Actor.prototype._debug_display = Actor.prototype.display;
Actor.prototype.display = function(context) {
	this._debug_display(context);
	
	if (_debug.draw_hitboxes) {
		context.lineWidth = 1;
		context.strokeStyle = _debug.hitbox_color;
		var hitbox = this.getHitbox();
		context.strokeRect(
			hitbox.x - game.game_engine.camera_x,
			hitbox.y - game.game_engine.camera_y,
			hitbox.width,
			hitbox.height
		);
	}
};
