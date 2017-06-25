var end = {
	create(){
		var stars = game.add.sprite(0, 0, 'starsanimation');
		var walk = stars.animations.add('walk');
	    stars.animations.play('walk', 3, true);

		//Lava
		var lava = this.add.sprite(0, 640, 'lava');
		this.add.tween(lava).to( { y:250 }, 1000, Phaser.Easing.Sinusoidal.Out, true);

		//Title
		var text = this.add.sprite(this.world.width * 0.5, -10, 'over');
		text.anchor.x = 0.5;
		this.add.tween(text).to( { y:30 }, 1000, Phaser.Easing.Bounce.Out, true);

		//Score Text
		var scoreText = `Score : ${score}`;
		var bestScore = localStorage.getItem('bestScoreMoonConquest');
		if(bestScore == null || score > bestScore){
			scoreText = `New best : ${score}`;
			localStorage.setItem('bestScoreMoonConquest', score);
		}

		var text = this.add.text(this.world.width * 0.5, 320, scoreText, { font: "50px Arial", fill: "#FFFFFF"});
		text.anchor.x = 0.5;
		text.alpha = 0;
		this.add.tween(text).to( { alpha:1 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000);

		//Best Score
		if(bestScore != null){
			var bestText = `Best : ${bestScore}`;
			if(bestScore < score){
				bestText = `Previous best : ${bestScore}`;
			}
			var text = this.add.text(this.world.width * 0.5, 400, bestText, { font: "50px Arial", fill: "#FFFFFF"});
			text.anchor.x = 0.5;
			text.alpha = 0;
			this.add.tween(text).to( { alpha:1 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000);
		}


		//Play button
		var play = this.add.sprite(this.world.width * 0.5, 550, 'replay');
		play.scale.setTo(0.7);
		play.anchor.x = 0.5;
		play.anchor.y = 0.5;
		play.alpha = 0;

		play.inputEnabled = true;
		play.input.useHandCursor = true;

		this.add.tween(play).to( { alpha:1 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000);

		play.events.onInputOver.add(() => {
			this.add.tween(play).to( { rotation:-Math.PI*2 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputOut.add(() => {
			this.add.tween(play).to( { rotation:0 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputDown.add(() => {
			this.replay();
		}, this);
	},
	replay(){
		this.state.start('game');
	}
}