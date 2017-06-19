var gameState = {
	elements:{},
	wheels:null,
	oil:null,
	hero:null,
	score:0,
	gravity:500,
	initialization(){
		this.score = 0;

		this.generateWheels();
		this.generateHero();
	},
	restart(){
		this.state.start('game');
	},
	create(){
		this.world.setBounds(0, -8000, 480, 900000000000000000000);
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.initialization();


		var score = this.add.text(0, 0, this.score, { font: '20px Arial', fill: '#FFFFFF'});
		score.fixedToCamera = true;
		this.elements.score = score;

		this.camera.follow(this.hero);

		this.input.onTap.add(() => {
			this.jump();
		});
	},
	jump(){
		if(this.hero.grab){
			var speed = 300;
			this.hero.body.moves = true;
			this.hero.body.velocity.set(speed * Math.cos(this.hero.grab.angle + this.hero.grab.wheel.rotation), speed * Math.sin(this.hero.grab.angle + this.hero.grab.wheel.rotation));		
			this.hero.body.gravity.y = this.gravity;
			this.hero.grab.wheel.heroLeft = Date.now();
			this.hero.grab = null;
		}
	},
	update(){
		if(!this.hero.grab){
			this.physics.arcade.overlap(this.hero, this.wheels, (hero, wheel) => {
				if(!wheel.heroLeft || Date.now() - wheel.heroLeft > 200){
					this.setGrab(wheel, this.physics.arcade.angleBetween(wheel, hero));
				}
			});
		}
		
		this.wheels.forEach((wheel) => {
			wheel.body.angularVelocity = wheel.speed;
		});

		if(this.hero.grab){
			this.hero.body.moves = false;
			var wheel = this.hero.grab.wheel; 
			this.hero.body.gravity.y = 0;
			this.hero.x = wheel.x + wheel.width * 0.5 * Math.cos(this.hero.grab.angle + wheel.rotation);
			this.hero.y = wheel.y + wheel.width * 0.5 * Math.sin(this.hero.grab.angle + wheel.rotation);
		}

		if(this.hero.y < this.score){
			this.score = this.hero.y;
			this.elements.score.setText(Math.floor(-this.score));
		}
	},
	render(){
		this.wheels.forEach((wheel) => {
			//game.debug.body(wheel);
		});

		// game.debug.cameraInfo(game.camera, 32, 32);

		// game.debug.bodyInfo(this.hero, 0, 200);
	},
	generateWheels(){
		this.wheels = this.add.group();

		if(this.wheels.children.length == 0){
			var radius = 50;
			this.wheels.add(this.generateWheel(this.world.width / 2, radius, radius * 2, 0));

			this.wheels.add(this.generateWheel(this.world.width / 2, radius, radius * 2, 0));
		}



		/*var distanceLimit = this.display.canvas.height * 2;
		while(this.wheels[this.wheels.length - 1].y > this.player.y - distanceLimit){
			var prev = this.wheels[this.wheels.length - 1];
			var r = rand(10, 60);

			var radius = rand(40, 120);

			do {
				var angle = -(Math.random() * (2.8 - 0.15) + 0.15);
				var x = prev.x + Math.cos(angle) * (radius + r + prev.radius);
				var y = prev.y + Math.sin(angle) * (radius + r + prev.radius);
			} while (x - r - this.player.radius < 0 || x + r + this.player.radius > this.width);
			this.wheels.push(new Wheel(x, y, r, (Math.random() > 0.5 ? 1 : -1) * Math.radians(rand(5, 10))));
		}*/
	},
	generateWheel(x, y, diameter, rotationSpeed){
		var wheel = this.add.sprite(x, y, 'wheel');
		wheel.anchor.setTo(0.5);
		wheel.width = diameter;
		wheel.height = diameter;
		this.physics.arcade.enable(wheel);
		wheel.body.setCircle(diameter/2);
		wheel.body.immovable = true;
		wheel.speed = rotationSpeed;
		return wheel;
	},
	generateHero(){
		this.hero = this.add.graphics();
		this.hero.anchor.set(0.5, 0.5);
		this.hero.beginFill(0xFFFFFF);
		this.hero.drawCircle(0, 0, 20);
		this.hero.endFill();

		this.physics.arcade.enable(this.hero);
		this.hero.body.setCircle(10, -10, -10);

		this.hero.body.gravity.y = this.gravity;

		this.setGrab(this.wheels.getAt(0), -Math.PI/2);
	},
	generateOil(){
		var oil = this.add.sprite()
	},
	setGrab(wheel, angle){
		this.hero.grab = {
			wheel:wheel,
			angle:angle - wheel.rotation
		};
	}
}