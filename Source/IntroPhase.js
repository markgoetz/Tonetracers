function IntroPhase() {}
IntroPhase.prototype = Object.create(SplitScreenPhase.prototype);
IntroPhase.parent = SplitScreenPhase.prototype;

IntroPhase.TRACER_VELOCITY = 420;
IntroPhase.SCRIPT_TIMER = 2.2;
IntroPhase.PLAY_TIMER = .5;

IntroPhase.prototype.updateLogic = function(game_state, delta) {
	game_state.step(delta);
	
	if (this.play_timer >= 0) {
		this.play_timer += delta;
		
		if (this.play_timer > IntroPhase.PLAY_TIMER)
			game.transition('run');
	}
	else {
	
		var trigger_next_phase = true;
		for (var i = 0; i < game_state.actors.length; i++) {
			var actor = game_state.actors[i];
			if (!(actor instanceof Player) && !(actor instanceof Tracer)) {
				continue;
			}
			
			if (!actor.isCutsceneDone())
				trigger_next_phase = false;
		}
		
		if (trigger_next_phase)
			this.play_timer = 0;
	}
	
	this.timer -= delta;
	if (this.timer <= 0) {
		this.timer += IntroPhase.SCRIPT_TIMER;
		
		var instruction = this.instructions.shift();
		
		if (instruction != null)
			game_state.actors[instruction].introCutsceneActivate();
	}
	
	// update the intro explosion
	for (i = 0; i < game_state.effects.length; i++) {
		game_state.effects[i].step(delta);
	}
};

IntroPhase.prototype.interpretInput = function(game_state, key_handler) {

};

IntroPhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
};

IntroPhase.prototype.transitionTo = function() {
	this.timer = 0;
	this.play_timer = -1;
	this.instructions = [1, 2, 0];
	for (var i = 0; i < game.game_state.cameras.length; i++) {
		game.game_state.cameras[i].reset();
	}
	
	for (var i = 0; i < game.game_state.actors.length; i++) {
		game.game_state.actors[i].reset();
	}
};

IntroPhase.prototype.transitionFrom = function() {
	game.game_state.cutsceneEnd();
	game.game_state.playMusic();
};
