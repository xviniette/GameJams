var game;
var score = 0;

var rand = (min, max) => {
	return Math.floor(Math.random() * (max + 1 - min) + min);
}

window.onload = () => {
	game = new Phaser.Game(640, 960, Phaser.AUTO, 'render');
	game.state.add('boot', boot);
	game.state.add('load', load);
	game.state.add('menu', menu);
	game.state.add('game', gameState);
	game.state.add('end', end);

	game.state.start('boot');
}