// Step 1 - create elements and canvas
// Step 2 - create tabs for sprite and tilemap viewers
// Step 3 - add controls.

var _debug;
if (!_debug) _debug = {};


_debug.debug_state = '';
_debug.states=[];
_debug.prev_time = new Date().getTime() / 1000;
_debug.container = null;
_debug.menu_container = null;
_debug.tab_container = null;
_debug.current_sprite = null;
_debug.sprite_animating = true;
_debug.animation_name = null;
_debug.current_tile_set = null; 
_debug.current_tile_number = 0;
_debug.current_level = null;
_debug.createContainer = function() {
	this.container = document.createElement('div');
	this.container.id = 'DEBUG_CONTAINER';
	document.getElementsByTagName('body').item(0).insertBefore(this.container, document.getElementById('GAME_CANVAS'));
	
	this.menu_container = document.createElement('span');
	this.menu_container.style.display = 'inline-block';
	this.menu_container.style.verticalAlign = 'top';
		this.container.appendChild(this.menu_container);
};
_debug.createCanvas = function() {
	var canvas_container = document.createElement('span');
	
	var canvas_element = document.createElement('canvas');
	canvas_element.height = game.WINDOW_HEIGHT;
	canvas_element.width = game.WINDOW_WIDTH;
	canvas_element.id = 'DEBUG_CANVAS';
	
	canvas_container.appendChild(canvas_element);
	
	this.container.appendChild(canvas_container);
};
_debug.createTabContainer = function() {
	this.tab_container = document.createElement('div');
	this.menu_container.appendChild(this.tab_container);
};
_debug.createTab = function(name) {
	this.states.push(name);
	var tab_container_element = document.createElement('div');
	tab_container_element.id = 'DEBUG_tabcontainer_' + name;
	this.menu_container.appendChild(tab_container_element);
	
	if (name == 'Sprite') {
		this.setupSpriteElement(tab_container_element);
	}
	else if (name == 'Tileset') {
		this.setupTilesetElement(tab_container_element);
	}
	
	var tab_link = document.createElement('a');
	tab_link.id = 'DEBUG_tab_' + name;
	tab_link.href = 'javascript:_debug.setState("' + name + '")';
	tab_link.appendChild(document.createTextNode(name));
	tab_link.style.margin = '10px';
	
	this.tab_container.appendChild(tab_link);
};

_debug.getContext = function() {
	return document.getElementById('DEBUG_CANVAS').getContext('2d');
};
_debug.setState = function(state) {
	this.debug_state = state;
	for (var i = 0; i < this.states.length; i++) {
		if (this.debug_state == this.states[i]) {
			document.getElementById('DEBUG_tabcontainer_' + this.states[i]).style.display = 'block';
			document.getElementById('DEBUG_tab_' + this.states[i]).style.textDecoration = 'underline';
		}
		else {
			document.getElementById('DEBUG_tabcontainer_' + this.states[i]).style.display = 'none';
			document.getElementById('DEBUG_tab_' + this.states[i]).style.textDecoration = 'none';
		}
	}
};

