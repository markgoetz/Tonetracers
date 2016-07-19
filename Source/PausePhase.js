function PausePhase() {}
PausePhase.prototype = Object.create(SplitScreenPhase.prototype);
PausePhase.parent = SplitScreenPhase.prototype;

PausePhase.prototype.updateLogic = function(game_state, delta) {
	game.ui_container.step(delta);
};

PausePhase.prototype.interpretInput = function(game_state, key_handler) {
	if (key_handler.PAUSE) {
		game.transition('run');
	}
};

PausePhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
	
	var width = game.WINDOW_WIDTH;
	var height = game.WINDOW_HEIGHT;
	context.fillStyle = 'rgba(0, 0, 0, .7)';
	context.fillRect(0, 0, width, height);
	
	context.textAlign = 'center';
	context.textBaseline = 'bottom';
	
	context.fillStyle = '#72ddca';
	context.font = '60pt ' + Tracerider.FONT_NAME;
	context.fillText('Paused', width / 2, height / 2 - 10);
	
	context.font = '30pt ' + Tracerider.FONT_NAME;
	context.fillText('Press Space to continue', width / 2, height / 2 + 35);
};

PausePhase.prototype.transitionTo = function() {
	game.game_engine.muffleVolume();
};

PausePhase.prototype.transitionFrom = function() {
	game.game_engine.setVolume();
};
