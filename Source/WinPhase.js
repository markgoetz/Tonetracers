function WinPhase() {}
WinPhase.prototype = Object.create(GameGraphicsPhase.prototype);
WinPhase.parent = GameGraphicsPhase.prototype;

WinPhase.MESSAGE_FADEIN_TIME = 3;
WinPhase.MIN_GLITCH_DELAY = 2.5;
WinPhase.MAX_GLITCH_DELAY = 4;

WinPhase.MOVE_DELAY = 2;
WinPhase.PLAYER_VELOCITY = 150;
WinPhase.PLAYER_STOP_Y = 300;

WinPhase.GLITCH_COUNT = 10;
WinPhase.GLITCH_FADEIN_TIME = 5;

WinPhase.getGlitchTime = function() {
	return Math.random() * (WinPhase.MAX_GLITCH_DELAY - WinPhase.MIN_GLITCH_DELAY) + WinPhase.MIN_GLITCH_DELAY;
};

WinPhase.prototype.updateLogic = function(game_state, delta) {
	game.ui_container.step(delta);
	game_state.step(delta);
	
	if (this.show_message_timer >= 0) {
		this.show_message_timer = Math.min(this.show_message_timer + delta, WinPhase.MESSAGE_FADEIN_TIME); 
	}
	
	if (this.fadein_timer < WinPhase.GLITCH_FADEIN_TIME) {
		this.fadein_timer += delta;
		if (this.fadein_timer >= WinPhase.GLITCH_FADEIN_TIME) {
			this.fadein_timer = WinPhase.GLITCH_FADEIN_TIME;
		}
	}
	
	if (game_state.getPlayer().y_velocity == 0 && this.transitioned == false) {
		game_state.winCutsceneTransition();
		this.transitioned = true;
	}
	
	if (game_state.isWinCutsceneOver() && this.show_message_timer == -1) {
		this.show_message_timer = 0;
	}
};

WinPhase.prototype.interpretInput = function(game_state, key_handler) {
	
};

WinPhase.prototype.renderGraphics = function(game_state, context) {
	game_state.current_level.renderBackground(context);
	game_state.current_level.renderGeometry(context);
	
	for (i = 0; i < game_state.actors.length; i++) {
		if (game_state.actors[i] instanceof Glitch) {
			context.globalAlpha = this.fadein_timer / WinPhase.GLITCH_FADEIN_TIME;
		}
		else {
			context.globalAlpha = 1;
		}
				
		game_state.actors[i].display(context);
	}
	
	context.globalAlpha = 1;
	
	for (i = 0; i < game_state.effects.length; i++)
		game_state.effects[i].display(context);
	
	if (this.show_message_timer >= 0) {
		var alpha = this.show_message_timer / WinPhase.MESSAGE_FADEIN_TIME;
		context.fillStyle = 'hsla(170,100%,39%,' + alpha + ')';
		context.textAlign = 'center';
		context.font = '90px ' + Tracerider.FONT_NAME;
		context.fillText('You Won', game.WINDOW_WIDTH / 2, 200);
	}
};

WinPhase.prototype.transitionTo = function() {
	game.game_state.setupWinCutscene();
	this.show_message_timer = -1;
	this.fadein_timer = 0;
	this.transitioned = false;
};
