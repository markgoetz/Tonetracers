function GameRunPhase() {}
GameRunPhase.prototype = Object.create(SplitScreenPhase.prototype);
GameRunPhase.parent = SplitScreenPhase.prototype;

GameRunPhase.JAIL_DELAY = 3;

GameRunPhase.prototype.updateLogic = function(game_state, delta) {
	for (var i = 0; i < game_state.cameras.length; i++) {
		game_state.cameras[i].think(delta);
	}

	game_state.step(delta);
	game_state.geometryCollisionTest();	
	game_state.collisionTest();
	
	for (i = 0; i < game_state.effects.length; i++) {
		game_state.effects[i].step(delta);
	}
	
	game.ui_container.step(delta);
	
	if (game_state.getPlayer().y < -Player.HEIGHT) {
		game.transition('passed');
	}
	
	if (game.game_state.player_caught) {
		this.jail_timer += delta;
		
		if (this.jail_timer > GameRunPhase.JAIL_DELAY)
			game.transition('jail');
	}
	
	game_state.message_timer += delta;
};

GameRunPhase.prototype.transitionTo = function() {
	this.jail_timer = 0;
	game.game_state.player_caught = false;
};

GameRunPhase.prototype.interpretInput = function(game_state, key_handler) {
	if (this.jail_timer) return;
	
	var player = game_state.getPlayer();
	
	if (key_handler.LEFT_ARROW)
		player.move('left');
	else if (key_handler.RIGHT_ARROW)
		player.move('right');
	else
		player.slowHorizontal();
		
	/*if (key_handler.UP_ARROW)
		player.move('up');
	else if (key_handler.DOWN_ARROW)
		player.move('down');
	else
		player.slowVertical();*/
		
	if (key_handler.GLITCH)
		player.glitchOn();
	else
		player.glitchOff();
	
	if (key_handler.PAUSE) {
		game.transition('pause');
	}
	
	if (key_handler.VOLUME_UP) {
		game.game_engine.volumeUp();
		game.showVolume();
	}
	else if (key_handler.VOLUME_DOWN) {
		game.game_engine.volumeDown();
		game.showVolume();
	}
};

GameRunPhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
	
	if (this.jail_timer > 0) {
		context.fillStyle = 'rgba(0,0,0,' + this.jail_timer / GameRunPhase.JAIL_DELAY + ')';
		context.fillRect(0,0,game.WINDOW_WIDTH,game.WINDOW_HEIGHT);
	}
};