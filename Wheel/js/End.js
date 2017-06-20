var end = {
	create(){
		//Title
		var text = this.add.text(240, 200, 'Perdu', { font: '20px Arial', fill: '#FFFFFF'});
		text.anchor.x = 0.5;

		//Play button
		var play = this.add.text(240, 400, 'Replay', { font: '20px Arial', fill: '#FFFFFF'});
		play.inputEnabled = true;
		play.input.useHandCursor = true;
		play.anchor.x = 0.5;

		play.events.onInputDown.add(() => {
			this.replay();
		}, this);
	},
	replay(){
		this.state.start('game');
	}
}