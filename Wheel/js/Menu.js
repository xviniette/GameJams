var menu = {
	create(){
		//Title
		var text = this.add.text(240, 200, 'Waterdrop escape', { font: '20px Arial', fill: '#FFFFFF'});
		text.anchor.x = 0.5;

		//Play button
		var play = this.add.text(240, 400, 'Play', { font: '20px Arial', fill: '#FFFFFF'});
		play.inputEnabled = true;
		play.input.useHandCursor = true;
		play.anchor.x = 0.5;

		play.events.onInputDown.add(() => {
			this.play();
		}, this);


		//JAM TEXT
		var jam = this.add.text(10, 610, '#RemakeJam', { font: '20px Arial', fill: '#FFFFFF'});
		jam.inputEnabled = true;
		jam.input.useHandCursor = true;
		jam.events.onInputDown.add(() => {
			window.open('https://itch.io/jam/remakejam', '_blank');
		}, this);

		//ME TEXT
		var me = this.add.text(470, 610, '@xviniette', { font: '20px Arial', fill: '#FFFFFF'});
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