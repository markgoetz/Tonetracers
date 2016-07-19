function TitlePhase() {}
TitlePhase.prototype = Object.create(GamePhase.prototype);
TitlePhase.parent = GamePhase.prototype;

TitlePhase.START_DELAY = 1.4;
TitlePhase.START_TEXT_FLICKER_TIME = .1;
TitlePhase.CIRCLE_FREQUENCY = 1.5;
TitlePhase.CIRCLE_VELOCITY = 90;
TitlePhase.CIRCLE_MIN_RADIUS = 30;
TitlePhase.CIRCLE_MAX_RADIUS = 120;

TitlePhase.prototype.updateLogic = function(game_state, delta) {
	game.ui_container.step(delta);
	
	for (var i = 0; i < this.circles.length; i++) {
		this.circles[i].y += delta * TitlePhase.CIRCLE_VELOCITY;
	}
	
	if (this.start_timer >= 0) {
		this.start_timer += delta;
		if (this.start_timer > TitlePhase.START_DELAY)
			game.transition('intro');
	}
	
	this.circle_timer += delta;
	if (this.circle_timer > TitlePhase.CIRCLE_FREQUENCY) {
		this.circle_timer -= TitlePhase.CIRCLE_FREQUENCY;
		
		var radius = Math.random() * (TitlePhase.CIRCLE_MAX_RADIUS - TitlePhase.CIRCLE_MIN_RADIUS) + TitlePhase.CIRCLE_MIN_RADIUS;
		this.circles.push({x:Math.random() * (game.WINDOW_WIDTH - radius * 2), y:-radius * 2, r:radius});
	}
};

TitlePhase.prototype.interpretInput = function(game_state, key_handler) {
	if (key_handler.PAUSE) {
		game.sound_map.getSound('passed').play();
		this.start();
	}
};

TitlePhase.prototype.start = function() {
	this.start_timer = 0;	
};

TitlePhase.prototype.renderGraphics = function(game_state, context) {
	context.fillStyle = '#b2ece0';
	context.fillRect(0, 0, game.WINDOW_WIDTH, game.WINDOW_HEIGHT);
	
	context.fillStyle = '#2fb19c';
	for (var i = 0; i < this.circles.length; i++) {
		context.beginPath();
		context.arc(this.circles[i].x, this.circles[i].y, this.circles[i].r, 0, 2 * Math.PI, false);
		context.fill();
	}
	
	context.font = '90px ' + Tracerider.FONT_NAME;
	context.textBaseline = 'top';
	context.textAlign = 'center';
	
	context.fillStyle = '#006452';
	context.fillText('Tonetracers', game.WINDOW_WIDTH / 2, 45);
	
	context.font = '45px ' + Tracerider.FONT_NAME;
	context.fillText('2014 glitch jam', game.WINDOW_WIDTH / 2, 150);
	
	context.font = '30px ' + Tracerider.FONT_NAME;
	context.textAlign = 'left';
	context.fillText("mark goetz (@markdoesnttweet)", 460, 315);
	context.fillText("jake walters (@TheMcAxl)", 460, 360);
	
	context.fillStyle = '#02957c';
	context.textAlign = 'right';
	context.fillText("design, programming, art", 440, 315);
	context.fillText('music', 440, 360);
	
	if (this.start_timer == -1 ||
		this.start_timer % (TitlePhase.START_TEXT_FLICKER_TIME * 2) < TitlePhase.START_TEXT_FLICKER_TIME) {
		context.font = '45px ' + Tracerider.FONT_NAME;
		context.textAlign = 'center';
		context.fillStyle = '#b3027b';
		context.fillText('Press space to start', game.WINDOW_WIDTH / 2, 465);
	}
};

TitlePhase.prototype.transitionTo = function(old_phase_name) {
	this.circle_timer = 0;
	this.start_timer = -1;
	this.circles = [];
};

TitlePhase.prototype.transitionFrom = function() {
	game.game_state.stopMusic();
};
