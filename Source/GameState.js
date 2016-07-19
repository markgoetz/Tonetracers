function GameState() {
	this.score = 0;
	this.level_number = 0;
	this.level_progress = 0;
	
	this.deaths = 0;
	this.level_deaths = 0;
	
	this.triggers = [];
	
	this.cameras = [];
	this.actors = [];
		
	this.effects = [];
	this.effect_count = 0;	
	this.current_level = null;
	this.new_score = false;
	this.ids = 0;
	
	this.player_caught = 0;
	this.message_timer = 0;
	
	this.music = null;
};

GameState.prototype.init = function() {		
	var player = new Player();
	
	var tracer1 = new Tracer(0);
	var tracer2 = new Tracer(1);
	
	this.cameras.push(new TraceriderCamera(tracer1, 0));	
	this.cameras.push(new TraceriderCamera(player,  Tracerider.SPLITSCREEN_WINDOW.width));
	this.cameras.push(new TraceriderCamera(tracer2, Tracerider.SPLITSCREEN_WINDOW.width * 2));
	
	this.current_level = game.level_map.getLevel(this.level_number);
	this.current_level.init();

	player.setCamera(1);
	this.registerActor(player);
	
	tracer1.setCamera(0);
	this.registerActor(tracer1);
	
	tracer2.setCamera(2);
	this.registerActor(tracer2);
	
	this.initLevel();
	this.playMusic();
};

GameState.prototype.registerActor = function(actor) {
	actor.init();
	actor.id = this.ids++;
	this.actors.push(actor);
};

GameState.prototype.step = function(delta) {
	for (var i = 0; i < this.actors.length; i++) {
		this.actors[i].step(delta);
	}
};

GameState.prototype.collisionTest = function() {
	for (var i = 0; i < this.actors.length; i++) {
		for (var j = 0; j < this.actors.length; j++) {
			if (i == j) continue;
			if (!this.actors[i] || !this.actors[j]) continue; // in case an actor had been removed during the loop.
			
			this.actors[i].collisionTest(this.actors[j]);
		}
	}
};

GameState.prototype.geometryCollisionTest = function() {
	for (var i = 0; i < this.actors.length; i++) {
		this.current_level.geometry.collisionCheck(this.actors[i]);
	}
};

GameState.prototype.getPlayer = function() {
	for (var i = 0; i < this.actors.length; i++) {
		if (this.actors[i] instanceof Player) return this.actors[i];
	}
};

GameState.prototype.removeActor = function(actor) {
	for (var i = 0; i < this.actors.length; i++) {
		if (this.actors[i].id == actor.id) {
			this.actors.splice(i, 1);
			return;
		}
	}
};

GameState.prototype.addBarrier = function(x, y, animation_name) {
	this.registerActor(new Barrier(x, y, animation_name));
};

GameState.prototype.addBonusGate = function(x, y) {
	this.registerActor(new BonusGate(x, y));
};

GameState.prototype.nextLevel = function() {
	game.transition('run');
	this.level_number++;
	this.level_progress++;
	
	if (this.level_number >= game.level_map.getLevelCount()) {
		// HELP WHAT DO I DO
	}
	else {
		this.initLevel();
		this.playMusic();
	}
};

GameState.prototype.setLevel = function(level_name) {
	this.level_number = game.level_map.getLevelNumberByName(level_name);
	this.initLevel();
	this.playMusic();
};

GameState.prototype.initLevel = function() {
	for (var i = 0; i < this.actors.length; i++) {
		var actor = this.actors[i];
		if (!(actor instanceof Player || actor instanceof Tracer)) {
			this.removeActor(actor);
			i--;
		}
	}	
	
	this.current_level = game.level_map.getLevel(this.level_number);
	this.current_level.init();
	
	for (var i = 0; i < this.actors.length; i++) {
		this.actors[i].reset();
	}	
	
	for (var i = 0; i < this.cameras.length; i++) {
		this.cameras[i].reset();
	}
		
	for (var i = 0, x = this.current_level.getDebuggerCount(); i < x; i++) {
		var debug = new Debugger();
		debug.setCamera(1);
		this.registerActor(debug);
	}
	
	this.level_deaths = 0;
	this.message_timer = 0;
};

GameState.prototype.isLastLevel = function() {
	return (this.level_number == TraceriderLevelMap.LEVEL_COUNT - 1);
};

GameState.prototype.stopMusic = function() {
	if (this.music)
		this.music.stop();
};

GameState.prototype.playMusic = function() {
	if (this.music)
		this.music.stop();
	
	var song_name;
	if (game.current_phase_name == 'title')
		song_name = 'title';
	else
		song_name = this.current_level.getSongName();
	
	this.music = game.sound_map.getSound(song_name);
	if (this.music)
		this.music.play();
};

