function SplitScreenPhase() {}
SplitScreenPhase.prototype = Object.create(GamePhase.prototype);
SplitScreenPhase.parent = GamePhase.prototype;

SplitScreenPhase.MESSAGE_TIME = 5;
SplitScreenPhase.MESSAGE_FADEOUT_TIME = .2;

SplitScreenPhase.prototype._displayGameGraphics = function(game_state, context) {	
	for (var i = 0; i < game_state.cameras.length; i++) {
		var camera = game_state.cameras[i];
		
		game.game_engine.setCamera(-camera.x, camera.y);
		game_state.current_level.renderBackground(context, camera.x, 0);
		game_state.current_level.renderGeometry(context, 0, 0);
		
		// TO-DO: account for if there are additional actors.
		camera.target.display(context);
		
		for (var j = 0; j < game_state.actors.length; j++) {
			if (game_state.actors[j].getCamera() == i || game_state.actors[j].getCamera() == -1)
				game_state.actors[j].display(context);
		}
		
		// TO-DO: account for effects.
		if (camera.target instanceof Player) {
			for (var j = 0; j < game_state.effects.length; j++) {
				game_state.effects[j].display(context);
			}
		}
		
		// draw split
		context.lineWidth = 1;
		context.strokeStyle = '#151515';
		context.strokeRect(camera.x, Tracerider.SPLITSCREEN_WINDOW.y, 0, Tracerider.SPLITSCREEN_WINDOW.height);
	}
	
	game.ui_container.display(context);
	
	if (game.current_phase_name == 'intro') return;
	var message = game_state.current_level.getMessage();
	if (message) {
		if (game_state.message_timer < SplitScreenPhase.MESSAGE_TIME) {
			this.showGlitchMessage(message, 1, context);
		}
		else if (game_state.message_timer < SplitScreenPhase.MESSAGE_TIME + SplitScreenPhase.MESSAGE_FADEOUT_TIME) {
			var fadeout_time = game_state.message_timer - SplitScreenPhase.MESSAGE_TIME;
			var alpha = 1 - (fadeout_time / SplitScreenPhase.MESSAGE_FADEOUT_TIME);
			this.showGlitchMessage(message, alpha, context);
		}
	}
};

SplitScreenPhase.prototype.showGlitchMessage = function(message_lines, alpha, context) {
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