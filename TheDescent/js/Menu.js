var menu = {
	create(){
		//Title
		var title = this.add.text(this.world.width/2, 140, 'The descent', { font: '20px Arial', fill: '#FFFFFF'});
		title.anchor.set(0.5);
		this.add.tween(title).to( { y:165}, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		//Play
		var play = this.add.text(this.world.width/2, 300, 'Play', { font: '20px Arial', fill: '#FFFFFF'});
		play.anchor.set(0.5);
		play.inputEnabled = true;
			play.input.useHandCursor = true;

		play.events.onInputDown.add(() => {
			this.play();
		}, this);

		//JAM TEXT
		var jam = this.add.text(10, this.world.height - 30, '#MinimalisticJam', { font: '20px Arial', fill: '#FFFFFF'});
		jam.inputEnabled = true;
		jam.input.useHandCursor = true;
		jam.events.onInputDown.add(() => {
			window.open('https://itch.io/jam/minimalistic-jam', '_blank');
		}, this);

		//ME TEXT
		var me = this.add.text(this.world.width - 10, this.world.height - 30, '@xviniette', { font: '20px Arial', fill: '#FFFFFF'});
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