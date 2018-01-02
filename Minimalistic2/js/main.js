var game;

var rand = (min, max) => {
	return Math.floor(Math.random() * (max + 1 - min) + min);
}

var getLine = (x0, y0, x1, y1) => {
	var pts = [];
	var swapXY = Math.abs(y1 - y0) > Math.abs(x1 - x0);
	var tmp;
	if (swapXY) {
		tmp = x0;
		x0 = y0;
		y0 = tmp;
		tmp = x1;
		x1 = y1;
		y1 = tmp;
	}

	if (x0 > x1) {
		tmp = x0;
		x0 = x1;
		x1 = tmp;
		tmp = y0;
		y0 = y1;
		y1 = tmp;
	}

	var deltax = x1 - x0;
	var deltay = Math.floor(Math.abs(y1 - y0));
	var error = Math.floor(deltax / 2);
	var y = y0;
	var ystep = y0 < y1 ? 1 : -1;
	if (swapXY)
		for (x = x0; x <= x1; x++) {
			pts.push({
				x: y,
				y: x
			});
			error -= deltay;
			if (error < 0) {
				y = y + ystep;
				error = error + deltax;
			}
		}
	else
		for (x = x0; x <= x1; x++) {
			pts.push({
				x: x,
				y: y
			});
			error -= deltay;
			if (error < 0) {
				y = y + ystep;
				error = error + deltax;
			}
		}
	return pts;
}

var hasFieldOfView = (map, x0, y0, x1, y1) => {
	var points = getLine(x0, y0, x1, y1);
	for(var pt of points){
		if(!map || !map[pt.x] || map[pt.x][pt.y] == undefined || map[pt.x][pt.y] != 0){
			return false;
		}
	}
	return true;
}

var getPath = (map, x0, y0, x1, y1) => {

}

window.onload = () => {
	game = new Phaser.Game(800, 600, Phaser.AUTO, 'render');
	game.state.add('boot', boot);
	game.state.add('load', load);
	game.state.add('menu', menu);
	game.state.add('game', gameState);
	game.state.add('end', end);

	game.state.start('boot');
}