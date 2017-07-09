var boot = {
	preload() {
	},
	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, this.scale.width / this.scale.height, 0.1, 2000);

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha:true
		});
		renderer.setSize(this.scale.width, this.scale.height);

		threejsCanvas = renderer.domElement;

		this.state.start('load');
	}
}