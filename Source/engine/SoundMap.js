function SoundMap() {
	this.sounds = {};
};

SoundMap.prototype.addSound = function(name, sound) {
	if (this.sounds[name])
		throw 'Duplicate sound name:' + name;
	
	if (!sound instanceof Sound)
		throw 'sound is not a sound';
	
	this.sounds[name] = sound;
	game.game_engine.preloader.registerItem(sound);
};

SoundMap.prototype.getSound = function(name) {
	return this.sounds[name];
};

SoundMap.prototype.getCount = function() {
	return Object.keys(this.sounds).length;
};

function Sound(file_name, looping) {
	this.file_name = file_name;
	this.loaded = false;
	this.buffer = null;
	this.looping = looping;
	this.load();
};

Sound.prototype.load = function() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "sounds/" + this.file_name, true);
	xhr.responseType = "arraybuffer";
	xhr.sound = this;
	xhr.onload = function() {
		var context = game.game_engine.getAudioContext();
		context.decodeAudioData(
			xhr.response,
			function onSuccess(decodedBuffer) {
				xhr.sound.buffer = decodedBuffer;
				xhr.sound.loaded = true;
			}, function onFailure() {
				alert("Decoding the audio buffer failed");
			}
		);
	};
	
	xhr.send();
};

Sound.prototype.handleLoad = function(event) {
    var request = event.target;
    var audio_context = game.game_engine.getAudioContext();
    
    this.buffer = audio_context.createBuffer(request.response, true);

    this.loaded = true;
};

Sound.prototype.play = function() {
   this.source = game.game_engine.playSound(this.buffer, this.looping);
};

Sound.prototype.stop = function() {
	if (!this.source) return;
	this.source.disconnect();
};

Sound.prototype.isLoaded = function() {
	return this.loaded;
};
