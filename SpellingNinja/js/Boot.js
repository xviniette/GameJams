var boot = {
	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// this.stage.disableVisibilityChange = true;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		var t1 = this.game.add.text(0, 0, "test", {
			"font": "1px Chalk",
			"fill": "#FFFFFF"
		});
		t1.visible = false

		this.state.start('load');
	}
}