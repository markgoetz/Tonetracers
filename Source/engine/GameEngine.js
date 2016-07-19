function GameEngine() {
	this.frame_rate = 60; // reasonable default!
	this.prev_time = 0;
	this.width = 0;
	this.height = 0;
	this.preloader = {};
	this.key_handler = {};
	this.fonts_loaded = false;
	this.audio_context = null;
}

GameEngine.prototype.init = function(width, height, frame_rate, preloader_class_name) {
	this.frame_rate = frame_rate;
	this.width = width;
	this.height = height;
	
	this.key_handler = new KeyHandler();
	
	window.addEventListener('keyup', function(event) { game.game_engine.key_handler.keyUp(event); }, false);
	window.addEventListener('keydown', function(event) { game.game_engine.key_handler.keyDown(event); }, false);
	
	var body_element = document.getElementsByTagName('body').item(0);
	body_element.style.margin = 0;
	
	var canvas_element = document.createElement('canvas');
	canvas_element.height = height;
	canvas_element.width = width;
	canvas_element.id = 'GAME_CANVAS';
	body_element.appendChild(canvas_element);
	
	var font_element = document.createElement('div');
	font_element.id = 'fonts';
	body_element.appendChild(font_element);
	
	if (typeof AudioContext !== "undefined") {
   		this.audio_context = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
    	this.audio_context = new webkitAudioContext();
	}
	
	this.volume = 5;
	this.gain_node = this.audio_context.createGain ? this.audio_context.createGain() : this.audio_context.createGainNode();
	this.gain_node.connect(this.audio_context.destination);
	
	this.camera_x = 0;
	this.camera_y = 0;
	
	window.onload = function() { game.game_engine.fonts_loaded = true; };
	
	this.prev_time = new Date().getTime() / 1000;
	
	this.preloader = new window[preloader_class_name](this.width, this.height);
	
	this.preLoad();
};

GameEngine.prototype.setCamera = function(x, y) {
	this.camera_x = x;
	this.camera_y = y;
};

GameEngine.prototype.getGraphicsContext = function() {
	return document.getElementById('GAME_CANVAS').getContext('2d');
};

GameEngine.prototype.getAudioContext = function() {
	return this.audio_context;
};

GameEngine.prototype.playSound = function(buffer, looping) {
	var source = this.audio_context.createBufferSource();
	source.buffer = buffer;
	source.loop = looping;
	source.connect(this.gain_node);
	source.start(0);
	return source;
};

GameEngine.prototype.volumeUp = function() {
	this.volume++;
	if (this.volume > 10) this.volume = 10;
	this.setVolume();
};

GameEngine.prototype.volumeDown = function() {
	this.volume--;
	if (this.volume < 0) this.volume = 0;
	this.setVolume();
};

GameEngine.prototype.setVolume = function() {
	this.gain_node.gain.value = Math.cos((10 - this.volume) * 0.05 * Math.PI);
};

GameEngine.prototype.getVolume = function() {
	return this.volume;
};

GameEngine.prototype.muffleVolume = function() {
	this.gain_node.gain.value = Math.cos((10 - this.volume/3) * 0.05 * Math.PI);
};

GameEngine.prototype.muteVolume = function() {
	this.gain_node.gain.value = 0;
};

GameEngine.prototype.getDelta = function() {
	var time = new Date().getTime() / 1000;
	delta = time - this.prev_time;
	this.prev_time = time;
	return delta;
	//return 1/this.frame_rate;
};

GameEngine.prototype.gameLoop = function() {
	var delta = this.getDelta();
	
	var phase = game.getCurrentPhase();
	phase.interpretInput(game.game_state, this.key_handler);
	this.key_handler.reset();
	
	phase.updateLogic(game.game_state, delta);	

	// TO-DO: Double-buffer it.  If necessary.
	var context = this.getGraphicsContext();
	context.clearRect(0, 0, this.width, this.height);
	phase.renderGraphics(game.game_state, context);
	
	game.transitionCheck();
	
	/*context.font='16px Times New Roman';
	context.textAlign='left';
	context.fillStyle='#ffffff';	 
	context.fillText('fps:' + 1/delta,0,16);*/
	
	setTimeout(function() { game.game_engine.gameLoop(); }, 1000/this.frame_rate);
};

GameEngine.prototype.preLoad = function() {
	this.preloader.renderPreloader(this.getGraphicsContext());
	
	if (this.preloader.isDone() && this.fonts_loaded) {
		game.game_state.init();
		this.gameLoop();
	}
	else
		setTimeout(function() { game.game_engine.preLoad(); }, 1000/this.frame_rate);
};

GameEngine.prototype.initFont = function(font_name, file_name, format) {
	var format_text = '';
	
	if (format == 'truetype') {
		format_text = " format('" + format + "')";
	}
	
	var new_style = document.createElement('style');
	new_style.appendChild(document.createTextNode("\
	@font-face {\
	    font-family: \"" + font_name + "\";\
	    src: url('" + file_name + "')" + format_text + ";\
	}\
	"));

	document.head.appendChild(new_style);
	
	var fonts = document.createElement('div');
	fonts.style.fontFamily = font_name;
	fonts.appendChild(document.createTextNode(' '));
	document.getElementById('fonts').appendChild(fonts);
};

// Add utility functions that allow you to pass in a Rectangle object or point struct to the canvas.
CanvasRenderingContext2D.prototype.fillRectObject = function(rect) {
	this.fillRect(rect.x, rect.y, rect.width, rect.height);
};

CanvasRenderingContext2D.prototype.strokeRectObject = function(rect) {
	this.strokeRect(rect.x, rect.y, rect.width, rect.height);
};

CanvasRenderingContext2D.prototype.moveToPoint = function(point) {
	this.moveTo(point[0], point[1]);
};

CanvasRenderingContext2D.prototype.lineToPoint = function(point) {
	this.lineTo(point[0], point[1]);
};
