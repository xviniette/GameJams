var gameState = {
	elements:{},
	wheels:null,
	oil:null,
	hero:null,
	walls:null,
	score:0,
	gravity:500,
	initialization(){
		this.wheels = null;
		this.score = 0;
		this.generateHero();
		this.generateWalls();
		this.generateWheels();
		this.generateOil();
		this.setGrab(this.wheels.getAt(0), -Math.PI/2);
	},
	restart(){
		this.state.start('game');
	},
	create(){
		this.world.setBounds(0, -9999999999999999, 480, 900000000000000000000);
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.initialization();


		var score = this.add.text(0, 0, this.score, { font: '20px Arial', fill: '#FFFFFF'});
		score.fixedToCamera = true;
		this.elements.score = score;

		this.camera.follow(this.hero);

		this.input.onDown.add(() => {
			this.jump();
		});
	},
	jump(){
		if(this.hero.grab){
			var speed = 500;
			this.hero.body.moves = true;
			this.hero.body.velocity.set(speed * Math.cos(this.hero.grab.angle + this.hero.grab.wheel.rotation), speed * Math.sin(this.hero.grab.angle + this.hero.grab.wheel.rotation));		
			this.hero.body.gravity.y = this.gravity;
			this.hero.grab.wheel.heroLeft = Date.now();
			this.hero.grab = null;
		}else if(this.hero.propulsion){
			this.hero.body.velocity.set(this.hero.propulsion * 200, -400);
			this.hero.body.gravity.y = this.gravity;
		}
		this.hero.propulsion = false;
	},
	update(){
		if(this.hero.grab){
			this.hero.body.moves = false;
			var wheel = this.hero.grab.wheel; 
			this.hero.body.gravity.y = 0;
			this.hero.x = wheel.x + wheel.width * 0.5 * Math.cos(this.hero.grab.angle + wheel.rotation);
			this.hero.y = wheel.y + wheel.width * 0.5 * Math.sin(this.hero.grab.angle + wheel.rotation);
			this.camera.follow(wheel);
		}else{
			this.camera.follow(this.hero);
		}

		if(!this.hero.grab){
			this.physics.arcade.overlap(this.hero, this.wheels, (hero, wheel) => {
				if(!wheel.heroLeft || Date.now() - wheel.heroLeft > 200){
					this.setGrab(wheel, this.physics.arcade.angleBetween(wheel, hero));
				}
			});
		}

		this.physics.arcade.overlap(this.hero, this.oil, (hero, oil) => {
			this.dead();
		});

		this.physics.arcade.overlap(this.hero, this.walls, (hero, wall) => {
			this.hero.body.gravity.y = 100;
			if(wall.propulsion == 1){
				this.hero.x = wall.x + wall.width + this.hero.radius;
			}else if(wall.propulsion == -1){
				this.hero.x = wall.x - this.hero.radius;
			}
			this.hero.body.velocity.x = 0;
			this.hero.propulsion = wall.propulsion;
		});
		
		this.wheels.forEach((wheel) => {
			wheel.body.angularVelocity = wheel.speed;
		});

		if(-this.score > 100){
			console.log("xDD");
			this.oil.body.velocity.set(0, -100);
		}

		if(this.hero.y < this.score){
			this.score = this.hero.y;
			this.elements.score.setText(Math.floor(-this.score));
		}
		this.generateWheels();
	},
	render(){
		// this.walls.forEach((wall) => {
		// 	game.debug.body(wall);
		// });

		// game.debug.cameraInfo(game.camera, 32, 32);

		// game.debug.bodyInfo(this.hero, 0, 200);
	},
	generateWheels(){
		if(!this.wheels){
			this.wheels = this.add.group();	
		}
		var getWheelData = () => {
			return {
				distance:this.rnd.between(50, 150),
				angle:this.rnd.realInRange(-Math.PI * 0.15, -Math.PI * 0.85),
				radius:this.rnd.between(20, 50),
				rotation:this.rnd.sign() * this.rnd.between(100, 500)
			}
		}

		if(this.wheels.children.length == 0){
			var radius = 20;
			this.wheels.add(this.generateWheel(this.world.width / 2, radius, radius * 2, 0));

			var wData = getWheelData();
			this.wheels.add(this.generateWheel(this.world.width / 2, - wData.distance - this.wheels.getAt(0).radius - wData.radius, wData.radius * 2, wData.rotation));
		}

		var generationDistance = this.camera.view.height;
		while(this.wheels.children[this.wheels.children.length - 1].y >= this.hero.y - generationDistance){
			var previousWheel = this.wheels.children[this.wheels.children.length - 1];

			do{
				var wData = getWheelData();
				var wheel = {
					x:previousWheel.x + Math.cos(wData.angle) * (wData.distance + previousWheel.radius + wData.radius),
					y:previousWheel.y + Math.sin(wData.angle) * (wData.distance + previousWheel.radius + wData.radius),
				}
			}while(wheel.x - this.hero.radius - wData.radius < 0 || wheel.x + this.hero.radius + wData.radius > this.world.width);
			this.wheels.add(this.generateWheel(wheel.x, wheel.y, wData.radius, wData.rotation));
		}
	},
	generateWheel(x, y, radius, rotationSpeed){
		var wheel = this.add.sprite(x, y, 'wheel');
		wheel.anchor.setTo(0.5, 0.5);
		wheel.radius = radius;
		wheel.width = radius*2;
		wheel.height = radius*2;
		this.physics.arcade.enable(wheel);
		wheel.body.setCircle(
			radius, 
			-radius + 0.5 * wheel.width / wheel.scale.x, 
			-radius + 0.5 * wheel.height / wheel.scale.y
			);
		wheel.body.immovable = true;
		wheel.speed = rotationSpeed;
		return wheel;
	},
	generateHero(){
		var hero = this.add.graphics();
		hero.radius = 10;
		hero.anchor.set(0.5, 0.5);
		hero.beginFill(0xFFFFFF);
		hero.drawCircle(0, 0, hero.radius * 2);
		hero.endFill();

		this.physics.arcade.enable(hero);
		hero.body.setCircle(
			hero.radius, 
			-hero.radius + 0.5 * hero.width / hero.scale.x, 
			-hero.radius + 0.5 * hero.height / hero.scale.y
			);

		hero.body.gravity.y = this.gravity;

		this.hero = hero;
	},
	generateOil(){
		var oil = this.add.graphics();
		oil.beginFill(0xFFE100);
		oil.drawRect(0, 0, this.camera.view.width, this.camera.view.height);
		oil.endFill();
		oil.alpha = 0.5;

		this.physics.arcade.enable(oil);
		oil.body.immovable = true;
		this.oil = oil;
	},
	generateWalls(){
		var width = 200;
		var displayingWidth = 10;
		this.walls = this.add.group();
		for(var position of ['left', 'right']){
			if(position == 'left'){
				var wall = this.add.graphics(-width + displayingWidth, 0);
				wall.propulsion = 1;
			}else{
				var wall = this.add.graphics(this.camera.view.width - displayingWidth , 0);
				wall.propulsion = -1;
			}
			wall.beginFill(0xf45c42);
			wall.drawRect(0, 0, 200, this.camera.view.height);
			wall.endFill();
			this.physics.arcade.enable(wall);
			wall.body.immovable = true;
			wall.fixedToCamera = true;
			this.walls.add(wall);
		}
	},
	setGrab(wheel, angle){
		this.hero.grab = {
			wheel:wheel,
			angle:angle - wheel.rotation
		};
	},
	dead(){
		this.state.start('end');
	}
}