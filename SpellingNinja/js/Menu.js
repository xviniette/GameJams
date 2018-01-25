var menu = {
	chalk: null,
	lastMousePosition: null,
	create() {
		this.play();
		var board = this.add.sprite(0, 0, 'board');

		this.chalk = this.add.bitmapData(this.game.width, this.game.height);
		this.chalk.ctx.beginPath();
		this.chalk.ctx.lineWidth = "4";
		this.chalk.ctx.strokeStyle = "#FFFFFF";
		this.chalk.ctx.stroke();

		//Start
		var start = this.add.text(this.game.width / 2, this.game.height * 0.66, 'Start', {
			font: '80px Chalk',
			fill: '#ffffff'
		});
		start.anchor.x = 0.5;
		start.anchor.y = 0.5;
		start.align = "middle";
		start.inputEnabled = true;
		start.input.useHandCursor = true;
		start.events.onInputDown.add(() => {
			this.play();
		}, this);

		//ME TEXT
		var me = this.add.text(this.game.width / 2, this.game.height - 10, '@xviniette', {
			font: '30px Chalk',
			fill: '#FFFFFF'
		});
		me.anchor.x = 0.5;
		me.anchor.y = 1;
		me.inputEnabled = true;
		me.input.useHandCursor = true;
		me.events.onInputUp.add(() => {
			window.open('https://github.com/xviniette', '_blank');
		}, this);

		var chalkSprite = this.add.sprite(0, 0, this.chalk);


		//Title
		var title = this.add.text(this.game.width / 2, this.game.height * 0.33, 'Spelling\n Ninja', {
			font: '150px Chalk',
			fill: '#f4f4c6'
		});
		title.anchor.x = 0.5;
		title.anchor.y = 0.5;
		title.align = "middle";

		this.add.tween(title).to({
			y: "+25"
		}, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);


	},
	update() {
		if (this.input.activePointer.isDown) {
			this.drawChalk();
		} else {
			this.chalk.ctx.closePath();
			this.chalk.ctx.clearRect(0, 0, this.game.width, this.game.height);
		}
		this.lastMousePosition = {
			x: this.input.activePointer.x,
			y: this.input.activePointer.y
		};

		if (this.input.activePointer.isUp) {
			this.lastMousePosition = null;
		}
		this.chalk.dirty = true;
	},
	play() {
		this.state.start('game');
	},
	drawChalk() {
		if (!this.lastMousePosition) {
			return;
		}
		var x = this.input.x;
		var y = this.input.y;

		var xLast = this.lastMousePosition.x;
		var yLast = this.lastMousePosition.y;

		var brushDiameter = 20;
		this.chalk.ctx.beginPath();
		this.chalk.ctx.lineWidth = brushDiameter;
		this.chalk.ctx.lineCap = "round";
		this.chalk.ctx.strokeStyle = 'rgba(255, 40, 40,' + (0.6 + Math.random() * 0.2) + ')';
		this.chalk.ctx.moveTo(xLast, yLast);
		this.chalk.ctx.lineTo(x, y);
		this.chalk.ctx.stroke();

		return;
		var length = Math.round(Math.sqrt(Math.pow(x - xLast, 2) + Math.pow(y - yLast, 2)) / (5 / brushDiameter));
		var xUnit = (x - xLast) / length;
		var yUnit = (y - yLast) / length;
		for (var i = 0; i < length; i++) {
			var xCurrent = xLast + (i * xUnit);
			var yCurrent = yLast + (i * yUnit);
			var xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
			var yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
			this.chalk.ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
		}
	}
}