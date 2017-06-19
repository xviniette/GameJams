var end = {
	create(){
		//Background
		var fond = this.add.sprite(0, 0, 'fond');

		//Particules
		var emitter = this.add.emitter(this.world.centerX, -10, 200);
		emitter.makeParticles(['p-gland', 'p-green', 'p-orange', 'p-yellow']);
		emitter.width = this.world.width * 1.5;
		emitter.start(false, 14000, 100);
		emitter.gravity = 50;


		//Title
		var text = this.add.sprite(this.world.width * 0.5, -10, 'over');
		text.anchor.x = 0.5;
		var tween = this.add.tween(text).to( { y:30 }, 1000, Phaser.Easing.Bounce.Out, true);


		//Score Text
		var scoreText = `Score : ${score}`;
		var bestScore = localStorage.getItem('bestScore');
		if(bestScore == null || score > bestScore){
			scoreText = `New best : ${score}`;
			localStorage.setItem('bestScore', score);
		}

		var text = this.add.text(this.world.width * 0.5, 280, scoreText, { font: "50px Arial", fill: "#FFFFFF"});
		text.anchor.x = 0.5;
		text.alpha = 0;
		this.add.tween(text).to( { alpha:1 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1000);

		//Best Score
		if(bestScore != null){
			var bestText = `Best : ${bestScore}`;
			if(bestScore < score){
				bestText = `Previous best : ${bestScore}`;
			}
			var text = this.add.text(this.world.width * 0.5, 380, bestText, { font: "50px Arial", fill: "#FFFFFF"});
			text.anchor.x = 0.5;
			text.alpha = 0;
			this.add.tween(text).to( { alpha:1 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 1500);
		}

		//Play Button
		var play = this.add.sprite(this.world.width * 0.5, 550, 'replay');
		play.scale.setTo(0.7);
		play.anchor.x = 0.5;
		play.anchor.y = 0.5;
		play.rotation = 0.5;
		play.alpha = 0;

		play.inputEnabled = true;
		play.input.useHandCursor = true;

		this.add.tween(play).to( { alpha:1 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 2000);

		play.events.onInputOver.add(() => {
			this.add.tween(play.scale).to( { x:0.8, y:0.8 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputOut.add(() => {
			this.add.tween(play.scale).to( { x:0.7, y:0.7 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputDown.add(() => {
			this.replay();
		}, this);
	},
	replay(){
		this.state.start('game');
	}
}