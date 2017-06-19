var menu = {
	create(){
		//Music
		var music = this.add.audio('music', 0.5, true);
		music.play();

		//Background
		var fond = this.add.sprite(0, 0, 'fond');

		//Particules
		var emitter = this.add.emitter(this.world.centerX, -10, 200);
		emitter.makeParticles(['p-gland', 'p-green', 'p-orange', 'p-yellow']);
		emitter.width = this.world.width * 1.5;
		emitter.start(false, 14000, 100);
		emitter.gravity = 50;


		//Title
		var text = this.add.sprite(240, 30, 'title');
		text.anchor.x = 0.5;
		var tween = this.add.tween(text).to( { y:60 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		//Play button
		var play = this.add.sprite(240, 460, 'play');
		play.inputEnabled = true;
		play.input.useHandCursor = true;
		play.anchor.x = 0.5;
		play.anchor.y = 0.5;

		play.events.onInputOver.add(() => {
			this.add.tween(play.scale).to( { x:1.2, y:1.2 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputOut.add(() => {
			this.add.tween(play.scale).to( { x:1, y:1 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);


		play.events.onInputDown.add(() => {
			this.play();
		}, this);


		//JAM TEXT
		var jam = this.add.text(10, 610, "Gamecodeur Gamejam #7", { font: "20px Arial", fill: "#FFFFFF"});
		jam.inputEnabled = true;
		jam.input.useHandCursor = true;
		jam.events.onInputDown.add(() => {
			window.open('https://itch.io/jam/gamecodeur-7', '_blank');
		}, this);

		//ME TEXT
		var me = this.add.text(470, 610, "@xviniette", { font: "20px Arial", fill: "#FFFFFF"});
		me.anchor.x = 1;
		me.inputEnabled = true;
		me.input.useHandCursor = true;
		me.events.onInputDown.add(() => {
			window.open('https://github.com/xviniette', '_blank');
		}, this);
	},
	play(){
		this.state.start('game');
	}
}