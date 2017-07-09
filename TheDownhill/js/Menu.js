var menu = {
	elements: {},
	create() {
		this.stage.backgroundColor = "#d8d8d8";
		scene = new THREE.Scene();

		scene.fog = new THREE.Fog(0xd8d8d8, 0, 1500);
		camera = new THREE.PerspectiveCamera(75, this.scale.width / this.scale.height, 0.1, 2000);

		this.elements.spriteRender = this.add.sprite(0, 0, null);

		//Title
		var title = this.add.text(this.world.width / 2, 100, 'The downhill', {
			font: '60px Arial',
			fill: '#f47442'
		});
		title.anchor.set(0.5);

		//Play
		var play = this.add.text(this.world.width / 2, 300, 'Play', {
			font: '80px Arial',
			fill: '#f47442'
		});
		play.anchor.set(0.5);
		play.inputEnabled = true;
		play.input.useHandCursor = true;
		play.events.onInputOver.add(() => {
			this.add.tween(play.scale).to( { x:1.5, y:1.5}, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputOut.add(() => {
			this.add.tween(play.scale).to( { x:1, y:1}, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		play.events.onInputDown.add(() => {
			this.play();
		}, this);

		//JAM TEXT
		var jam = this.add.text(10, this.world.height - 30, '#MinimalisticJam', {
			font: '20px Arial',
			fill: '#f47442'
		});
		jam.inputEnabled = true;
		jam.input.useHandCursor = true;
		jam.events.onInputDown.add(() => {
			window.open('https://itch.io/jam/minimalistic-jam', '_blank');
		}, this);

		//ME TEXT
		var me = this.add.text(this.world.width - 10, this.world.height - 30, '@xviniette', {
			font: '20px Arial',
			fill: '#f47442'
		});
		me.anchor.x = 1;
		me.inputEnabled = true;
		me.input.useHandCursor = true;
		me.events.onInputDown.add(() => {
			window.open('https://github.com/xviniette', '_blank');
		}, this);

		this.ground = new THREE.Mesh(
			new THREE.PlaneGeometry(
				5000, 5000),
			new THREE.MeshLambertMaterial({
				color: 0xFFFFFF,
				side: THREE.DoubleSide
			}));
		this.ground.rotation.x = Math.PI / 2;
		scene.add(this.ground);

		//best score line

		var geometry = new THREE.PlaneGeometry(1000, 10);
		var material = new THREE.MeshBasicMaterial({
			color: 0xf4e542,
			side: THREE.DoubleSide
		});
		var plane = new THREE.Mesh(geometry, material);
		plane.rotation.x = Math.PI / 2;
		plane.position.z = this.bestScore;
		scene.add(plane);

		this.generateForest();


		var directional = new THREE.DirectionalLight(0xFFFFFF, 1, 100);
		scene.add(directional);

		var ambient = new THREE.AmbientLight(0xFFFFFF, 1);
		scene.add(ambient);

	},
	update() {
		camera.position.x = Math.cos(Date.now()/2000) * 500;
		camera.position.z = Math.sin(Date.now()/2000) * 500;
		camera.position.y = Math.cos(Date.now()/1000) * 50 + 200;
		camera.rotation.y = Math.PI;
		camera.rotation.x = Math.PI / 8;
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

		this.ground.position.x = camera.position.x;
		this.ground.position.z = camera.position.z + 20;
		renderer.render(scene, camera);

		this.elements.spriteRender.texture.destroy(true);
		this.elements.spriteRender.setTexture(PIXI.Texture.fromCanvas(threejsCanvas, PIXI.scaleModes.DEFAULT));
	},
	play() {
		this.state.start('game');
	},
	generateForest() {
		var size = 3000;
		var count = 1000;

		for (var i = 0; i < count; i++) {
			var obstacle = {
				x: this.rnd.between(0, size) - size/2,
				y: this.rnd.between(0, size) - size/2,
				radius: this.rnd.between(10, 30)
			}
			this.generate3DObj(obstacle);
		}
	},
	generate3DObj(obstacle) {
		var that = this;

		var height = obstacle.radius * this.rnd.realInRange(1.5, 5);
		obstacle.mesh = new THREE.Mesh(
			new THREE.ConeGeometry(
				obstacle.radius,
				height),
			new THREE.MeshPhongMaterial({
				color: 0x000000,
			}));

		obstacle.mesh.position.x = obstacle.x;
		obstacle.mesh.position.z = obstacle.y;
		obstacle.mesh.position.y = height / 2 + 3;


		scene.add(obstacle.mesh);

		var radius = obstacle.radius * this.rnd.realInRange(0.2, 0.4);
		obstacle.mesh = new THREE.Mesh(
			new THREE.CylinderGeometry(
				radius,
				radius,
				3,
				3),
			new THREE.MeshPhongMaterial({
				color: 0x000000
			}));

		obstacle.mesh.position.x = obstacle.x;
		obstacle.mesh.position.z = obstacle.y;
		obstacle.mesh.position.y = 1.5;

		scene.add(obstacle.mesh);
	},
}