var gameState = {
	el: {},
	score: 0,
	life: 3,
	lastSpawn: Date.now(),
	entities: [],
	restart() {
		this.state.start('game');
	},
	create() {
		this.score = 0;
		this.life = 3;
		this.lastSpawn = Date.now();

		this.physics.startSystem(Phaser.Physics.ARCADE);

		var board = this.add.sprite(0, 0, 'board');

		this.el.life = this.add.text(50, 50, this.life, {
			font: "50px Chalk",
			fill: "#FFFFFF",
			align: 'left'
		});

		this.el.score = this.add.text(this.game.width - 50, 50, null, {
			font: "50px Chalk",
			fill: "#FFFFFF",
			align: 'right'
		});
		this.el.score.anchor.x = 1;
		this.el.score.score = this.score;
		

		setTimeout(() => {
			this.addScore(158);
		}, 2000);
	},
	update() {
		// this.spawn();
	},
	render() {
		this.el.score.setText(Math.round(this.el.score.score));
	},
	addScore(score) {
		this.score += score;
		this.add.tween(this.el.score).to({
			score: this.score
		}, 2000, Phaser.Easing.Exponential.Out, true);
	},
	spawn() {
		if (Date.now() - this.lastSpawn > 500) {
			this.lastSpawn = Date.now();

			var isFalse = Math.random() < 0.8 ? true : false;

			var word;
			var words = this.cache.getJSON('words');
			if (isFalse) {
				word = words.incorrect[Math.floor(Math.random() * words.incorrect.length)];
			} else {
				word = words.correct[Math.floor(Math.random() * words.correct.length)];
			}

			var text = this.add.text(this.game.width - 50, 50, word, {
				font: "50px Chalk",
				fill: "#FFFFFF",
				align: 'right'
			});

			this.physics.enable(text, Phaser.Physics.ARCADE);
			text.body.velocity.setTo(200, 200);
			text.body.collideWorldBounds = true;
			text.body.bounce.set(0.95);
			text.body.gravity.set(0, 180);

		}
	},
}