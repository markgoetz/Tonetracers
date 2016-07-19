TraceriderPreloader.prototype = Object.create(Preloader.prototype);
TraceriderPreloader.parent = Preloader.prototype;

function TraceriderPreloader(width, height) {
	this.constructor(width, height);
}

TraceriderPreloader.prototype.renderPreloader = function(context) {
	var loaded_count = this.getLoadedCount();
	var total_count = this.getTotalCount();
	
	var bar_height = 15;
	var bar_width = this.width - (2 * 15);
	
	var x = 15;
	var y = (this.height - bar_height) / 2;
	
	context.strokeStyle = '#006452';
	context.lineWidth = .5;
	context.strokeRect(x, y, bar_width, bar_height);
	
	context.fillStyle = '#72ddca';
	context.fillRect(x, y, bar_width * (loaded_count / total_count), bar_height);
};