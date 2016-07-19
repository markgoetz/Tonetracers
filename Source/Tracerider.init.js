function Tracerider() {
	this.constructor('TraceriderPreloader');
}

Tracerider.prototype = Object.create(Game.prototype);
Tracerider.parent = Game.prototype;

Tracerider.FONT_NAME = 'Questrial';
Tracerider.GLITCH_FONT_NAME = 'Pixel';

Tracerider.SPLITSCREEN_WINDOW = new Rectangle(0, 0, 300, 600);

function init() {
	game = new Tracerider();
	game.init();
}

Tracerider.prototype.initResolution = function() {
	this.WINDOW_HEIGHT = 600;
	this.WINDOW_WIDTH  = 900;
	this.FRAME_RATE = 60;
	
	this.play_area_width  = this.WINDOW_WIDTH;
	this.play_area_height = this.WINDOW_HEIGHT;
};

Tracerider.prototype.initLevelMap = function() {
	this.level_map = new TraceriderLevelMap();
};

Tracerider.prototype.initUI = function() {
	this.ui_container = new TraceriderUIContainer();
};

Tracerider.prototype.initGamePhases = function() {
	this.game_phase_map.addPhase('run', 'GameRunPhase', ['pause','jail','passed']);
	this.game_phase_map.addPhase('pause', 'PausePhase', ['run']);
	this.game_phase_map.addPhase('title', 'TitlePhase', ['intro']);
	this.game_phase_map.addPhase('intro', 'IntroPhase', ['run']);
	this.game_phase_map.addPhase('passed', 'LevelPassedPhase', ['run']);
	this.game_phase_map.addPhase('jail', 'JailPhase', ['run']);
	this.game_phase_map.addPhase('win', 'WinPhase', ['title']);
	

	//this.game_phase_map.addPhase('gameover', 'GameOverPhase', ['run']);
	
	this.initPhase('title');
};

Tracerider.prototype.initSpriteSheets = function() {	
	var player = new SpriteSheet('player.png', Player.WIDTH, Player.HEIGHT);
	player.addAnimation('normal', [{x:0,y:0},{x:1,y:0}], 1/5);
	player.addAnimation('normalleft', [{x:2,y:0},{x:3,y:0}], 1/5);
	player.addAnimation('normalright', [{x:4,y:0},{x:5,y:0}], 1/5);
	
	player.addAnimation('glitch',  [{x:8,y:1},{x:9,y:1},{x:10,y:1}], 1/8);
	player.addAnimation('glitchleft',  [{x:8,y:1},{x:9,y:1},{x:10,y:1}], 1/8);
	player.addAnimation('glitchright',  [{x:8,y:1},{x:9,y:1},{x:10,y:1}], 1/8);
	
	player.addAnimation('dead', [{x:6,y:0},{x:7,y:0}], 1/10);
	player.addAnimation('invincible', [{x:8,y:0},{x:0,y:0}], 1/6);
	player.addAnimation('invincibleleft', [{x:9,y:0},{x:2,y:0}], 1/6);
	player.addAnimation('invincibleright', [{x:10,y:0},{x:4,y:0}], 1/6);
	
	player.addAnimation('introspin', [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}], .1);
	player.addAnimation('introdeploy', [{x:0,y:1,t:.5},{x:6,y:1,c:'introExplode'},{x:7,y:1},{x:0,y:0}], .1, false);
	
	this.sprite_sheet_map.addSpriteSheet('player', player);	
	
	
	var tracer = new SpriteSheet('tracer.png', Tracer.WIDTH, Tracer.HEIGHT);
	tracer.addAnimation('normal', [{x:0,y:0}], 1/8);
	tracer.addAnimation('moveleft',  [{x:1,y:0}], 1);
	tracer.addAnimation('moveright', [{x:2,y:0}], 1);
	tracer.addAnimation('spinleft',  [{x:1,y:0},{x:3,y:0},{x:5,y:0},{x:4,y:0},{x:2,y:0},{x:0,y:0}], .1);	
	tracer.addAnimation('spinright', [{x:2,y:0},{x:4,y:0},{x:5,y:0},{x:3,y:0},{x:1,y:0},{x:0,y:0}], .1);	
	tracer.addAnimation('introspin', [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}], .1);
	tracer.addAnimation('introdeploy', [{x:0,y:1,t:.5},{x:6,y:0,c:'introTurnOnEffect'},{x:6,y:1},{x:0,y:0,t:1}], .1, false);
	this.sprite_sheet_map.addSpriteSheet('tracer', tracer);	
	
	var debugger_sprite = new SpriteSheet('debugger.png', Debugger.WIDTH, Debugger.HEIGHT);
	debugger_sprite.addAnimation('normal', [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}], 1/5);
	debugger_sprite.addAnimation('homing', [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1}], 1/10);
	debugger_sprite.addAnimation('locked', [{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2}], 1/6);
	debugger_sprite.addAnimation('caught', [{x:0,y:3},{x:1,y:3}], 1/4);
	this.sprite_sheet_map.addSpriteSheet('debugger', debugger_sprite);
	
	var barrier = new SpriteSheet('barrier.png', Barrier.WIDTH, Barrier.HEIGHT);
	barrier.addAnimation('normal', [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0}], 1/8);
	this.sprite_sheet_map.addSpriteSheet('barrier', barrier);
	
	var bonusgate = new SpriteSheet('bonusgate.png', BonusGate.WIDTH, BonusGate.HEIGHT);
	bonusgate.addAnimation('static', [{x:0, y:0},{x:1,y:0},{x:2,y:0},{x:0, y:1},{x:1,y:1},{x:2,y:1}], .09);
	this.sprite_sheet_map.addSpriteSheet('bonusgate', bonusgate);
};