_debug.setupSpriteElement = function(container) {
		
		// create a dropdown with the available spritesheets
		var sprite_selector_container = document.createElement('div');
		sprite_selector_container.appendChild(document.createTextNode('Select spritesheet:'));
		
		var sprite_selector = document.createElement('select');
		sprite_selector.id = 'DEBUG_sprite_selector';
		var sprite_sheet_list = game.sprite_sheet_map.getSpriteNames();
		for (var i = 0; i < sprite_sheet_list.length; i++) {
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(sprite_sheet_list[i]));
			option.Value = sprite_sheet_list[i];
			sprite_selector.appendChild(option);
		}
		sprite_selector.onchange = function() { _debug.selectSprite(); };
		sprite_selector_container.appendChild(sprite_selector);
		container.appendChild(sprite_selector_container);
		
		// create a dropdown with the available animations for the selected spritesheet
		var animation_selector_container = document.createElement('div');
		animation_selector_container.appendChild(document.createTextNode('Select animation:'));
		
		var animation_selector = document.createElement('select');
		animation_selector.id = 'DEBUG_animation_selector';
		animation_selector.onchange = function() { _debug.selectAnimation(); };
		animation_selector_container.appendChild(animation_selector);

		container.appendChild(animation_selector_container);
		
		// create buttons to control the animation
		var button_container = document.createElement('div');
		
		var back_button = document.createElement('button');
		back_button.appendChild(document.createTextNode('<'));
		back_button.onclick = function() { _debug.stepBackwardFrame(); };
		
		var play_button = document.createElement('button');
		play_button.appendChild(document.createTextNode('Play'));
		play_button.onclick = function() { _debug.playAnimation(); };
		
		var stop_button = document.createElement('button');
		stop_button.appendChild(document.createTextNode('Stop'));
		stop_button.onclick = function() { _debug.stopAnimation(); };
		
		var forward_button = document.createElement('button');
		forward_button.appendChild(document.createTextNode('>'));
		forward_button.onclick = function() { _debug.stepForwardFrame(); };
		
		// add button functionality here
		button_container.appendChild(back_button);
		button_container.appendChild(play_button);
		button_container.appendChild(stop_button);
		button_container.appendChild(forward_button);
		
		container.appendChild(button_container);
};
_debug.setupTilesetElement = function(container) {
		// create a dropdown with the available spritesheets
		var tilemap_selector_container = document.createElement('div');
		tilemap_selector_container.appendChild(document.createTextNode('Select tileset:'));
		
		var tilemap_selector = document.createElement('select');
		tilemap_selector.id = 'DEBUG_tilemap_selector';
		var tilemap_list = game.tile_map.getTileSetNames();
		for (var i = 0; i < tilemap_list.length; i++) {
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(tilemap_list[i]));
			option.Value = tilemap_list[i];
			tilemap_selector.appendChild(option);
		}
		tilemap_selector.onchange = function() { _debug.selectTileSet(); };
		tilemap_selector_container.appendChild(tilemap_selector);
		container.appendChild(tilemap_selector_container);
		
		// create buttons to control the animation
		var button_container = document.createElement('div');
		
		var back_button = document.createElement('button');
		back_button.appendChild(document.createTextNode('<'));
		back_button.onclick = function() { _debug.stepBackwardTile(); };
		
		var forward_button = document.createElement('button');
		forward_button.appendChild(document.createTextNode('>'));
		forward_button.onclick = function() { _debug.stepForwardTile(); };
		
		// add button functionality here
		button_container.appendChild(back_button);
		button_container.appendChild(forward_button);
		
		container.appendChild(button_container);
};
_debug.selectSprite = function() {
		// get the currently selected sprite name.
		var sprite_selector = document.getElementById('DEBUG_sprite_selector');
		var sprite_name = sprite_selector.options[sprite_selector.selectedIndex].value;
		
		_debug.current_sprite = new Sprite(sprite_name);
		_debug.current_sprite.init();
		
		// populate the animation selector with the animations for this spritesheet
		var animation_list = _debug.current_sprite.sprite_sheet.animations;
		var animation_selector = document.getElementById('DEBUG_animation_selector');
		
		var child;
		while (child = animation_selector.children[0]) animation_selector.removeChild(child);

		for (var i = 0; i < animation_list.length; i++) {
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(animation_list[i].name));
			option.Value = animation_list[i].name;
			animation_selector.appendChild(option);
		}
		
		_debug.selectAnimation();
};
_debug.selectAnimation = function() {
		// get the currently selected animation
		var animation_selector = document.getElementById('DEBUG_animation_selector');
		var animation_name = animation_selector.options[animation_selector.selectedIndex].value;
		this.animation_name = animation_name;
		
		_debug.playAnimation();
};
_debug.playAnimation = function() {
	this.current_sprite.current_frame = 0;
	this.current_sprite.animation_done = false;
	this.current_sprite.playAnimation(this.animation_name);
	this.sprite_animating = true;
};
_debug.stopAnimation = function() {
		this.sprite_animating = false;
};
_debug.stepForwardFrame = function() {
	this.sprite_animating = false;
	this.current_sprite.current_frame++;
	if (this.current_sprite.current_frame >= this.current_sprite.current_animation.max_frames)
		this.current_sprite.current_frame = 0;
};
_debug.stepBackwardFrame = function() {
	this.sprite_animating = false;
	this.current_sprite.current_frame--;
	if (this.current_sprite.current_frame < 0)
		this.current_sprite.current_frame = this.current_sprite.current_animation.max_frames - 1;
};
_debug.selectTileSet = function() {
	// get the currently selected sprite name.
	var tilemap_selector = document.getElementById('DEBUG_tilemap_selector');
	var tilemap_name = tilemap_selector.options[tilemap_selector.selectedIndex].value;
	
	this.current_tile_set = game.tile_map.getTileSet(tilemap_name);
		
};
_debug.stepForwardTile = function() {
	this.current_tile_number++;
	if (this.current_tile_number >= this.current_tile_set.getCount())
		this.current_tile_number = 0;
};
_debug.stepBackwardTile = function() {
	this.current_tile_number--;
	if (this.current_tile_number < 0)
		this.current_tile_number = this.current_tile_set.getCount() - 1;
};
_debug.debugLoop = function() {
	var delta = 1 / game.game_engine.frame_rate;
	game.game_engine.setCamera(0,0);
	
	var context = this.getContext();
	
	context.clearRect(0, 0, game.WINDOW_WIDTH, game.WINDOW_HEIGHT);

	if (this.debug_state == 'Sprite') {
		if (this.sprite_animating) {
			this.current_sprite.advanceAnimation(delta);
		}
		
		this.current_sprite.display(0, 20, context);
		
		context.fillStyle = '#000000';
		context.font = '12pt Georgia';
		context.fillText('Frame ' + (this.current_sprite.current_frame + 1) + ' of ' + this.current_sprite.current_animation.max_frames, 0, 12);
	}
	
	else if (this.debug_state == 'Tileset') {
		this.current_tile_set.display(0, 20, this.current_tile_number, context);
		
		context.fillStyle = '#000000';
		context.font = '12pt Georgia';
		context.fillText('Tile ' + (this.current_tile_number + 1) + ' of ' + this.current_tile_set.getCount(), 0, 12);			
	}
	
	setTimeout(function() {_debug.debugLoop(); }, 1000/game.game_engine.frame_rate);
};


_debug.createContainer();
_debug.createTabContainer();
_debug.createTab('Sprite');
_debug.createTab('Tileset');
_debug.createCanvas();

_debug.setState('Sprite');
_debug.selectSprite();
_debug.selectTileSet();

_debug.debugLoop();

// re-implement the getDelta function in debug mode so that it is constant and not affected by time spent in break mode
GameEngine.prototype.getDelta = function() {
	return 1/this.frame_rate;
};

