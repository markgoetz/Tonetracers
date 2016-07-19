function TraceriderLevelMap() {
	this.levels = [
		new TraceriderLevel('level1'),
		new TraceriderLevel('level2'),
		new TraceriderLevel('level3'),
		new TraceriderLevel('level4'),						
		new TraceriderLevel('jail'),
		new TraceriderLevel('win'),
	];
}

TraceriderLevelMap.LEVEL_COUNT = 4;

TraceriderLevelMap.prototype.getLevel = function(level_number) {
	return this.levels[level_number];
};

TraceriderLevelMap.prototype.getLevelCount = function() {
	return this.levels.count;
};

TraceriderLevelMap.prototype.getLevelNumberByName = function(name) {
	for (var i = 0; i < this.levels.length; i++) {
		if (this.levels[i].folder_name == name)
			return i;
	}
	
	return null;
};
