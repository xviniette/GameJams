var gameState = {
	elements: {},
	player: {},
	obstacles: [],
	score: 0,
	bestScore: null,
	create() {
		scene = new THREE.Scene();

		this.score = 0;
		this.bestScore = null;
		var s = localStorage.getItem(bestScoreTag);
		if (s != undefined) {
			this.bestScore = s;
		}
		this.obstacles = [];
		this.generateHero();
		this.generateObstacles();

		this.elements.spriteRender = this.add.sprite(0, 0, null);


		var score = this.add.text(this.world.width - 10, 10, '', {
			font: '20px Arial',
			fill: '#FFFFFF'
		});
		score.anchor.x = 1;
		this.elements.score = score;

		this.ground = new THREE.Mesh(
			new THREE.PlaneGeometry(
				5000, 5000),
			new THREE.MeshLambertMaterial({
				color: 0xFFFFFF,
				side: THREE.DoubleSide
			}));
			this.ground.rotation.x = Math.PI/2;
		scene.add(this.ground);

		var directional = new THREE.DirectionalLight(0xFFFFFF, 1);
		scene.add(directional);


		var ambient = new THREE.AmbientLight(0xFFFFFF, 0.2);
		scene.add(ambient);
	},

	update(data) {
		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			this.player.x += this.player.lateralspeed;
		if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			this.player.x -= this.player.lateralspeed;

		this.player.y += this.player.speed;

		this.score = this.player.y;
		this.elements.score.setText(this.score);



		for (var obstacle of this.obstacles) {
			if (Math.sqrt(Math.pow(obstacle.x - this.player.x, 2) + Math.pow(obstacle.y - this.player.y, 2)) <= obstacle.radius + this.player.radius) {
				this.death();
			}
		}
		this.generateObstacles();
		camera.position.x = this.player.x;
		camera.position.z = this.player.y - 20;
		camera.position.y = 5;
		camera.rotation.y = Math.PI;
		camera.rotation.x = Math.PI / 8;

		this.ground.position.x = camera.position.x;
		this.ground.position.z = camera.position.z + 20;

		this.player.mesh.position.x = this.player.x;
		this.player.mesh.position.z = this.player.y;
		renderer.render(scene, camera);

		this.elements.spriteRender.texture.destroy(true);
		this.elements.spriteRender.setTexture(PIXI.Texture.fromCanvas(threejsCanvas, PIXI.scaleModes.DEFAULT));
	},
	generateHero() {
		this.player = {
			x: 0,
			y: 0,
			radius: 2,
			speed: 2,
			lateralspeed: 3
		}

		this.player.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(
				this.player.radius,
				6,
				6),
			new THREE.MeshLambertMaterial({
				color: 0xf4d942,
				side: THREE.DoubleSide
			}));

		scene.add(this.player.mesh);
	},
	generateObstacles() {
		var distance = 5000;
		var distanceBetween = 30;
		var width = {
			min: 400,
			max: 200
		}

		var maxScore = 10000;

		var generator = {
			min: 0.2,
			max: 0.8
		}

		if (this.obstacles.length == 0) {

			for (var i = -1; i <= 1; i++) {
				if (i == 0) {
					continue;
				}

				var obstacle = {
					x: i * width.min,
					y: 0,
					radius: 20
				}

				this.generate3DObj(obstacle);
				this.obstacles.push(obstacle);
			}
		}

		while (this.obstacles[this.obstacles.length - 1].y - this.player.y < distance) {
			var last = this.obstacles[this.obstacles.length - 1];

			for (var i = -1; i <= 1; i++) {
				if (i == 0) {
					continue;
				}

				var that = this;
				var obstacle = {
					x: i * that.math.linear(width.min, width.max, (last.y + distanceBetween) / maxScore),
					y: last.y + distanceBetween,
					radius: 20
				}

				this.generate3DObj(obstacle);
				this.obstacles.push(obstacle);
			}

			if (Math.random() < this.math.linear(generator.min, generator.max, (last.y + distanceBetween) / maxScore)) {
				var obstacle = {
					x: (Math.random() > 0.5 ? 1 : -1) * this.rnd.between(0, this.math.linear(width.min, width.max, (last.y + distanceBetween) / maxScore)),
					y: last.y + distanceBetween,
					radius: 20
				}

				this.generate3DObj(obstacle);
				this.obstacles.push(obstacle);
			}
		}
	},
	generate3DObj(obstacle) {
		obstacle.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(
				obstacle.radius,
				6,
				6),
			new THREE.MeshLambertMaterial({
				color: 0x5ff442,
				side: THREE.DoubleSide
			}));

		obstacle.mesh.position.x = obstacle.x;
		obstacle.mesh.position.z = obstacle.y;

		scene.add(obstacle.mesh);
	},
	death() {
		console.log("MORT");
		this.state.start('game');
	}
}