Tracerider.prototype.initTiles = function() {
	//var tile_list = ['yellow','red','green','purple','blue','black'];
	var tile_list = ['red','purple','blue','black'];	
	
	for (var i = 0; i < tile_list.length; i++) {
		var tile_name = tile_list[i];
		
		var tileset = new TileSet(tile_name + '.png', TraceriderLevel.TILE_SIZE);
		tileset.addTileType('0',  0, 0, ['solid']);
		tileset.addTileType('g',  1, 0, ['glitch']);
		tileset.addTileType('n',  2, 0, ['node1', 'node2']);
		tileset.addTileType('n1', 2, 0, ['node1']);
		tileset.addTileType('n2', 2, 0, ['node2']);
		tileset.addTileType('s',  2, 0, ['node1', 'node2', 'spin']);
		tileset.addTileType('s1', 2, 0, ['node1', 'spin']);
		tileset.addTileType('s2', 2, 0, ['node2', 'spin']);
		tileset.addTileType('_',  2, 0, ['barrier']);
		tileset.addTileType('o',  2, 0, ['bonusgate']);
		tileset.addTileType('b',  0, 1, ['solid'], TileGeometry.SHAPES.DIAGONAL_BL);
		tileset.addTileType('d',  1, 1, ['solid'], TileGeometry.SHAPES.DIAGONAL_BR);		
		tileset.addTileType('p',  3, 1, ['solid'], TileGeometry.SHAPES.DIAGONAL_TL);
		tileset.addTileType('q',  2, 1, ['solid'], TileGeometry.SHAPES.DIAGONAL_TR);			
		
		this.tile_map.addTileSet(tile_name, tileset);
	}
	
	var jail = new TileSet('jail.png', TraceriderLevel.TILE_SIZE);
	jail.addTileType('0', 0, 0, ['stops_players']);
	jail.addTileType('n', 1, 0, ['node1','node2']); // hack to make sure that the Tracers don't break the game
	jail.addTileType('=',  1, 0, ['barrier']);
	this.tile_map.addTileSet('jail', jail);
};

Tracerider.prototype.initBackgroundImages = function() {
	this.background_image_map.addBackgroundImage('red',    new BackgroundImage('red.png'));
	this.background_image_map.addBackgroundImage('blue',   new BackgroundImage('blue.png'));
	this.background_image_map.addBackgroundImage('purple', new BackgroundImage('purple.png'));
	this.background_image_map.addBackgroundImage('black',  new BackgroundImage('black.png'));
	
	this.background_image_map.addBackgroundImage('jail',   new BackgroundImage('jail.png'));
};

Tracerider.prototype.initFonts = function() {
	this.game_engine.initFont(Tracerider.FONT_NAME, 'Questrial-Regular.otf', 'otf');
	this.game_engine.initFont(Tracerider.GLITCH_FONT_NAME, 'pixel.ttf', 'ttf');
};

Tracerider.prototype.initKeys = function() {
	this.game_engine.key_handler.registerKey('LEFT_ARROW', 37, true);
	this.game_engine.key_handler.registerKey('RIGHT_ARROW', 39, true);
	this.game_engine.key_handler.registerKey('UP_ARROW', 38, true);
	this.game_engine.key_handler.registerKey('DOWN_ARROW', 40, true);
	this.game_engine.key_handler.registerKey('GLITCH', 16, true);
	this.game_engine.key_handler.registerKey('PAUSE', 32, false);

	this.game_engine.key_handler.registerKey('VOLUME_UP', 187, false);
	this.game_engine.key_handler.registerKey('VOLUME_DOWN', 189, false);
};

Tracerider.prototype.initSounds = function() {
	this.sound_map.addSound('song1', new Sound('Game_Jam_Song_1.mp3', true));
	this.sound_map.addSound('jail', new Sound('Prison_Theme_V2.mp3', true));
	this.sound_map.addSound('title', new Sound('Game_Jam_Title.mp3', true));
	
	this.sound_map.addSound('died', new Sound('died.wav', false));
	this.sound_map.addSound('blip', new Sound('blip.wav', false));
	this.sound_map.addSound('caught', new Sound('caught.wav', false));
	this.sound_map.addSound('glitch', new Sound('glitch.wav', false));
	this.sound_map.addSound('passed', new Sound('passed.wav', false));
	this.sound_map.addSound('restart', new Sound('restart.wav', false));
	this.sound_map.addSound('speedup', new Sound('speedup.wav', false));
	
};

Tracerider.prototype.showVolume = function() {
	this.ui_container.showVolume();
};

Tracerider.prototype.getWindow = function() {
	if (this.current_phase_name == 'jail' || this.current_phase_name == 'win' || this.current_phase_name == 'title')
		return Tracerider.parent.getWindow.call(this);
		
	else
		return Tracerider.SPLITSCREEN_WINDOW;
};

