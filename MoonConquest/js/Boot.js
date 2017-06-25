var boot = {
	preload(){
		this.load.image('loading', './assets/img/loader.png');
	},
	create(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.state.start('load');
	}
}