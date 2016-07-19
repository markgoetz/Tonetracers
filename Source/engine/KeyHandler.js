function KeyHandler() {
	this.continuous_key_codes = new Array();
	this.pressed_key_codes = new Array();
}


KeyHandler.prototype.keyDown = function(e) {
	var key_name;
	if (key_name = this.continuous_key_codes[e.keyCode]) {
		this[key_name] = true;
		e.preventDefault();
		return false;
	}
	else if (key_name = this.pressed_key_codes[e.keyCode]) {
		this[key_name] = true;
		e.preventDefault();
		return false;
	}
};

KeyHandler.prototype.keyUp = function(e) {
	var key_name;
	if (key_name = this.continuous_key_codes[e.keyCode]) {
		this[key_name] = false;
		e.preventDefault();
		return false;
	}
	
};

KeyHandler.prototype.reset = function() {
	for (var key_code in this.pressed_key_codes) {
		var key_name = this.pressed_key_codes[key_code];
		this[key_name] = false;
	}
};

KeyHandler.prototype.registerKey = function(name, code, continuous) {
	if (continuous) {
		this.continuous_key_codes[code] = name;
	}
	else {
		this.pressed_key_codes[code] = name;
	}
	this[name] = false;
};

KeyHandler.prototype.resetKeyCodes = function() {
	this.continuous_key_codes = new Array();
	this.pressed_key_codes = new Array();
};
