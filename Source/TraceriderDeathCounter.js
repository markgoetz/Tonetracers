TraceriderDeathCounter.prototype = Object.create(TextUIElement.prototype);
TraceriderDeathCounter.parent = TextUIElement.prototype;

function TraceriderDeathCounter() {
	TextUIElement.call(this, '30px ' + Tracerider.FONT_NAME, TraceriderUIContainer.FONT_COLOR);
} 

TraceriderDeathCounter.prototype.getValue = function() {
	return game.game_state.level_deaths;
};
