var gameState = {
	elements: {},
	player: {},
	obstacles: [],
	score: 0,
	bestScore: null,
	maxScore: 10000,
	create() {
		this.stage.backgroundColor = "#d8d8d8";
		scene = new THREE.Scene();

		scene.fog = new THREE.Fog(0xd8d8d8, 0, 2000);
		camera = new THREE.PerspectiveCamera(75, this.scale.width / this.scale.height, 0.1, 2000);

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

		var score = this.add.text(this.world.width / 2, 10, '', {
			font: '40px Arial',
			fill: '#f47442'
		});
		score.anchor.x = 0.5;
		this.elements.score = score;

		this.ground = new THREE.Mesh(
			new THREE.PlaneGeometry(
				5000, 5000),
			new THREE.MeshLambertMaterial({
				color: 0xFFFFFF,
				side: THREE.DoubleSide
			}));
		this.ground.rotation.x = Math.PI / 2;
		scene.add(this.ground);


		if (this.bestScore) {
			var geometry = new THREE.PlaneGeometry(1000, 10);
			var material = new THREE.MeshBasicMaterial({
				color: 0xf4e542,
				side: THREE.DoubleSide
			});
			var plane = new THREE.Mesh(geometry, material);
			plane.rotation.x = Math.PI / 2;
			plane.position.z = this.bestScore;
			scene.add(plane);
		}

		var directional = new THREE.DirectionalLight(0xFFFFFF, 1, 100);
		scene.add(directional);

		var ambient = new THREE.AmbientLight(0xFFFFFF, 1);
		scene.add(ambient);
	},

	update(data) {
		this.score = Math.floor(this.player.y);
		this.player.speed = this.math.linear(3, 10, Math.max(Math.min(this.score / (this.maxScore * 1.5), 1), 0));
		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) || (game.input.activePointer.isDown && game.input.activePointer.x < this.game.world.width/2))
			this.player.x += this.player.lateralspeed;
		if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || (game.input.activePointer.isDown && game.input.activePointer.x > this.game.world.width/2))
			this.player.x -= this.player.lateralspeed;

		this.player.y += this.player.speed;

		this.elements.score.setText(Math.max(this.score, 0));



		for (var obstacle of this.obstacles) {
			if (Math.sqrt(Math.pow(obstacle.x - this.player.x, 2) + Math.pow(obstacle.y - this.player.y, 2)) <= obstacle.radius + this.player.radius) {
				this.death();
			}
		}
		this.generateObstacles();
		camera.position.x = this.player.x;
		camera.position.z = this.player.y - 10;
		camera.position.y = 10;
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
			y: -200,
			radius: 2,
			speed: 0,
			lateralspeed: 2.5
		}

		this.player.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(
				this.player.radius,
				6,
				6),
			new THREE.MeshLambertMaterial({
				color: 0xf47442,
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

		var radius = {
			min: 10,
			max: 30
		}

		var maxScore = this.maxScore;

		var generator = {
			min: {
				min: 0.2,
				max: 0.5
			},
			max: {
				min: 0.5,
				max: 2
			}
		}

		if (this.obstacles.length == 0) {

			for (var i = -1; i <= 1; i++) {
				if (i == 0) {
					continue;
				}

				var obstacle = {
					x: i * width.min,
					y: 0,
					radius: this.rnd.between(radius.min, radius.max)
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
					x: i * that.math.linear(width.min, width.max, Math.min((last.y + distanceBetween) / maxScore, 1)),
					y: last.y + distanceBetween,
					radius: this.rnd.between(radius.min, radius.max)
				}

				this.generate3DObj(obstacle);
				this.obstacles.push(obstacle);
			}

			var nbTrees = this.rnd.realInRange(
				that.math.linear(generator.min.min, generator.max.min, Math.min((last.y + distanceBetween) / maxScore, 1)),
				that.math.linear(generator.min.max, generator.max.max, Math.min((last.y + distanceBetween) / maxScore, 1)),
			);

			for (var tree = 0; tree < Math.floor(nbTrees); tree++) {
				var obstacle = {
					x: (Math.random() > 0.5 ? 1 : -1) * this.rnd.between(0, that.math.linear(width.min, width.max, Math.min((last.y + distanceBetween) / maxScore, 1))),
					y: last.y + distanceBetween,
					radius: this.rnd.between(radius.min, radius.max)
				}

				this.generate3DObj(obstacle);
				this.obstacles.push(obstacle);
			}

			if (Math.random() < nbTrees - Math.floor(nbTrees)) {
				var obstacle = {
					x: (Math.random() > 0.5 ? 1 : -1) * this.rnd.between(0, that.math.linear(width.min, width.max, Math.min((last.y + distanceBetween) / maxScore, 1))),
					y: last.y + distanceBetween,
					radius: this.rnd.between(radius.min, radius.max)
				}

				this.generate3DObj(obstacle);
				this.obstacles.push(obstacle);
			}

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
	death() {
		score = this.score;
		this.state.start('end');
	}
}