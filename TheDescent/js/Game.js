var gameState = {
	elements:{},
	player:{},
	obstacles:[],
	score:0,
	bestScore:null,
	create(){
		this.score = 0;
		this.bestScore = null;
		var s = localStorage.getItem(bestScoreTag);
		if(s != undefined){
			this.bestScore = s;
		}
		this.obstacles = [];
		this.generateHero();
		this.generateObstacles();

		var score = this.add.text(this.world.width - 10, 10, 'SCORE', { font: '20px Arial', fill: '#FFFFFF'});
		score.anchor.x = 1;
		this.elements.score = score;
	},
	update(data){
		this.player.y += 2;
		this.player.element.y = this.player.y;

		for(var obstacle of this.obstacles){
			if(Math.sqrt(Math.pow(obstacle.x - this.player.x, 2) + Math.pow(obstacle.y - this.player.y, 2)) <= obstacle.radius + this.player.radius){
				this.death();
			}			
		}
		this.generateObstacles();
	},
	generateHero(){
		this.player = {
			x:0, 
			y:0, 
			radius:5,
			direction:0,
			speed:2,
		}
		this.player.element = this.add.graphics(this.world.width/2);
		this.player.element.lineStyle(2, 0xf49b42);
		this.player.element.drawCircle(this.player.x, this.player.y, this.player.radius * 2);
	},
	generateObstacles(){
		var distance = 100;
		var distanceBetween = 30;
		var width = {
			min:400, 
			max:200
		}

		var maxScore = 400;

		var generator = {
			min:0.2,
			max:0.8
		}

		if(this.obstacles.length == 0){

			for(var i = -1; i <= 1; i++){
				if(i == 0){
					continue;
				}

				var obstacle = {
					x:i*width.min,
					y:0,
					radius:20
				}

				obstacle.element = this.add.graphics(this.world.width/2);
				obstacle.element.lineStyle(2, 0xFFFFFF);
				obstacle.element.drawCircle(obstacle.x, obstacle.y, obstacle.radius * 2);
				this.obstacles.push(obstacle);
			}
		}

		while(this.obstacles[this.obstacles.length - 1].y - this.player.y < distance){
			var last = this.obstacles[this.obstacles.length - 1];

			for(var i = -1; i <= 1; i++){
				if(i == 0){
					continue;
				}

				var that = this;
				var obstacle = {
					x:i*that.math.linear(width.min, width.max, (last.y  + distanceBetween)/maxScore),
					y:last.y  + distanceBetween,
					radius:20
				}

				obstacle.element = this.add.graphics(this.world.width/2);
				obstacle.element.lineStyle(2, 0xFFFFFF);
				obstacle.element.drawCircle(obstacle.x, obstacle.y, obstacle.radius * 2);
				this.obstacles.push(obstacle);
			}

			if(Math.random() < this.math.linear(generator.min, generator.max, (last.y  + distanceBetween)/maxScore)){
				var obstacle = {
					x:(Math.random() > 0.5 ? 1 : -1) * this.rnd.between(0, this.math.linear(width.min, width.max, (last.y  + distanceBetween)/maxScore)),
					y:last.y  + distanceBetween,
					radius:20
				}

				obstacle.element = this.add.graphics(this.world.width/2);
				obstacle.element.lineStyle(2, 0xFFFFFF);
				obstacle.element.drawCircle(obstacle.x, obstacle.y, obstacle.radius * 2);
				this.obstacles.push(obstacle);
			}
		}
	},
	death(){
		this.state.start('game');
	}
}