var boot = {
	preload() {
		// this.load.image('loading', './assets/img/loader.png');
	},
	create() {
		// this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// this.scale.pageAlignHorizontally = true;
		// this.scale.pageAlignVertically = true;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(800, 600);
		document.querySelector("#threejs").appendChild(renderer.domElement);

		this.state.start('load');
	}
}