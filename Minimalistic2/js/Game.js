var gameState = {
	map: [],
	entities: [],
	level: 0,
	tileSize: 10,
	init() {},
	create() {
		var mg = new MapGenerator({});
		generatedMap = mg.generateMap();
		this.map = generatedMap;

		this.tileSize = Math.min(this.game.width / this.map.length, this.game.height / this.map[0].length);

		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				if (this.map[i][j] == 1) {
					var tile = this.add.graphics(i * this.tileSize, j * this.tileSize);
					tile.beginFill(0xf4d742);
					tile.drawRect(0, 0, this.tileSize, this.tileSize);
				} else if (this.map[i][j].ennemy) {
					var tile = this.add.graphics(i * this.tileSize, j * this.tileSize);
					tile.beginFill(0x37d829);
					tile.drawRect(0, 0, this.tileSize, this.tileSize);
				} else if (this.map[i][j].spawn) {
					var tile = this.add.graphics(i * this.tileSize, j * this.tileSize);
					tile.beginFill(0xFF3300);
					tile.drawRect(0, 0, this.tileSize, this.tileSize);
				} else if (this.map[i][j].health) {
					var tile = this.add.graphics(i * this.tileSize, j * this.tileSize);
					tile.beginFill(0x4286f4);
					tile.drawRect(0, 0, this.tileSize, this.tileSize);
				} else if (this.map[i][j].end) {
					var tile = this.add.graphics(i * this.tileSize, j * this.tileSize);
					tile.beginFill(0xffffff);
					tile.drawRect(0, 0, this.tileSize, this.tileSize);
				}
			}
		}
	},
}