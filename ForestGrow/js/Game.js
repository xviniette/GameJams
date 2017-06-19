var gameState = {
	elements:{},
	mouse:{
		x:0,
		y:0
	},
	lastMouse:{
		x:null,
		y:null
	},
	size:{
		x:5,
		y:5
	},
	entities:{
		0:{
			spawn:0,
			weight:0,
			score:2430
		},
		1:{
			spawn:6,
			weight:60,
			score:0,
			next:2
		},
		2:{
			spawn:3,
			weight:20,
			score:10,
			next:3
		},
		3:{
			spawn:2,
			weight:10,
			score:30,
			next:4
		},
		4:{
			spawn:1,
			weight:5,
			score:90,
			next:5
		},
		5:{
			spawn:0,
			weight:0,
			score:270,
			next:6
		},
		6:{
			spawn:0,
			weight:0,
			score:810,
			next:0
		},
		7:{
			spawn:1,
			weight:0
		}
	},
	grid:[],
	hand:0,
	score:0,
	init(){
		this.score = 0;
		this.hand = 1;
		this.generateGrid();
		this.hand = this.getRandomHand();
	},
	generateGrid(){
		this.clearGrid();
		for(var id in this.entities){
			var entity = this.entities[id];
			for(var i = 0; i < entity.spawn; i++){
				var pos = {
					x:rand(0, this.size.x - 1),
					y:rand(0, this.size.y - 1),
				}

				var data = this.checkGrid(pos.x, pos.y, id);
				if(this.grid[pos.x][pos.y] == 0 && data.tiles.length < 3){
					this.grid[pos.x][pos.y] = id;
				}else{
					i--;
				}
			}
		}
	},
	clearGrid(){
		this.grid = [];
		for(var i = 0; i < this.size.x; i++){
			this.grid[i] = [];
			for(var j = 0; j < this.size.y; j++){
				this.grid[i][j] = 0;
			}
		}
	},
	getRandomHand(){
		var total = 0;
		for(var i in this.entities){
			total += this.entities[i].weight;
		}
		var random = rand(1, total);
		total = 0; 
		for(var i in this.entities){
			total += this.entities[i].weight;
			if(total >= random){
				return i; 
			}
		}
		return false;
	},
	put(x, y){
		var execData = (x, y, cb) => {
			var data = this.checkGrid(x, y);
			if(data.tiles.length >= 3){
				var score = 0;
				if(this.entities[data.id].next != undefined){
					score = this.entities[this.entities[data.id].next].score
				}
				var scoreToAdd = score + (score * 0.5) * (data.tiles.length - 3); 

				var floatingScore = this.elements.floatingScore;
				floatingScore.x = x * 96 + 96/2;
				floatingScore.y = y * 96 + 160;
				floatingScore.setText(`+${scoreToAdd}`);
				floatingScore.visible = true;
				var tween = this.add.tween(floatingScore).to({x:350, y:this.elements.score.y}, 500, Phaser.Easing.Cubic.In, true);

				tween.onComplete.add(() => {
					floatingScore.visible = false;
					this.score += scoreToAdd;
				});


				for(var tile of data.tiles){
					this.grid[tile.x][tile.y] = 0;
				}

				if(this.entities[data.id].next){
					this.grid[x][y] = this.entities[data.id].next;
				}

				var position = this.getPosition(x, y);

				var tween;
				for(var tile of data.tiles){
					tween = this.add.tween(this.elements.gridElements[tile.x][tile.y]).to( { x: position.x, y: position.y }, 500, Phaser.Easing.Sinusoidal.Out, true);	
				}

				tween.onComplete.add(() => {
					var nbParticules = {
						'1':{
							nb:5,
							width:30,
							height:30,
							sound:this.elements.sounds.littleleaf,
						},
						'2':{
							nb:10,
							width:70,
							height:50,
							sound:this.elements.sounds.littleleaf,
						},
						'3':{
							nb:20,
							width:90,
							height:70,
							sound:this.elements.sounds.leaf,
						},
						'4':{
							nb:50,
							width:110,
							height:90,
							sound:this.elements.sounds.bigleaf,
						},
						'5':{
							nb:50,
							width:110,
							height:90,
							sound:this.elements.sounds.bigleaf,
						},
						'6':{
							nb:50,
							width:80,
							height:50,
						},
					};

					var particleEmitter = this.elements.particleEmitter;
					particleEmitter.width = nbParticules[data.id].width;
					particleEmitter.height = nbParticules[data.id].height;

					particleEmitter.x = x * 96 + 96/2;
					particleEmitter.y = y * 96 + 160 - 12;
					particleEmitter.start(true, 1500, 0, nbParticules[data.id].nb, true);

					if(nbParticules[data.id].sound){
						nbParticules[data.id].sound.play();
					}

					this.drawEntities();
					execData(x, y, cb);
				});
			}else{
				cb();
			}
		}

		if(this.hand == null){
			return false;
		}

		if(this.grid[x] && this.grid[x][y] == 0){
			this.grid[x][y] = this.hand;
			this.hand = null;
			this.drawEntities();
			execData(x, y, () => {
				this.hand = this.getRandomHand();
				this.drawEntities();	
			});

			if(this.isItEnd()){
				window.score = this.score;

				var blackFade = this.add.graphics();
				blackFade.beginFill(0x000000);
				blackFade.drawRect(0, 0, 480, 640);
				blackFade.alpha = 0;

				setTimeout(() => {
					var tween = this.add.tween(blackFade).to( { alpha: 1 }, 1000, Phaser.Easing.Sinusoidal.Out, true);	
					tween.onComplete.add(() => {
						this.state.start('end');
					});
				}, 500);
			}
			return true;
		}
		return false;
	},
	checkGrid(x, y, id = null){
		var data = {
			id:0,
			tiles:[],
		};

		if(this.grid[x] == undefined || this.grid[x][y] == undefined){
			return data;
		}

		var tiles = {};

		data.id = id ? id : this.grid[x][y];
		tiles[`${x}|${y}`] = {x, y};

		var checked = {};

		var getNeighbours = (x, y) => {
			checked[`${x}|${y}`] = true;
			for(var i = x - 1; i <= x + 1; i++){
				for(var j = y - 1; j <= y + 1; j++){
					if(Math.abs(i - x) + Math.abs(j - y) != 1 || !this.grid[i] || !this.grid[i][j] || this.grid[i][j] != data.id){
						continue;
					}
					if(!tiles[`${i}|${j}`] && !checked[`${i}|${j}`]){
						tiles[`${i}|${j}`] = {x:i, y:j};
						getNeighbours(i, j);
					}
				}
			}
		}

		getNeighbours(x, y);
		data.tiles = Object.keys(tiles).map(key => tiles[key])
		return data;
	},
	restart(){
		this.state.start('game');
	},
	isItEnd(){
		for(var i in this.grid){
			for(var j in this.grid[i]){
				if(this.grid[i][j] == 0){
					return false;
				}
			}
		}
		return true;
	},
	create(){
		this.elements.sounds = {
			leaf:this.add.audio('leaf', 0.3),
			littleleaf:this.add.audio('littleleaf', 0.3),
			bigleaf:this.add.audio('bigleaf', 0.3),
		};

		this.stage.backgroundColor = 0xFFFFFF;
		this.init();
		this.generateSky();	
		this.generateGridRender();

		//FLOATING SCORE
		var floatingScore = this.add.text(0, 0, '', { font: "50px Arial", fill: "#f4ce42"});
		floatingScore.visible = false;
		floatingScore.anchor.x = 0.5;
		this.elements.floatingScore = floatingScore;

		//CURSOR
		var cursor = this.add.sprite(0, 0);
		cursor.anchor.set(0.5, 1);
		cursor.rotation = -0.02;
		this.add.tween(cursor).to( { rotation: 0.02 }, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
		this.elements.grid.add(cursor);
		this.elements.cursor = cursor;

		//PARTICLES
		var particleEmitter = this.add.emitter();
		particleEmitter.makeParticles(['p-gland', 'p-green', 'p-orange', 'p-yellow']);
		particleEmitter.gravity = 200;
		particleEmitter.setAlpha(1, 0, 4000, Phaser.Easing.Quintic.Out);
		this.elements.particleEmitter = particleEmitter;

		this.drawEntities();
		this.input.onTap.add((e) => {
			this.put(this.mouse.x, this.mouse.y);
		}, this);
	},
	generateSky(){
		var skyGroup = this.add.group();

		var hand = this.add.sprite(-15, -40, this.hand.toString());
		skyGroup.add(hand);
		this.elements.hand = hand;

		var sky = this.add.sprite(0, 0, 'sky');
		skyGroup.add(sky);

		var score = this.add.text(450, 45, this.score, { font: "70px Arial", fill: "#000000", align:'left' });
		score.anchor.x = 1;
		skyGroup.add(score);
		this.elements.score = score;

		var replay = this.add.sprite(190, 70, 's-replay');
		replay.anchor.set(0.5, 0.5);
		replay.inputEnabled = true;
		replay.input.useHandCursor = true;

		replay.events.onInputOver.add(() => {
			this.add.tween(replay).to( { rotation:-Math.PI*2}, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);

		replay.events.onInputOut.add(() => {
			this.add.tween(replay).to( { rotation:0 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
		}, this);


		replay.events.onInputDown.add(() => {
			this.restart();
		}, this);
	},
	generateGridRender(){
		var grid = this.add.group();
		var elements = [];

		this.elements.gridElements = [];

		for(var i = 0; i < this.grid.length; i++){
			elements[i] = [];
			this.elements.gridElements[i] = [];
			for(var j = 0; j < this.grid[i].length; j++){
				var position = this.getPosition(i, j);

				//Ground
				var ground = this.add.sprite(position.x, position.y, '0');
				ground.anchor.set(0.5, 1);
				ground.depth = -1;
				grid.add(ground);

				//Square
				var square = this.add.graphics(0 , 0);
				square.depth = -0.5;
				square.lineStyle(4, 0x000000);
				square.alpha = 0.05;
				square.drawRect(i * 96, j * 96, 96, 96);
				grid.add(square);

				var element = this.add.sprite(position.x, position.y);
				element.visible = false;
				element.anchor.set(0.5, 1);
				element.depth = j;
				var timeAnimation = 200;
				element.tween = this.add.tween(element).to( { rotation: 0.02 }, timeAnimation, Phaser.Easing.Sinusoidal.InOut, true, Math.floor(Math.random() * timeAnimation), -1, true);
				element.tween.pause();

				grid.add(element);
				this.elements.gridElements[i][j] = element;
			}
		}
		grid.y = 160;
		grid.sort('depth', Phaser.Group.SORT_ASCENDING);
		this.elements.grid = grid;
	},
	drawEntities(){
		for(var i = 0; i < this.grid.length; i++){
			for(var j = 0; j < this.grid[i].length; j++){
				var position = this.getPosition(i, j);
				var element = this.elements.gridElements[i][j];
				element.x = position.x;
				element.y = position.y;
				if(this.grid[i][j]){
					element.visible = true;
					element.loadTexture(this.grid[i][j].toString());
					element.tween.pause();
				}else{
					element.visible = false;
				}
			}
		}

		this.elements.score.setText(this.score);
		this.setHandElements();
	},
	setHandElements(){
		if(this.hand == null){
			return;
		}
		this.elements.hand.loadTexture(this.hand.toString());
		this.elements.cursor.loadTexture(this.hand.toString());
	},
	getPosition(x, y){
		return {
			x:x * 96 + 96/2,
			y:y * 96 + 96,
		}
	},
	update(){
		this.mouse.x = Math.floor(this.input.activePointer.x / 96);
		this.mouse.y = Math.floor((this.input.activePointer.y - 160) / 96);

		if(this.mouse.x != this.lastMouse.x || this.mouse.y != this.lastMouse.y){
			//If new case over
			var data = this.checkGrid(this.mouse.x, this.mouse.y, this.hand);
			var elements = this.elements.gridElements;
			for(var i = 0; i < elements.length; i++){
				for(var j = 0; j < elements.length; j++){
					elements[i][j].tween.pause();
					elements[i][j].rotation = 0;
				}
			}

			if(this.grid[this.mouse.x] && this.grid[this.mouse.x][this.mouse.y] == 0 && data.tiles.length >= 3){
				for(var tile of data.tiles){
					elements[tile.x][tile.y].rotation = -0.02;
					elements[tile.x][tile.y].tween.resume();
				}
			}
			this.lastMouse.x = this.mouse.x;
			this.lastMouse.y = this.mouse.y;
		}


		var cursor = this.elements.cursor;
		if(this.hand == null){
			cursor.visible = false;
			return;
		}
		if(this.grid[this.mouse.x] && this.grid[this.mouse.x][this.mouse.y] == 0){
			var position = this.getPosition(this.mouse.x, this.mouse.y);
			cursor.visible = true;
			cursor.x = position.x;
			cursor.y = position.y;
			cursor.depth = this.mouse.y;

			this.elements.grid.sort('depth', Phaser.Group.SORT_ASCENDING);
		}else{
			cursor.visible = false;
		}
	}
}