GameState.prototype.addDeath = function() {
	this.deaths++;
	this.level_deaths++;
	
	var player = this.getPlayer();
	this.addExplosion(player.x + (Player.WIDTH / 2), player.y + (Player.HEIGHT / 2));
};

GameState.prototype.addExplosion = function(x, y) {
	var explosion_count = 16;
	
	for (var i = 0; i < explosion_count; i++) {
		var angle = i * 2 * Math.PI / explosion_count;
		var effect = new PlayerDiedEffect(x, y, angle);
		effect.id = this.effect_count++;
		this.effects.push(effect);
	}
};

GameState.prototype.setCameraVelocity = function(velocity) {
	for (var i = 0; i < this.cameras.length; i++) {
		this.cameras[i].setVelocity(velocity);
	}
};

GameState.prototype.reset = function() {
	for (var i = 0; i < this.actors.length; i++) {
		this.actors[i].reset();
	}
	
	this.effects = [];
	this.effect_count = 0;
		
	this.current_level = game.level_map.getLevel(this.level_number);
	this.current_level.init();
};

GameState.prototype.resumeLevelProgress = function() {
	this.level_number = this.level_progress;
	this.initLevel();
	this.playMusic();	
};


GameState.prototype.removeActorsByType = function(type) {
	
};

GameState.prototype.removeEffect = function(effect) {
	for (var i = 0, x = this.effects.length; i < x; i++) {
		if (this.effects[i].id == effect.id) {
			this.effects.splice(i, 1);
			return;
		}
	}
};

GameState.prototype.getCameraTop = function() {
	return this.cameras[1].y + TraceriderUIContainer.HEIGHT;
};

GameState.prototype.getCameraBottom = function() {
	return this.cameras[1].y + (game.WINDOW_HEIGHT);
};

GameState.prototype.playerCaught = function() {
	if (this.player_caught) return;
	this.player_caught = true;
	this.getPlayer().stopAll();
	game.sound_map.getSound('caught').play();
};

GameState.prototype.secondsBehind = function() {
	var player = this.getPlayer();
	
	var tracer;
	for (var i = 0; i < this.actors.length; i++) {
		if (this.actors[i] instanceof Tracer) {
			tracer = this.actors[i];
			break;
		}
	}
	
	var distance = player.y - tracer.y;
	return (distance / this.current_level.getVelocity());
};

GameState.prototype.isJail = function() {
	return this.current_level.isJail();
};

GameState.prototype.cutsceneEnd = function() {
	for (var i = 0; i < this.actors.length; i++) {
		if (this.actors[i] instanceof Tracer || this.actors[i] instanceof Player)
			this.actors[i].cutsceneEnd();
	}
};

GameState.prototype.getCamera = function(actor) {
	for (var i = 0; i < this.cameras.length; i++) {
		if (this.cameras[i].target == actor)
			return this.cameras[i];
	}
	return null;
};

GameState.prototype.setupWinCutscene = function() {
	this.setLevel('win');
	game.game_engine.setCamera(0,0);

	
	for (var i = 0; i < this.actors.length; i++) {
		if (!(this.actors[i] instanceof Player)) {
			this.removeActor(this.actors[i]);
			i--;
		}
	}
	
	this.getPlayer().setWinCutscene();
	
	for (var i = 0; i < WinPhase.GLITCH_COUNT; i++) {
		var x, y;
		var collision_flag = false;
		
		while (!collision_flag) {
			x = Math.random() * game.WINDOW_WIDTH;
			y = Math.random() * game.WINDOW_HEIGHT;
			
			collision_flag = true;
			
			for (var check_x = x; check_x <= x + Glitch.WIDTH; check_x += TraceriderLevel.TILE_SIZE) {
				for (var check_y = y; check_y <= y + Glitch.HEIGHT; check_y += TraceriderLevel.TILE_SIZE) {
					if (this.current_level.geometry.checkPixel(check_x, check_y) != null)
						collision_flag = false;
				}
			}
		}
				
		var glitch = new Glitch(x, y);
		this.registerActor(glitch);
	}
};

GameState.prototype.winCutsceneTransition = function() {
	for (var i = 0; i < this.actors.length; i++) {
		this.actors[i].winCutsceneTransition();
	}
};

GameState.prototype.isWinCutsceneOver = function() {
	var over = true;
	for (var i = 0; i < this.actors.length; i++) {
		if (!this.actors[i].isWinCutsceneOver()) {
			over = false;
		}
	}
	
	return over;
};
