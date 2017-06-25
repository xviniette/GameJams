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

		this.generateStars();
		this.initialization();

		var bestScore = localStorage.getItem('bestScoreMoonConquest');
		console.log(bestScore);
		if(bestScore){
			var best = this.add.graphics(0, -bestScore);
			best.lineStyle(1, 0xf4d742);
			best.moveTo(0,0);
			best.lineTo(480, 0);

			var best = this.add.text(460, -bestScore+5, `Best : ${bestScore}`, { font: '20px Arial', fill: '#f4d742'});
			best.anchor.set(1, 1);
		}
		
		var score = this.add.text(240, 0, this.score, { font: '30px Arial', fill: '#f4d742'});
		score.anchor.x = 0.5;
		score.fixedToCamera = true;
		this.elements.score = score;

		this.camera.follow(this.hero, null, 1, 0.2);

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
			this.hero.body.velocity.set(this.hero.propulsion * 200, -250);
			this.hero.body.gravity.y = this.gravity;
		}
		this.hero.propulsion = false;
	},
	update(){
		this.hero.rotation = this.hero.body.angle + Math.PI/2;
		if(this.hero.grab){
			this.hero.body.moves = false;
			var wheel = this.hero.grab.wheel; 
			this.hero.body.gravity.y = 0;
			this.hero.x = wheel.x + (wheel.width * 0.5 + this.hero.radius) * Math.cos(this.hero.grab.angle + wheel.rotation);
			this.hero.y = wheel.y + (wheel.width * 0.5 + this.hero.radius) * Math.sin(this.hero.grab.angle + wheel.rotation);
			this.hero.rotation = this.hero.grab.angle + wheel.rotation + Math.PI/2;

			this.camera.follow(wheel, null, 1, 0.2);
		}else{
			this.camera.follow(this.hero, null, 1, 0.2);
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
				this.hero.x = wall.x + wall.width + this.hero.radius - 2;
				this.hero.rotation = Math.PI/2;
			}else if(wall.propulsion == -1){
				this.hero.x = wall.x - this.hero.radius + 2;
				this.hero.rotation = -Math.PI/2;
			}
			this.hero.body.velocity.x = 0;
			this.hero.propulsion = wall.propulsion;
		});

		this.wheels.forEach((wheel) => {
			wheel.body.angularVelocity = wheel.speed;
		});

		var oilRatio = Math.min(1, Math.max(0, (-this.score - 100)/5000));
		this.oil.body.velocity.set(0, -oilRatio * 200);

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

		// game.debug.body(game.camera, 32, 32);

		// game.debug.bodyInfo(this.hero, 0, 0);
	},
	generateStars(){
		var stars = this.add.sprite(0, 0, 'starsanimation');
		var walk = stars.animations.add('walk');
		stars.animations.play('walk', 3, true);
		stars.fixedToCamera = true;
	},
	generateWheels(){
		if(!this.wheels){
			this.wheels = this.add.group();	
		}
		var getWheelData = () => {
			var ratio = Math.max(0, Math.min(-this.score/10000, 1));

			var getRationValue = (min, max) => {
				return (max - min) * ratio + min;
			}

			return {
				distance:this.rnd.between(getRationValue(50, 150), getRationValue(100, 200)),
				angle:this.rnd.realInRange(-Math.PI * 0.15, -Math.PI * 0.85),
				radius:this.rnd.between(getRationValue(60, 20), getRationValue(90, 40)),
				rotation:this.rnd.sign() * this.rnd.between(getRationValue(100, 300), getRationValue(200, 500))
			}
		}

		if(this.wheels.children.length == 0){
			var radius = 50;
			this.wheels.add(this.generateWheel(this.world.width / 2, radius, radius * 2, 0, 'earth'));

			var wData = getWheelData();
			this.wheels.add(this.generateWheel(this.world.width / 2, - wData.distance - this.wheels.getAt(0).radius - wData.radius, wData.radius, wData.rotation));
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
			}while(wheel.x - this.hero.radius * 2 - wData.radius - 10 < 0 || wheel.x + this.hero.radius * 2 + 10 + wData.radius> this.world.width);
			this.wheels.add(this.generateWheel(wheel.x, wheel.y, wData.radius, wData.rotation));
		}
	},
	generateWheel(x, y, radius, rotationSpeed, sprite = 'moon'){
		var wheel = this.add.sprite(x, y, sprite);
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
		var hero = this.add.sprite(0, 0, 'spaceship');
		hero.anchor.set(0.5, 0.75);
		hero.radius = 10;
		hero.scale.set(0.8);

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
		var oil = this.add.sprite(0, 200, 'lava');
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
			wall.beginFill(0xFFFFFF);
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
		score = Math.floor(-this.score);
		this.state.start('end');
	}
}