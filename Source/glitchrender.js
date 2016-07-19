var image = null;

window.onload = function() {
	image = new Image();
	image.width=210;
	image.height=120;
	image.addEventListener('load', draw);
	image.src="sprites/player.png";
};

function draw() {
	var canvas = document.getElementById("CANVAS");
	var context = canvas.getContext("2d");	
	context.fillText('test', 0, 0);

	var chunks = [];
	for (var x = 0; x < 30; x += 5) {
		for (var y = 0; y < 60; y += 5) {
			chunks.push([x, y]);
		}
	}
	
	for (var frames = 0; frames < 3; frames++) {
		shuffle(chunks);
		var x = 0;
		var y = 0;
		
		for (var i = 0; i < chunks.length; i++) {
			var chunk = chunks[i];
			context.drawImage(image, x + frames * 30, y, 5, 5, chunk.x, chunk.y, 5, 5);
			
			x += 5;
			if (x == 30) {
				x = 0;
				y += 5;
			}
		}
	}
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};