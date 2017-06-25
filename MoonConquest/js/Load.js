var load = {
	preload(){
		var images = {
			'earth':'./assets/img/earth.png',
			'moon':'./assets/img/moon.png',
			'spaceship':'./assets/img/spaceship.png',
			'play':'./assets/img/play.png',
			'title':'./assets/img/title.png',
			'asteroid':'./assets/img/asteroid.png',
			'lava':'./assets/img/lava.png',
			'stars':'./assets/img/stars.png',
			'over':'./assets/img/over.png',
			'replay':'./assets/img/replay.png',
			'particle1':'./assets/img/particulelune1.png',
			'particle2':'./assets/img/particulelune2.png',
		};

		for(var id in images){
			this.load.image(id, images[id]);
		}

		var audios = {
			'music':'./assets/audio/music.mp3',
			'jump':'./assets/audio/jump.wav',
			'explosion':'./assets/audio/explosion.mp3'
		}

		for(var id in audios){
			this.load.audio(id, audios[id]);
		}

		this.load.spritesheet('starsanimation', './assets/img/stars.png', 480, 640, 5);

		var loadingBar = this.add.sprite(0, 360, 'loading');
		this.load.setPreloadSprite(loadingBar);
		this.pourcentage = this.add.text(240, 320, "0%", { font: "30px Arial", fill: "#FFFFFF", align:'center' });
		this.pourcentage.anchor.x = 0.5;
	},
	loadUpdate(){
		this.pourcentage.setText(`${this.load.progress}%`);
	},
	create(){
		this.state.start('menu');
	}
}