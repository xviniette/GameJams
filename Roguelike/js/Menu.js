var menu = {
	create(){
		var music = this.add.audio('music', 0.3, true);
		music.play();

		var stars = game.add.sprite(0, 0, 'starsanimation');
		var walk = stars.animations.add('walk');
	    stars.animations.play('walk', 3, true);

	    var lava = this.add.sprite(0, 540, 'lava');
		this.add.tween(lava).to( { y:560}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		//Title
		var title = this.add.sprite(240, 140, 'title');
		title.anchor.set(0.5);
		this.add.tween(title).to( { y:165}, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		//Button
    	var groupButton = this.add.group();
    	groupButton.x = 240;
    	groupButton.y = 420;
    	groupButton.scale.set(0.7);

    	var earthGroup = this.add.group();
    	this.add.tween(earthGroup).to({rotation:Math.PI*2}, 5000, Phaser.Easing.Linear.Default, true, 0, -1);
    	groupButton.add(earthGroup);

    	var earth = this.add.sprite(0, 0, 'earth');
    	earth.anchor.set(0.5);
    	earthGroup.add(earth);

    	var spaceship = this.add.sprite(0, 0, 'spaceship');
    	spaceship.anchor.set(0.5, 1);
    	spaceship.y = -140;
    	earthGroup.add(spaceship);

    	var play = this.add.sprite(10, 0, 'play');
    	play.anchor.set(0.5);
    	groupButton.add(play);

    	earth.inputEnabled = true;
		earth.input.useHandCursor = true;
    	earth.events.onInputOver.add(() => {
			this.add.tween(groupButton.scale).to( { x:0.8, y:0.8}, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		earth.events.onInputOut.add(() => {
			this.add.tween(groupButton.scale).to( { x:0.7, y:0.7 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);


		earth.events.onInputDown.add(() => {
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