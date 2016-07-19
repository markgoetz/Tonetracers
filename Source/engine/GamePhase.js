function GamePhase(transitions) {
	this.transitions = transitions;
}

GamePhase.prototype.updateLogic = function(game_state, delta) {
	throw 'updateLogic not defined.';
};

GamePhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	throw 'interpretInput not defined.';
};

GamePhase.prototype.renderGraphics = function(game_state, delta, context) {
	throw 'renderGraphics not defined.';
};

GamePhase.prototype.transitionFrom = function() {
	
};

GamePhase.prototype.transitionTo = function() {
	
};



function GamePhaseMap() {
	this.phases = new Object();
}

GamePhaseMap.prototype.addPhase = function(name, class_name, transitions) {
	if (this.phases[name])
		throw 'Duplicate phase name: ' + name;
	
	this.phases[name] = new window[class_name](transitions);
};

GamePhaseMap.prototype.getPhase = function(phase_name) {
	if (!this.phases[phase_name])
		throw 'Undefined phase name: ' + phase_name;
	
	return this.phases[phase_name];
};