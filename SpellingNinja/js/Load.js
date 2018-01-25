var load = {
	preload() {
		var images = {
			'board': './assets/img/board.jpg',
		};

		for (var id in images) {
			this.load.image(id, images[id]);
		}

		var audios = {
			// 'music': './assets/audio/music.mp3',
		}

		for (var id in audios) {
			this.load.audio(id, audios[id]);
		}

		var jsons = {
			'words': './assets/words.json'
		}

		for (var id in jsons) {
			this.load.json(id, jsons[id]);
		}

		var graphics = this.add.graphics();
		graphics.beginFill(0xffffff);
		graphics.drawRect(0, 0, this.game.width, 5);
		graphics.endFill();

		var loadingBar = this.add.sprite(0, this.game.height / 2 + 50, graphics.generateTexture());
		graphics.destroy();

		this.load.setPreloadSprite(loadingBar);
		this.pourcentage = this.add.text(this.game.width / 2, this.game.height / 2, "0%", {
			font: "30px Chalk",
			fill: "#FFFFFF",
			align: 'center'
		});
		this.pourcentage.anchor.x = 0.5;
	},
	loadUpdate() {
		this.pourcentage.setText(`${this.load.progress}%`);
	},
	create() {
		this.state.start('menu');
	}
}