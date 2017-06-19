var load = {
	preload(){
		var images = {
			'sky':'./img/sky.png',
			'0':'./img/sol.png',
			'1':'./img/gland.png',
			'2':'./img/pousse.png',
			'3':'./img/pousse2.png',
			'4':'./img/arbre.png',
			'5':'./img/arbre2.png',
			'6':'./img/souche.png',
			'7':'./img/caillou.png',
			'replay':'./img/replay.png',
			's-replay':'./img/replaysmall.png',
			'play':'./img/play.png',
			'fond':'./img/fond.png',
			'title':'./img/titre.png',
			'over':'./img/over.png',
			'p-gland':'./img/particules/gland.png',
			'p-green':'./img/particules/green.png',
			'p-orange':'./img/particules/orange.png',
			'p-yellow':'./img/particules/yellow.png'
		};

		for(var id in images){
			this.load.image(id, images[id]);
		}

		var audios = {
			'music':'./audio/SpiritedAway.mp3',
			'leaf':'./audio/leaf.wav',
			'bigleaf':'./audio/bigleaf.wav',
			'littleleaf':'./audio/littleleaf.wav'
		}

		for(var id in audios){
			this.load.audio(id, audios[id]);
		}

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