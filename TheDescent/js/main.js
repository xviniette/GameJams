var game;
var score = 0;
var bestScoreTag = 'bestScoreDescent';

window.onload = () => {
	game = new Phaser.Game(800, 600, Phaser.AUTO, 'render');
	game.state.add('boot', boot);
	game.state.add('load', load);
	game.state.add('menu', menu);
	game.state.add('game', gameState);
	game.state.add('end', end);

	game.state.start('boot');
}