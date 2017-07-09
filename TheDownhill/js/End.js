var end = {
	elements: {},
	create() {
		this.elements.spriteRender = this.add.sprite(0, 0, null);

		this.elements.spriteRender.texture.destroy(true);
		this.elements.spriteRender.setTexture(PIXI.Texture.fromCanvas(threejsCanvas, PIXI.scaleModes.DEFAULT));
		this.camera.shake(0.005, 1500);


		//Title
		var text = this.add.text(this.world.width / 2, -100, 'Game Over', {
			font: '60px Arial',
			fill: '#f47442'
		});
		text.anchor.x = 0.5;
		this.add.tween(text).to({
			y: 50
		}, 800, Phaser.Easing.Bounce.Out, true, 1000);

		//Score Text
		var scoreText = `Score : ${score}`;
		var bestScore = localStorage.getItem(bestScoreTag);
		if (bestScore == null || score > bestScore) {
			scoreText = `New best : ${score}`;
			localStorage.setItem(bestScoreTag, score);
		}

		var text = this.add.text(this.world.width * 0.5, 200, scoreText, {
			font: "50px Arial",
			fill: "#f47442"
		});
		text.anchor.x = 0.5;
		text.alpha = 0;
		this.add.tween(text).to({
			alpha: 1
		}, 1000, Phaser.Easing.Sinusoidal.Out, true, 1500);

		//Best Score
		if (bestScore != null) {
			var bestText = `Best : ${bestScore}`;
			if (bestScore < score) {
				bestText = `Previous best : ${bestScore}`;
			}
			var text = this.add.text(this.world.width * 0.5, 300, bestText, {
				font: "50px Arial",
				fill: "#f47442"
			});
			text.anchor.x = 0.5;
			text.alpha = 0;
			this.add.tween(text).to({
				alpha: 1
			}, 1000, Phaser.Easing.Sinusoidal.Out, true, 1500);
		}


		//Play button
		var play = this.add.text(this.world.width * 0.5, 550, 'Replay', {
			font: "50px Arial",
			fill: "#f47442"
		});
		play.anchor.x = 0.5;
		play.anchor.y = 0.5;
		play.alpha = 0;

		play.inputEnabled = true;
		play.input.useHandCursor = true;

		this.add.tween(play).to({
			alpha: 1
		}, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000);

		play.events.onInputOver.add(() => {
			this.add.tween(play.scale).to({
				x:1.5,
				y:1.5
			}, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputOut.add(() => {
			this.add.tween(play.scale).to({
				x:1,
				y:1
			}, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputDown.add(() => {
			this.replay();
		}, this);


	},
	replay() {
		this.state.start('game');
	}
}