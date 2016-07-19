function LevelPassedPhase() {}
LevelPassedPhase.prototype = Object.create(SplitScreenPhase.prototype);
LevelPassedPhase.parent = SplitScreenPhase.prototype;

LevelPassedPhase.TOTAL_TIME = 6;

LevelPassedPhase.BEHIND_TIME = 1.5;
LevelPassedPhase.LEVEL_DEATHS_TIME = 2.5;
LevelPassedPhase.ALL_DEATHS_TIME = 3.5;

LevelPassedPhase.SATURATION = '70%';
LevelPassedPhase.VALUE = '59%';
LevelPassedPhase.HUE_ROTATION_TIME = 2;

LevelPassedPhase.prototype.transitionTo = function() {
	this.time = 0;
	this.hue = 0;
	this.last_level = false;
	this.blips_played = 0;
	game.game_state.getPlayer().stopAll();
	game.sound_map.getSound('passed').play();
};

LevelPassedPhase.prototype.updateLogic = function(game_state, delta) {
	for (var i = 0; i < game_state.cameras.length; i++) {
		game_state.cameras[i].think(delta);
	}
	
	game.ui_container.step(delta);
	
	for (var i = 0; i < game_state.actors.length; i++) {
		if (game_state.actors[i] instanceof Debugger)
			continue;
			
		game_state.actors[i].step(delta);
	}
	
	this.time += delta;	
	this.hue += (delta * 360) / LevelPassedPhase.HUE_ROTATION_TIME;
};

LevelPassedPhase.prototype.interpretInput = function(game_state, key_handler) {
	if (key_handler.PAUSE && this.time > LevelPassedPhase.TOTAL_TIME) {
		game_state.nextLevel();
	}
};

LevelPassedPhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
	
	var width = game.WINDOW_WIDTH;
	var height = game.WINDOW_HEIGHT;
	context.fillStyle = 'rgba(0, 0, 0, .5)';
	context.fillRect(0, 0, width, height);
	
	context.textAlign = 'center';
	
	context.fillStyle = 'hsl(' + this.hue + ',' + LevelPassedPhase.SATURATION + ',' + LevelPassedPhase.VALUE + ')';
	context.font = '60pt ' + Tracerider.FONT_NAME;
	context.fillText('Level Passed', width / 2, 100);
	
	context.fillStyle = '#72ddca';
	context.font = '30pt ' + Tracerider.FONT_NAME;
	
	if (this.time > LevelPassedPhase.BEHIND_TIME) {
		
		if (this.blips_played == 0) {
			this.blips_played++;
			game.sound_map.getSound('blip').play();
		}
		
		context.textAlign = 'right';
		context.fillText('Seconds Behind', width / 2 + 130, 200);
		context.textAlign = 'left';
		context.fillText(Math.round(game_state.secondsBehind(), 2), width / 2 + 150, 200);
	}
	
	if (this.time > LevelPassedPhase.LEVEL_DEATHS_TIME) {
		if (this.blips_played == 1) {
			this.blips_played++;
			game.sound_map.getSound('blip').play();
		}
		context.textAlign = 'right';
		context.fillText('Fails This Level', width / 2 + 130, 250);
		context.textAlign = 'left';
		context.fillText(game_state.level_deaths, width / 2 + 150, 250);
	}
	
	if (this.time > LevelPassedPhase.ALL_DEATHS_TIME) {
		if (this.blips_played == 2) {
			this.blips_played++;
			game.sound_map.getSound('blip').play();
		}
		
		context.textAlign = 'right';
		context.fillText('Total Fails', width / 2 + 130, 300);
		context.textAlign = 'left';
		context.fillText(game_state.deaths, width / 2 + 150, 300);
	}
	
	if (this.time > LevelPassedPhase.TOTAL_TIME) {
		context.textAlign = 'center';
		context.fillStyle = 'hsl(170,100%,39%)';

		if (game_state.isLastLevel()) {
			context.font = '60pt ' + Tracerider.FONT_NAME;
			context.fillText('Game Over', width / 2, 380);
		}
		else {
			context.fillText('Press space to continue', width / 2, 380);
		}
	}
	
	
};