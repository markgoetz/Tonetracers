function GameGraphicsPhase() {}
GameGraphicsPhase.prototype = Object.create(GamePhase.prototype);
GameGraphicsPhase.parent = GamePhase.prototype;

GameGraphicsPhase.prototype._displayGameGraphics = function(game_state, context) {	
	game_state.current_level.renderBackground(context);
	game_state.current_level.renderGeometry(context);
	
	for (i = 0; i < game_state.actors.length; i++)
		game_state.actors[i].display(context);
	
	for (i = 0; i < game_state.effects.length; i++)
		game_state.effects[i].display(context);
};