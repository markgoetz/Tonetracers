function JailPhase() {}
JailPhase.prototype = Object.create(GameGraphicsPhase.prototype);
JailPhase.parent = GameGraphicsPhase.prototype;

JailPhase.MESSAGE_TIME = 5;
JailPhase.MESSAGE_FADEOUT_TIME = .2;

JailPhase.prototype.updateLogic = function(game_state, delta) {
	var player = game_state.getPlayer();
	
	game_state.step(delta);
	game_state.collisionTest();	
	game_state.geometryCollisionTest();	
	
	game.ui_container.step(delta);
	
	if (player.getHitbox().bottom_y() < 0)
		game.transition('run');
		
	if (player.y > game.WINDOW_HEIGHT || player.getHitbox().right_x() < 0 || player.x > game.WINDOW_WIDTH)
		game.transition('win');
		
	game_state.message_timer += delta;	
};

JailPhase.prototype.transitionTo = function(old_phase_name) {
	// load "jail" level
	for (var i = 0; i < game.game_state.actors.length; i++) {
		var actor = game.game_state.actors[i];
		
		if (actor instanceof Debugger) {
			game.game_state.removeActor(actor);
			i--;
		}
	}
	
	game.game_state.setLevel('jail');
	game.game_engine.setCamera(0,0);
	var player = game.game_state.getPlayer();
	player.x = game.WINDOW_WIDTH  / 2;
	player.y = game.WINDOW_HEIGHT / 2;
};

JailPhase.prototype.transitionFrom = function(new_phase_name) {
	if (new_phase_name == 'run') {
		game.game_state.resumeLevelProgress();
	}
};

JailPhase.prototype.interpretInput = function(game_state, key_handler) {
	var player = game_state.getPlayer();
	
	if (key_handler.LEFT_ARROW)
		player.move('left');
	else if (key_handler.RIGHT_ARROW)
		player.move('right');
	else
		player.slowHorizontal();
		
	if (key_handler.UP_ARROW)
		player.move('up');
	else if (key_handler.DOWN_ARROW)
		player.move('down');
	else
		player.slowVertical();
		
	if (key_handler.GLITCH)
		player.glitchOn();
	else
		player.glitchOff();
	
	if (key_handler.VOLUME_UP) {
		game.game_engine.volumeUp();
		game.showVolume();
	}
	else if (key_handler.VOLUME_DOWN) {
		game.game_engine.volumeDown();
		game.showVolume();
	}	
};

JailPhase.prototype.renderGraphics = function(game_state, context) {
	game_state.current_level.renderBackground(context);
	game_state.current_level.renderGeometry(context);
	
	for (i = 0; i < game_state.actors.length; i++) {
		if (game_state.actors[i] instanceof Tracer) continue;
		
		game_state.actors[i].display(context);
	}
	
	for (i = 0; i < game_state.effects.length; i++)
		game_state.effects[i].display(context);
		
	var message = game_state.current_level.getMessage();
	if (message) {
		if (game_state.message_timer < JailPhase.MESSAGE_TIME) {
			this.showGlitchMessage(message, 1, context);
		}
		else if (game_state.message_timer < JailPhase.MESSAGE_TIME + JailPhase.MESSAGE_FADEOUT_TIME) {
			var fadeout_time = game_state.message_timer - JailPhase.MESSAGE_TIME;
			var alpha = 1 - (fadeout_time / JailPhase.MESSAGE_FADEOUT_TIME);
			this.showGlitchMessage(message, alpha, context);
		}
	}
};

JailPhase.prototype.showGlitchMessage = function(message_lines, alpha, context) {
	var y = TraceriderUIContainer.HEIGHT + 40;
	
	var font_size = Math.floor(Math.random() * 1) + 40;
	if (alpha < 1) font_size += Math.floor(1.5 / alpha);
	
	
	context.font = font_size + 'px ' + Tracerider.GLITCH_FONT_NAME;
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.strokeStyle = '#000000';
	context.lineWidth = 9;
	for (var i = 0; i < message_lines.length; i++) {
		var x_delta = Math.random() * 9 - 5;
		var y_delta = Math.random() * 9 - 5;
		
		context.strokeText(message_lines[i], game.WINDOW_WIDTH / 2 + x_delta, y + y_delta);
		
		context.fillStyle = 'hsla(' + Math.floor(Math.random() * 360) + ',60%,60%,' + alpha + ')';
		
		context.fillText(message_lines[i], game.WINDOW_WIDTH / 2 + x_delta, y + y_delta);
		y += 50;
	}
};