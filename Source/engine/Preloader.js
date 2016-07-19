function Preloader(width, height) {
	this.width = width;
	this.height = height;
	
	this.items = new Array();
}

Preloader.prototype.renderPreloader = function(context) {};

Preloader.prototype.registerItem = function(item) {
	this.items.push(item);
};

Preloader.prototype.getTotalCount = function() {
	return this.items.length;
};

Preloader.prototype.getLoadedCount = function() {
	return this.items.filter(
		function (x) {
			if (x.isLoaded())
				return true;
			else
				return false;
		}
	).length;
};

Preloader.prototype.isDone = function() {
	if (this.getTotalCount() == this.getLoadedCount())
		return true;
	else
		return false;
};